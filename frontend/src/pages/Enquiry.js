import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    email: '',
    phone: '',
    class_interested: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'PU 1 - Science', 'PU 1 - Commerce', 'PU 1 - Arts',
    'PU 2 - Science', 'PU 2 - Commerce', 'PU 2 - Arts'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/enquiries`, formData);
      setSubmitted(true);
      toast.success('Enquiry submitted successfully! We will contact you soon.');
      setFormData({
        name: '',
        parent_name: '',
        email: '',
        phone: '',
        class_interested: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-12">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#0A192F] heading-font mb-4">
              Thank You!
            </h2>
            <p className="text-lg text-gray-600 body-font mb-8">
              Your enquiry has been successfully submitted. Our admissions team will contact you within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                data-testid="submit-another-enquiry-btn"
                className="bg-[#0A192F] text-white px-6 py-3 font-semibold transition-all hover:bg-[#1E293B] body-font"
              >
                Submit Another Enquiry
              </button>
              <a
                href="/"
                className="border-2 border-[#0A192F] text-[#0A192F] px-6 py-3 font-semibold transition-all hover:bg-[#0A192F] hover:text-white body-font inline-block"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-[#0A192F]">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight mb-4">
            Admission Enquiry
          </h1>
          <p className="text-xl text-gray-200 body-font">Take the First Step Towards Excellence</p>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] heading-font mb-2">
              Enquiry Form
            </h2>
            <p className="text-gray-600 body-font mb-8">
              Fill in the details below and our admissions team will get in touch with you.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="enquiry-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 body-font mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    data-testid="enquiry-student-name-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 body-font mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    id="parent_name"
                    name="parent_name"
                    data-testid="enquiry-parent-name-input"
                    value={formData.parent_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                    placeholder="Enter parent/guardian name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 body-font mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    data-testid="enquiry-email-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 body-font mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    data-testid="enquiry-phone-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="class_interested" className="block text-sm font-medium text-gray-700 body-font mb-2">
                  Class/Course Interested *
                </label>
                <select
                  id="class_interested"
                  name="class_interested"
                  data-testid="enquiry-class-select"
                  value={formData.class_interested}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 body-font mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  data-testid="enquiry-message-input"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                  placeholder="Any specific questions or requirements?"
                ></textarea>
              </div>

              <button
                type="submit"
                data-testid="enquiry-submit-btn"
                disabled={loading}
                className="w-full bg-[#0A192F] text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#1E293B] btn-primary inline-flex items-center justify-center body-font disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    Submit Enquiry
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enquiry;
