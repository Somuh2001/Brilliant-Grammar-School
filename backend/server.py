from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import asyncio
import resend
from bson import ObjectId
from emergentintegrations.llm.chat import LlmChat, UserMessage

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
SCHOOL_EMAIL = os.environ.get('SCHOOL_EMAIL', 'admin@brilliantgrammar.edu')

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class EnquiryCreate(BaseModel):
    name: str
    parent_name: str
    email: EmailStr
    phone: str
    class_interested: str
    message: str

class EnquiryResponse(BaseModel):
    id: str
    name: str
    parent_name: str
    email: str
    phone: str
    class_interested: str
    message: str
    created_at: str
    status: str = "new"

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    duration: str

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    duration: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== STARTUP EVENTS ====================

@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.enquiries.create_index("created_at")
    await db.courses.create_index("category")
    
    # Seed admin
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@brilliantgrammar.edu')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if existing_admin is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing_admin["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated")
    
    # Write test credentials
    Path("/app/memory").mkdir(exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/login\n")
        f.write("- POST /api/auth/logout\n")
        f.write("- GET /api/auth/me\n")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, user["email"])
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return UserResponse(
        id=user_id,
        email=user["email"],
        name=user["name"],
        role=user.get("role", "user")
    )

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return UserResponse(
        id=user["_id"],
        email=user["email"],
        name=user["name"],
        role=user.get("role", "user")
    )

# ==================== ENQUIRY ROUTES ====================

@api_router.post("/enquiries")
async def create_enquiry(enquiry: EnquiryCreate):
    enquiry_id = str(uuid.uuid4())
    enquiry_doc = {
        "id": enquiry_id,
        "name": enquiry.name,
        "parent_name": enquiry.parent_name,
        "email": enquiry.email,
        "phone": enquiry.phone,
        "class_interested": enquiry.class_interested,
        "message": enquiry.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new"
    }
    
    await db.enquiries.insert_one(enquiry_doc)
    
    # Send email notification
    if resend.api_key:
        try:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0A192F;">New Enquiry Received</h2>
                    <p><strong>Student Name:</strong> {enquiry.name}</p>
                    <p><strong>Parent Name:</strong> {enquiry.parent_name}</p>
                    <p><strong>Email:</strong> {enquiry.email}</p>
                    <p><strong>Phone:</strong> {enquiry.phone}</p>
                    <p><strong>Class Interested:</strong> {enquiry.class_interested}</p>
                    <p><strong>Message:</strong></p>
                    <p>{enquiry.message}</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">This is an automated notification from Brilliant Grammar School website.</p>
                </body>
            </html>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [SCHOOL_EMAIL],
                "subject": f"New Enquiry: {enquiry.name} - {enquiry.class_interested}",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email notification sent for enquiry {enquiry_id}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    return EnquiryResponse(**enquiry_doc)

@api_router.get("/enquiries", response_model=List[EnquiryResponse])
async def get_enquiries(request: Request):
    await get_admin_user(request)
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return enquiries

