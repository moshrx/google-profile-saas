import { useEffect, useRef, useState } from 'react';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  const testimonials = [
    {
      quote: "ListedPEI gave us a polished Google presence we never had time to build ourselves. The SEO kit was plug-and-play — we just copied it straight in.",
      author: "Cricket PEI",
      business: "Cricket PEI — Charlottetown",
      initials: "CP",
    },
    {
      quote: "Our customers were constantly calling to ask about hours, bin prices, and our location. ListedPEI helped us write a profile that answers all that before they even pick up the phone.",
      author: "Lootbins PEI",
      business: "Lootbins PEI — Stratford",
      initials: "LB",
    },
    {
      quote: "I was skeptical an AI tool could nail the PEI local feel, but the descriptions and posts it generated sounded exactly like us. Ranking higher and getting more calls now.",
      author: "Island Business Owner",
      business: "Listed PEI Partner",
      initials: "PEI",
    }
  ];

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className={`py-16 sm:py-24 px-4 sm:px-6 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4 border border-primary-100">
            Social Proof
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">
            Trusted by Island <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Businesses</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto px-4">
            See how ListedPEI is helping local shops and services dominate their Google search results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-primary-500/10 hover:border-primary-200 group relative overflow-hidden"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-primary-300/20 to-accent-300/20 blur-[30px] sm:blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex gap-1 mb-4 sm:mb-6 text-accent-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-slate-700 text-sm sm:text-lg font-medium leading-relaxed mb-6 sm:mb-8 relative z-10">
                "{t.quote}"
              </p>
              
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xs font-black text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">{t.author}</p>
                  <p className="text-xs sm:text-sm text-primary-600 font-medium">{t.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
