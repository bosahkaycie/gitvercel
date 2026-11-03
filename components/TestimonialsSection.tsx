import React from 'react';
import { useTestimonials } from '../hooks/useSupabaseData';

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = "Client Endorsements & Industry Feedback",
  subtitle = "Reflecting our sustained commitment to precision, safety, and local engineering capacity building across Nigerian energy corridors.",
  className = ""
}) => {
  const { testimonials, loading } = useTestimonials();

  return (
    <section className={`py-20 md:py-32 bg-slate-50 border-t border-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
            Verified Stakeholder Feedback
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 text-base md:text-lg mt-3 font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center py-12 text-slate-500 font-mono text-sm">
            Loading testimonials...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-8 sm:p-10 md:p-12 border border-slate-200 shadow-sm relative flex flex-col justify-between hover:border-emerald-600/60 transition-all duration-300"
            >
              <div className="text-5xl text-emerald-700 opacity-20 font-serif absolute top-6 left-6 select-none pointer-events-none">
                “
              </div>

              <div className="relative z-10 pt-4 mb-8">
                {t.is_placeholder && (
                  <span className="inline-block mb-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    Sample / Placeholder Record
                  </span>
                )}
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-light">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {t.author_initials || t.author_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">{t.author_name}</p>
                  <p className="text-xs text-slate-600 font-medium">{t.author_title}</p>
                  {t.author_company && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.author_company}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
