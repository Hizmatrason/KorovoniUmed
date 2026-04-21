"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

const slides = [
  { src: "/images/hero-4.jpg", alt: "Community support" },
  { src: "/images/hero-3.jpg", alt: "Community support" },
  { src: "/images/hero-2.jpg", alt: "Training program" },
  { src: "/images/hero-5.jpg", alt: "Community support" },
  { src: "/images/hero-1.jpg", alt: "Korvoni Umed" },
  { src: "/images/hero-6.jpg", alt: "Community support" },
];

export default function HeroCarousel() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "540px" }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Text overlay */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow">
            {t("subtitle")}
          </p>
          <a href="#request-form" className="btn-cta inline-block text-lg">
            {t("ctaButton")}
          </a>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
