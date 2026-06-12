import React from 'react';

const Gallery = () => {
  const galleryImages = [
    {
      url: 'https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'School Campus',
      category: 'Infrastructure'
    },
    {
      url: 'https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZGl2ZXJzZSUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3NzU5MDEzODF8MA&ixlib=rb-4.1.0&q=85',
      title: 'Students Learning',
      category: 'Academic'
    },
    {
      url: 'https://images.unsplash.com/photo-1758270705087-76e81a5117bd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHw0fHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZGl2ZXJzZSUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3NzU5MDEzODF8MA&ixlib=rb-4.1.0&q=85',
      title: 'Classroom Sessions',
      category: 'Academic'
    },
    {
      url: 'https://images.unsplash.com/photo-1773489753005-dba9bf8d72bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwyfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMHN0dWRlbnRzJTIwaGlnaCUyMHNjaG9vbHxlbnwwfHx8fDE3NzU5MDEzOTJ8MA&ixlib=rb-4.1.0&q=85',
      title: 'Science Lab',
      category: 'Facilities'
    },
    {
      url: 'https://images.unsplash.com/photo-1759763494425-58fc490742ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHBsYXlpbmclMjBzcG9ydHMlMjBzY2hvb2wlMjBmaWVsZHxlbnwwfHx8fDE3NzU5MDEzOTJ8MA&ixlib=rb-4.1.0&q=85',
      title: 'Sports Activities',
      category: 'Sports'
    },
    {
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
      title: 'Library',
      category: 'Facilities'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      title: 'Annual Day Celebration',
      category: 'Events'
    },
    {
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      title: 'Students in Campus',
      category: 'Campus Life'
    },
    {
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      title: 'Graduation Ceremony',
      category: 'Events'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-[#0A192F]">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white heading-font tracking-tight mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-200 body-font">Glimpses of Life at Brilliant Grammar</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] card-hover"
                data-testid={`gallery-image-${index}`}
              >
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white heading-font mb-1">
                      {image.title}
                    </h3>
                    <p className="text-[#D4AF37] text-sm body-font">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