@api_router.delete("/enquiries/{enquiry_id}")
async def delete_enquiry(enquiry_id: str, request: Request):
    await get_admin_user(request)
    result = await db.enquiries.delete_one({"id": enquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry deleted successfully"}

@api_router.patch("/enquiries/{enquiry_id}/status")
async def update_enquiry_status(enquiry_id: str, status: dict, request: Request):
    await get_admin_user(request)
    result = await db.enquiries.update_one(
        {"id": enquiry_id},
        {"$set": {"status": status.get("status", "new")}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Status updated successfully"}

# ==================== CONTACT ROUTES ====================

@api_router.post("/contact")
async def submit_contact(contact: ContactCreate):
    contact_id = str(uuid.uuid4())
    contact_doc = {
        "id": contact_id,
        "name": contact.name,
        "email": contact.email,
        "phone": contact.phone,
        "message": contact.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.contacts.insert_one(contact_doc)
    return {"message": "Contact message submitted successfully", "id": contact_id}

# ==================== COURSE ROUTES ====================

@api_router.get("/courses", response_model=List[CourseResponse])
async def get_courses():
    courses = await db.courses.find({}, {"_id": 0}).to_list(1000)
    return courses

@api_router.post("/courses")
async def create_course(course: CourseCreate, request: Request):
    await get_admin_user(request)
    course_id = str(uuid.uuid4())
    course_doc = {
        "id": course_id,
        "title": course.title,
        "description": course.description,
        "category": course.category,
        "duration": course.duration
    }
    
    await db.courses.insert_one(course_doc)
    return CourseResponse(**course_doc)

@api_router.delete("/courses/{course_id}")
async def delete_course(course_id: str, request: Request):
    await get_admin_user(request)
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}

# ==================== CHATBOT ROUTES ====================

@api_router.post("/chatbot", response_model=ChatResponse)
async def chatbot(chat_msg: ChatMessage):
    session_id = chat_msg.session_id or str(uuid.uuid4())
    
    try:
        emergent_key = os.environ.get('EMERGENT_LLM_KEY', '')
        if not emergent_key:
            raise HTTPException(status_code=500, detail="Chatbot service not configured")
        
        # Initialize chat with Gemini 3 Flash
        chat = LlmChat(
            api_key=emergent_key,
            session_id=session_id,
            system_message="""You are a helpful assistant for Brilliant Grammar School and PU College. 
            You help answer questions about:
            - School information and history
            - Available courses (School: Classes 1-10, PU College: Science, Commerce, Arts streams)
            - Facilities (Modern labs, Well-stocked library, Sports facilities)
            - Admission process and requirements
            - School timings and contact information
            
            Be friendly, informative, and encourage visitors to submit an enquiry form for detailed information.
            Keep responses concise and helpful."""
        ).with_model("gemini", "gemini-3-flash-preview")
        
        user_message = UserMessage(text=chat_msg.message)
        response = await chat.send_message(user_message)
        
        return ChatResponse(response=response, session_id=session_id)
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")

# ==================== SEED DATA ROUTE ====================

@api_router.post("/seed-courses")
async def seed_courses():
    existing = await db.courses.count_documents({})
    if existing > 0:
        return {"message": "Courses already exist"}
    
    courses = [
        {
            "id": str(uuid.uuid4()),
            "title": "Primary School (Classes 1-5)",
            "description": "Foundation education with focus on core subjects including English, Mathematics, Science, and Social Studies. Interactive learning methods and holistic development.",
            "category": "school",
            "duration": "5 Years"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Middle School (Classes 6-8)",
            "description": "Comprehensive curriculum preparing students for high school. Advanced concepts in all subjects with emphasis on critical thinking and problem-solving.",
            "category": "school",
            "duration": "3 Years"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "High School (Classes 9-10)",
            "description": "CBSE/State board curriculum with specialized coaching for board exams. Focus on academic excellence and career guidance.",
            "category": "school",
            "duration": "2 Years"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "PU Science Stream (PCMB/PCMC)",
            "description": "Pre-University science education with Physics, Chemistry, Mathematics, and Biology/Computer Science. Preparation for engineering and medical entrance exams.",
            "category": "pu_college",
            "duration": "2 Years"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "PU Commerce Stream",
            "description": "Commerce education with Accountancy, Business Studies, Economics, and Statistics. Foundation for CA, CS, and business management careers.",
            "category": "pu_college",
            "duration": "2 Years"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "PU Arts Stream",
            "description": "Humanities and arts education with History, Political Science, Economics, and optional languages. Preparation for civil services and liberal arts careers.",
            "category": "pu_college",
            "duration": "2 Years"
        }
    ]
    
    await db.courses.insert_many(courses)
    return {"message": f"Seeded {len(courses)} courses successfully"}

# ==================== INCLUDE ROUTER ====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
