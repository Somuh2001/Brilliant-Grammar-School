import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200 shadow-sm body-font">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" data-testid="nav-logo">
            <div className="bg-[#0A192F] p-2 group-hover:bg-[#1E293B] transition-colors duration-300">
              <GraduationCap className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-lg font-semibold text-[#0A192F] heading-font block leading-tight">
                Brilliant Grammar
              </span>
              <span className="text-xs text-gray-600 uppercase tracking-wider" style={{fontSize: '10px'}}>
                School & PU College
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-[#0A192F] border-b-2 border-[#D4AF37] pb-1'
                    : 'text-gray-600 hover:text-[#0A192F]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/enquiry"
              data-testid="nav-enquiry-btn"
              className="bg-[#0A192F] text-white px-6 py-3 font-medium transition-all duration-300 hover:bg-[#1E293B] btn-primary"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#0A192F] p-2 hover:bg-gray-100 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-[#0A192F] bg-gray-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/enquiry"
              data-testid="mobile-nav-enquiry-btn"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-4 bg-[#0A192F] text-white px-6 py-3 text-center font-medium transition-all hover:bg-[#1E293B]"
            >
              Enquire Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
