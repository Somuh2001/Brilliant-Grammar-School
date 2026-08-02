import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PerformanceTracker from './components/PerformanceTracker';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Enquiry from './pages/Enquiry';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <PerformanceTracker />
        <div className="App body-font">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navigation />
                <Home />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navigation />
                <About />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/courses" element={
              <>
                <Navigation />
                <Courses />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/facilities" element={
              <>
                <Navigation />
                <Facilities />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/gallery" element={
              <>
                <Navigation />
                <Gallery />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navigation />
                <Contact />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/enquiry" element={
              <>
                <Navigation />
                <Enquiry />
                <Footer />
                <Chatbot />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
