import requests
import sys
from datetime import datetime
import json

class SchoolAPITester:
    def __init__(self, base_url="https://bgs-portal.preview.emergentagent.com"):
        self.base_url = base_url
        self.cookies = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, use_cookies=False):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                if use_cookies:
                    response = requests.get(url, headers=headers, cookies=self.cookies)
                else:
                    response = requests.get(url, headers=headers)
            elif method == 'POST':
                if use_cookies:
                    response = requests.post(url, json=data, headers=headers, cookies=self.cookies)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, cookies=self.cookies)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, cookies=self.cookies)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def test_courses_api(self):
        """Test courses endpoints"""
        print("\n" + "="*60)
        print("TESTING COURSES API")
        print("="*60)
        
        # Get courses (should work without auth)
        success, response = self.run_test(
            "Get Courses (Public)",
            "GET",
            "/api/courses",
            200
        )
        
        if success:
            print(f"   Found {len(response)} courses")
        
        return success

    def test_auth_flow(self):
        """Test authentication flow"""
        print("\n" + "="*60)
        print("TESTING AUTHENTICATION")
        print("="*60)
        
        # Test login with correct credentials
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/api/auth/login",
            200,
            data={
                "email": "admin@brilliantgrammar.edu",
                "password": "admin123"
            }
        )
        
        if success:
            # Store cookies for subsequent requests
            login_response = requests.post(
                f"{self.base_url}/api/auth/login",
                json={"email": "admin@brilliantgrammar.edu", "password": "admin123"}
            )
            self.cookies = login_response.cookies
            print(f"   Logged in as: {response.get('email')}")
            print(f"   Role: {response.get('role')}")
        
        # Test get current user
        if success:
            success2, user_data = self.run_test(
                "Get Current User",
                "GET",
                "/api/auth/me",
                200,
                use_cookies=True
            )
        
        # Test login with wrong credentials
        self.run_test(
            "Login with Wrong Password",
            "POST",
            "/api/auth/login",
            401,
            data={
                "email": "admin@brilliantgrammar.edu",
                "password": "wrongpassword"
            }
        )
        
        return success

    def test_enquiry_flow(self):
        """Test enquiry submission and management"""
        print("\n" + "="*60)
        print("TESTING ENQUIRY FLOW")
        print("="*60)
        
        # Create enquiry (public endpoint)
        timestamp = datetime.now().strftime("%H%M%S")
        enquiry_data = {
            "name": f"Test Student {timestamp}",
            "parent_name": f"Test Parent {timestamp}",
            "email": f"test{timestamp}@example.com",
            "phone": "9876543210",
            "class_interested": "Class 5",
            "message": "This is a test enquiry"
        }
        
        success, response = self.run_test(
            "Submit Enquiry (Public)",
            "POST",
            "/api/enquiries",
            200,
            data=enquiry_data
        )
        
        enquiry_id = None
        if success:
            enquiry_id = response.get('id')
            print(f"   Created enquiry ID: {enquiry_id}")
        
        # Get all enquiries (admin only)
        success2, enquiries = self.run_test(
            "Get All Enquiries (Admin)",
            "GET",
            "/api/enquiries",
            200,
            use_cookies=True
        )
        
        if success2:
            print(f"   Found {len(enquiries)} enquiries")
        
        # Update enquiry status (admin only)
        if enquiry_id:
            self.run_test(
                "Update Enquiry Status (Admin)",
                "PATCH",
                f"/api/enquiries/{enquiry_id}/status",
                200,
                data={"status": "contacted"},
                use_cookies=True
            )
        
        # Delete enquiry (admin only)
        if enquiry_id:
            self.run_test(
                "Delete Enquiry (Admin)",
                "DELETE",
                f"/api/enquiries/{enquiry_id}",
                200,
                use_cookies=True
            )
        
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        print("\n" + "="*60)
        print("TESTING CONTACT FORM")
        print("="*60)
        
        timestamp = datetime.now().strftime("%H%M%S")
        contact_data = {
            "name": f"Test User {timestamp}",
            "email": f"contact{timestamp}@example.com",
            "phone": "9876543210",
            "message": "This is a test contact message"
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "/api/contact",
            200,
            data=contact_data
        )
        
        if success:
            print(f"   Contact ID: {response.get('id')}")
        
        return success

    def test_chatbot(self):
        """Test chatbot endpoint"""
        print("\n" + "="*60)
        print("TESTING CHATBOT")
        print("="*60)
        
        chat_data = {
            "message": "What courses do you offer?",
            "session_id": f"test_session_{datetime.now().strftime('%H%M%S')}"
        }
        
        success, response = self.run_test(
            "Chatbot Query",
            "POST",
            "/api/chatbot",
            200,
            data=chat_data
        )
        
        if success:
            print(f"   Response preview: {response.get('response', '')[:100]}...")
        
        return success

    def test_unauthorized_access(self):
        """Test that protected endpoints require authentication"""
        print("\n" + "="*60)
        print("TESTING UNAUTHORIZED ACCESS")
        print("="*60)
        
        # Clear cookies to test unauthorized access
        old_cookies = self.cookies
        self.cookies = {}
        
        # Try to get enquiries without auth
        self.run_test(
            "Get Enquiries Without Auth",
            "GET",
            "/api/enquiries",
            401
        )
        
        # Try to delete enquiry without auth
        self.run_test(
            "Delete Enquiry Without Auth",
            "DELETE",
            "/api/enquiries/test-id",
            401
        )
        
        # Restore cookies
        self.cookies = old_cookies
        
        return True

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test.get('test')}: {test.get('endpoint')}")
                if 'error' in test:
                    print(f"    Error: {test['error']}")
                else:
                    print(f"    Expected {test.get('expected')}, got {test.get('actual')}")
        
        return self.tests_passed == self.tests_run

def main():
    print("="*60)
    print("BRILLIANT GRAMMAR SCHOOL - API TESTING")
    print("="*60)
    
    tester = SchoolAPITester()
    
    # Run all tests
    tester.test_courses_api()
    auth_success = tester.test_auth_flow()
    
    if auth_success:
        tester.test_enquiry_flow()
        tester.test_contact_form()
        tester.test_chatbot()
        tester.test_unauthorized_access()
    else:
        print("\n⚠️  Skipping protected endpoint tests due to auth failure")
    
    # Print summary
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
