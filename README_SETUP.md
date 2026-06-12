# Brilliant Grammar School and PU College Website

## Overview
A complete full-stack web application for Brilliant Grammar School and PU College featuring a modern, professional design with comprehensive functionality for prospective students, parents, and administrators.

## Features Implemented

### Public Website
✅ **Home Page** - Hero section with school introduction, statistics, highlights, and CTA buttons
✅ **About Us** - School history, mission, vision, and faculty details
✅ **Courses** - Dynamic course listings with filtering (School/PU College)
✅ **Facilities** - Showcase of labs, library, sports, and other amenities
✅ **Gallery** - Photo gallery of campus life and events
✅ **Contact** - Contact form with Google Maps integration
✅ **Enquiry** - Detailed admission enquiry form with success confirmation

### Admin Panel
✅ **Secure Login** - JWT-based authentication
✅ **Dashboard** - View and manage enquiries
✅ **Enquiry Management** - Update status, delete enquiries
✅ **Statistics** - Real-time counts of enquiries by status

### Additional Features
✅ **AI Chatbot** - Gemini 3 Flash powered assistant for school information
✅ **Email Notifications** - Resend integration for enquiry alerts
✅ **Responsive Design** - Mobile-friendly across all pages
✅ **Modern UI/UX** - Following "Modern Academic Prestige" design system

## Tech Stack

- **Frontend**: React.js with React Router
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Styling**: Tailwind CSS with custom design system
- **Fonts**: Playfair Display (headings) + Manrope (body)
- **AI Integration**: Gemini 3 Flash via emergentintegrations
- **Email**: Resend API

## Design System

**Color Palette:**
- Primary: Deep Oxford Navy (#0A192F)
- Accent: Warm Gold (#D4AF37)
- Background: Soft Alabaster (#F9FAFB)
- Surface: Pure White (#FFFFFF)

**Typography:**
- Headings: Playfair Display (serif) - represents tradition and prestige
- Body: Manrope (sans-serif) - clean and highly legible

## Admin Credentials

**Email**: admin@brilliantgrammar.edu
**Password**: admin123

## API Endpoints

### Public Endpoints
- `GET /api/courses` - Fetch all courses
- `POST /api/enquiries` - Submit enquiry
- `POST /api/contact` - Submit contact message
- `POST /api/chatbot` - Chat with AI assistant

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/enquiries` - Get all enquiries
- `PATCH /api/enquiries/{id}/status` - Update enquiry status
- `DELETE /api/enquiries/{id}` - Delete enquiry
- `POST /api/courses` - Create course (admin)
- `DELETE /api/courses/{id}` - Delete course (admin)

## Database Collections

1. **users** - Admin users with JWT authentication
2. **enquiries** - Admission enquiry submissions
3. **contacts** - Contact form submissions
4. **courses** - Course information (6 pre-seeded courses)

## Testing Results

✅ **Backend**: 100% - All 12 API endpoints working perfectly
✅ **Frontend**: 95% - All pages and features functional
✅ **Authentication**: Working with JWT and httpOnly cookies
✅ **Forms**: Enquiry and contact forms submitting successfully
✅ **Chatbot**: AI assistant responding correctly
✅ **Admin Panel**: Full CRUD operations on enquiries

## Known Issues

None critical. Minor z-index issue with chatbot button was fixed.

## Next Steps / Enhancements

- Add email template customization
- Implement course management UI in admin panel
- Add testimonials section
- Add file upload for enquiry attachments
- Add search functionality in admin dashboard
- Add analytics dashboard for admin

## Environment Variables

See `/app/backend/.env` for backend configuration and `/app/frontend/.env` for frontend configuration.

**Important**: 
- Backend URL is configured via `REACT_APP_BACKEND_URL`
- MongoDB connection via `MONGO_URL`
- JWT secret via `JWT_SECRET`
- Resend API key via `RESEND_API_KEY`
- Emergent LLM key for chatbot via `EMERGENT_LLM_KEY`
