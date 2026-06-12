import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/courses`);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'school', label: 'School' },
    { id: 'pu_college', label: 'PU College' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1758270705087-76e81a5117bd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHw0fHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZGl2ZXJzZSUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3NzU5MDEzODF8MA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight mb-4">
            Our Courses
          </h1>
          <p className="text-xl text-gray-200 body-font">Comprehensive Education from Primary to Pre-University</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                data-testid={`category-${category.id}`}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 font-medium body-font transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#0A192F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner w-12 h-12 border-4 border-[#0A192F] border-t-transparent rounded-full"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 body-font">No courses available. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCourses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden card-hover"
                  data-testid={`course-${course.id}`}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-[#0A192F] p-3">
                        <BookOpen className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                      </div>
                      <span className="px-4 py-1 bg-gray-100 text-gray-700 text-sm font-medium body-font uppercase tracking-wider">
                        {course.category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#0A192F] heading-font mb-4">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 body-font leading-relaxed mb-6">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center text-gray-500 body-font">
                      <Clock className="w-5 h-5 mr-2 text-[#D4AF37]" strokeWidth={1.5} />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0A192F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white heading-font mb-6">
            Interested in Enrolling?
          </h2>
          <p className="text-lg text-gray-300 mb-8 body-font">
            Submit an enquiry and our admissions team will get back to you shortly.
          </p>
          <a
            href="/enquiry"
            data-testid="courses-cta-enquiry-btn"
            className="inline-block bg-[#D4AF37] text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#B4952F] btn-primary body-font"
          >
            Enquire Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Courses;
