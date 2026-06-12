import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A192F] text-white body-font">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* About Section */}
          <div className="md:col-span-4">
            <h3 className="text-2xl heading-font font-semibold text-[#D4AF37] mb-4">
              Brilliant Grammar School
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nurturing excellence in education since 1995. We provide quality education from primary to PU college level, focusing on holistic development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-white transition-colors duration-200">Courses</Link></li>
              <li><Link to="/facilities" className="text-gray-300 hover:text-white transition-colors duration-200">Facilities</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white transition-colors duration-200">Gallery</Link></li>
            </ul>
          </div>

          {/* Admissions */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Admissions</h4>
            <ul className="space-y-2">
              <li><Link to="/enquiry" className="text-gray-300 hover:text-white transition-colors duration-200">Enquire Now</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><Link to="/admin/login" className="text-gray-300 hover:text-white transition-colors duration-200">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-gray-300 text-sm">
                  123 Education Street, Bangalore, Karnataka 560001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" strokeWidth={1.5} />
                <span className="text-gray-300 text-sm">+91 80 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" strokeWidth={1.5} />
                <span className="text-gray-300 text-sm">info@brilliantgrammar.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Brilliant Grammar School and PU College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
