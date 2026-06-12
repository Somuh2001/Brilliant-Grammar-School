import React from 'react';
import { FlaskConical, Library, Dumbbell, Microscope, Trophy, Music } from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      icon: FlaskConical,
      title: 'Science Laboratories',
      description: 'State-of-the-art Physics, Chemistry, and Biology labs equipped with modern apparatus and safety equipment for hands-on learning.',
      image: 'https://images.unsplash.com/photo-1773489753005-dba9bf8d72bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwyfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMHN0dWRlbnRzJTIwaGlnaCUyMHNjaG9vbHxlbnwwfHx8fDE3NzU5MDEzOTJ8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Library,
      title: 'Well-Stocked Library',
      description: 'Extensive collection of over 15,000 books, journals, and digital resources. Quiet reading spaces and research facilities available.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80'
    },
    {
      icon: Dumbbell,
      title: 'Sports Facilities',
      description: 'Multi-purpose sports complex with facilities for cricket, basketball, volleyball, badminton, and athletics. Professional coaching available.',
      image: 'https://images.unsplash.com/photo-1759763494425-58fc490742ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHBsYXlpbmclMjBzcG9ydHMlMjBzY2hvb2wlMjBmaWVsZHxlbnwwfHx8fDE3NzU5MDEzOTJ8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Microscope,
      title: 'Computer Labs',
      description: 'Modern computer labs with high-speed internet, latest software, and 1:1 student-computer ratio for effective digital learning.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80'
    },
    {
      icon: Music,
      title: 'Arts & Music Room',
      description: 'Dedicated spaces for visual arts, music, and performing arts with professional equipment and trained instructors.',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80'
    },
    {
      icon: Trophy,
      title: 'Auditorium',
      description: 'Modern 500-seat auditorium with advanced audio-visual systems for events, seminars, and cultural programs.',
      image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-[#0A192F]">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight mb-4">
            Our Facilities
          </h1>
          <p className="text-xl text-gray-200 body-font">World-Class Infrastructure for Holistic Learning</p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {facilities.map((facility, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden card-hover"
                data-testid={`facility-${facility.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url('${facility.image}')` }}
                ></div>
                <div className="p-8">
                  <div className="bg-[#0A192F] p-3 inline-block mb-4">
                    <facility.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A192F] heading-font mb-4">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 body-font leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A192F] heading-font text-center mb-16">
            Additional Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4 text-[#D4AF37]">🚌</div>
              <h3 className="text-xl font-semibold text-[#0A192F] heading-font mb-2">Transport Facility</h3>
              <p className="text-gray-600 body-font">Safe and reliable bus service covering all major routes</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4 text-[#D4AF37]">🏥</div>
              <h3 className="text-xl font-semibold text-[#0A192F] heading-font mb-2">Medical Room</h3>
              <p className="text-gray-600 body-font">On-campus medical facility with trained staff</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4 text-[#D4AF37]">🍽️</div>
              <h3 className="text-xl font-semibold text-[#0A192F] heading-font mb-2">Cafeteria</h3>
              <p className="text-gray-600 body-font">Hygienic cafeteria serving nutritious meals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
