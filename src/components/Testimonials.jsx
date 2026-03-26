import React, { useEffect, useRef, useState } from 'react';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const testimonials = [
    {
      quote: "ListedPEI completely changed how my bakery shows up on Google. We had a 40% increase in calls within the first two weeks of updating our profile with the kit!",
      author: "Sarah MacDonald",
      business: "Island Crust Bakery",
    },
    {
      quote: "I never knew what to put on my Google Business page. The AI generated five perfect posts and gave me exact responses to use for my reviews. Incredible tool.",
      author: "David Gallant",
      business: "Gallant Auto Repair",
    },
    {
      quote: "The keywords suggestion alone was worth its weight in gold. I'm ranking higher for 'Montague Seafood' than ever before. Highly recommend!",
      author: "Marie Arsenault",
      business: "Tide & Time Seafood",
    }
  ];

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className={`py-24 px-6 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
            Social Proof
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Trusted by Island <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Businesses</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            See how ListedPEI is helping local shops and services dominate their Google search results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-primary-500/10 hover:border-primary-200 group relative overflow-hidden"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Background gradient flair */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-300/20 to-accent-300/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex gap-1 mb-6 text-accent-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8 relative z-10">
                "{t.quote}"
              </p>
              
              <div className="relative z-10">
                <p className="font-bold text-slate-900">{t.author}</p>
                <p className="text-sm text-primary-600 font-medium">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
