import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-[#0A192F]">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 body-font">Get in Touch With Our Team</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] heading-font mb-8">
                Get In Touch
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#0A192F] p-3 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A192F] heading-font mb-1">Address</h3>
                    <p className="text-gray-600 body-font">
                      123 Education Street,<br />
                      Bangalore, Karnataka 560001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#0A192F] p-3 flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A192F] heading-font mb-1">Phone</h3>
                    <p className="text-gray-600 body-font">+91 80 1234 5678</p>
                    <p className="text-gray-600 body-font">+91 80 8765 4321</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#0A192F] p-3 flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A192F] heading-font mb-1">Email</h3>
                    <p className="text-gray-600 body-font">info@brilliantgrammar.edu</p>
                    <p className="text-gray-600 body-font">admissions@brilliantgrammar.edu</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#0A192F] p-3 flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A192F] heading-font mb-1">Office Hours</h3>
                    <p className="text-gray-600 body-font">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 body-font">Saturday: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6393285936273!2d77.59456931482146!3d12.971598990856157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1629876543210!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="School Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] heading-font mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 body-font mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      data-testid="contact-name-input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 body-font mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      data-testid="contact-email-input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                      placeholder="Enter your email"
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
                      data-testid="contact-phone-input"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 body-font mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      data-testid="contact-message-input"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    data-testid="contact-submit-btn"
                    disabled={loading}
                    className="w-full bg-[#0A192F] text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#1E293B] btn-primary inline-flex items-center justify-center body-font disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
