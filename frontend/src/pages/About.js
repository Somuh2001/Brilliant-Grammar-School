import React from 'react';
import { Target, Eye, Users } from 'lucide-react';

const About = () => {
  const faculty = [
    { name: 'Dr. Rajesh Kumar', position: 'Principal', qualification: 'Ph.D. in Education' },
    { name: 'Mrs. Priya Sharma', position: 'Vice Principal', qualification: 'M.Ed., M.A.' },
    { name: 'Mr. Arun Mehta', position: 'Head of Science', qualification: 'M.Sc., B.Ed.' },
    { name: 'Ms. Lakshmi Iyer', position: 'Head of Commerce', qualification: 'M.Com., MBA' },
    { name: 'Mr. Suresh Patel', position: 'Head of Arts', qualification: 'M.A., M.Phil.' },
    { name: 'Mrs. Kavita Reddy', position: 'Head of Primary Section', qualification: 'M.Ed., B.Sc.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZGl2ZXJzZSUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3NzU5MDEzODF8MA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-200 body-font">Excellence in Education Since 1995</p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A192F] heading-font mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 body-font leading-relaxed">
                <p>
                  Founded in 1995, Brilliant Grammar School and PU College has been at the forefront of quality education in Bangalore. What started as a small school with just 50 students has now grown into one of the most respected educational institutions in the region.
                </p>
                <p>
                  Our journey has been marked by consistent academic excellence, innovative teaching methodologies, and a commitment to nurturing well-rounded individuals. We believe in empowering our students not just with academic knowledge, but with values, ethics, and life skills that prepare them for the challenges of tomorrow.
                </p>
                <p>
                  Today, we proudly serve over 5,000 students from Classes 1 to PU 2, with a team of highly qualified and dedicated faculty members who are passionate about education and student development.
                </p>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="bg-[#0A192F] p-12 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <div className="space-y-6 text-white">
                  <div className="border-l-4 border-[#D4AF37] pl-6">
                    <h3 className="text-4xl font-bold heading-font text-[#D4AF37] mb-2">25+</h3>
                    <p className="text-gray-300 body-font">Years of Excellence</p>
                  </div>
                  <div className="border-l-4 border-[#D4AF37] pl-6">
                    <h3 className="text-4xl font-bold heading-font text-[#D4AF37] mb-2">5000+</h3>
                    <p className="text-gray-300 body-font">Happy Students</p>
                  </div>
                  <div className="border-l-4 border-[#D4AF37] pl-6">
                    <h3 className="text-4xl font-bold heading-font text-[#D4AF37] mb-2">98%</h3>
                    <p className="text-gray-300 body-font">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8 card-hover" data-testid="mission-section">
              <div className="bg-[#0A192F] p-4 inline-block mb-6">
                <Target className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-[#0A192F] heading-font mb-4">Our Mission</h3>
              <p className="text-gray-600 body-font leading-relaxed">
                To provide world-class education that nurtures academic excellence, character development, and social responsibility. We strive to create a learning environment that encourages creativity, critical thinking, and lifelong learning, preparing students to become confident, compassionate, and competent global citizens.
              </p>
            </div>

            <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8 card-hover" data-testid="vision-section">
              <div className="bg-[#0A192F] p-4 inline-block mb-6">
                <Eye className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-[#0A192F] heading-font mb-4">Our Vision</h3>
              <p className="text-gray-600 body-font leading-relaxed">
                To be recognized as a leading educational institution that sets the benchmark for academic excellence and holistic development. We envision a future where every student who walks through our doors emerges as a confident, ethical, and skilled individual ready to make a positive impact on society and contribute meaningfully to nation-building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A192F] mb-4">
              <Users className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A192F] heading-font mb-4">
              Our Expert Faculty
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto body-font">
              Highly qualified and experienced educators dedicated to student success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member, index) => (
              <div 
                key={index} 
                className="bg-gray-50 border border-gray-200 p-6 card-hover"
                data-testid={`faculty-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <h3 className="text-xl font-semibold text-[#0A192F] heading-font mb-2">
                  {member.name}
                </h3>
                <p className="text-[#D4AF37] font-medium body-font mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm body-font">{member.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
