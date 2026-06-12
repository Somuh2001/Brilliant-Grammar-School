import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, BookOpen, Award, ArrowRight, Star, Building2, GraduationCap } from 'lucide-react';

const Home = () => {
  const stats = [
    { icon: Trophy, value: '98%', label: 'Success Rate' },
    { icon: Users, value: '5000+', label: 'Students' },
    { icon: BookOpen, value: '50+', label: 'Expert Faculty' },
    { icon: Award, value: '25+', label: 'Years of Excellence' }
  ];

  const highlights = [
    {
      title: 'Academic Excellence',
      description: 'Consistently achieving top results in board examinations and competitive entrance exams.',
      icon: GraduationCap
    },
    {
      title: 'Modern Infrastructure',
      description: 'State-of-the-art laboratories, digital classrooms, and well-equipped library facilities.',
      icon: Building2
    },
    {
      title: 'Holistic Development',
      description: 'Focus on sports, arts, and extracurricular activities for complete personality development.',
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-up opacity-0 stagger-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight leading-none mb-6">
              Brilliant Grammar School<br />
              <span className="text-[#D4AF37]">& PU College</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-8 body-font leading-relaxed">
              Empowering minds, shaping futures. Excellence in education from primary to pre-university with a legacy of 25+ years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/enquiry"
                data-testid="hero-enquiry-btn"
                className="bg-[#D4AF37] text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#B4952F] btn-primary inline-flex items-center justify-center body-font"
              >
                Enquire Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                data-testid="hero-learn-more-btn"
                className="border-2 border-white text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-white hover:text-[#0A192F] inline-flex items-center justify-center body-font"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center fade-in-up opacity-0" style={{animationDelay: `${0.2 + index * 0.1}s`}} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A192F] mb-4">
                  <stat.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#0A192F] heading-font mb-2">{stat.value}</h3>
                <p className="text-gray-600 body-font">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section - Bento Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A192F] heading-font tracking-tight mb-4">
              Why Choose Brilliant Grammar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto body-font">
              A tradition of excellence, innovation, and holistic education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {highlights.map((highlight, index) => (
              <div 
                key={index} 
                className={`${index === 0 ? 'md:col-span-12' : 'md:col-span-6'} bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden card-hover p-8`}
                data-testid={`highlight-${highlight.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-[#0A192F] p-3 flex-shrink-0">
                    <highlight.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#0A192F] heading-font mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 body-font leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0A192F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white heading-font mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 body-font leading-relaxed">
            Join thousands of successful students who started their journey with us. Admissions open for the new academic year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/enquiry"
              data-testid="cta-enquiry-btn"
              className="bg-[#D4AF37] text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#B4952F] btn-primary inline-flex items-center justify-center body-font"
            >
              Submit Enquiry
            </Link>
            <Link
              to="/contact"
              data-testid="cta-contact-btn"
              className="border-2 border-white text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-white hover:text-[#0A192F] inline-flex items-center justify-center body-font"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
