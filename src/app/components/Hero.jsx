"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    tag: "BEAUTIFUL LOUNGEWEAR",
    title: "KIMONOS FOR EVERYONE",
    cta: "See All Collection →",
    ctaHref: "/categories",
    image: "/image/banner/banner.png",          // desktop image
    mobileImage: "/image/banner/banner.png",    // replace with mobile-specific image when ready
    bg: "#f0ebe3",
  },
  {
    id: 2,
    tag: "HAND EMBROIDERED",
    title: "CRAFTED WITH LOVE",
    cta: "See All Collection →",
    ctaHref: "/categories",
    image: "/image/banner/banner.png",
    mobileImage: "/image/banner/banner.png",
    bg: "#e8e0d5",
  },
  {
    id: 3,
    tag: "WOMEN'S NIGHTWEAR",
    title: "COMFORT MEETS ELEGANCE",
    cta: "See All Collection →",
    ctaHref: "/categories",
    image: "/image/banner/banner.png",
    mobileImage: "/image/banner/banner.png",
    bg: "#ede6dc",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(null); // null = not yet measured

  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];
  const activeImage = isMobile ? slide.mobileImage : slide.image;
  // null = not yet hydrated → use desktop as default, then switch after mount
  const paddingBottom = isMobile === true ? "120%" : "42%";

  return (
    <section className="relative w-full" style={{ backgroundColor: slide.bg }}>
      {/* Slide wrapper */}
      <div className="relative w-full transition-all duration-300" style={{ paddingBottom }}>

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${activeImage})` }}
        />

        {/* Top-left tag */}
        {/* <div className="absolute top-[10%] left-[5%] z-10">
          <p className="text-[11px] md:text-[13px] font-semibold tracking-[0.2em] text-[#1a1a2e] uppercase">
            {slide.tag}
          </p>
        </div>

        <div className="absolute top-[18%] left-0 right-0 z-10 px-[5%]">
          <h1
            className="font-black text-[#1a1a2e] leading-none tracking-tight text-center"
            style={{ fontSize: "clamp(1.8rem, 6.5vw, 5.5rem)" }}
          >
            {slide.title}
          </h1>
        </div> */}

        {/* CTA button — bottom center */}
        <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 z-10">
          <Link
            href={slide.ctaHref}
            className="group inline-flex items-center gap-2 bg-white text-[#1a1a2e] font-semibold rounded-full shadow-md hover:shadow-xl hover:bg-[#1a1a2e] hover:text-white transition-all duration-300 whitespace-nowrap relative overflow-hidden"
            style={{ fontSize: "clamp(11px, 1.2vw, 14px)", padding: "clamp(8px,1vw,12px) clamp(18px,2.5vw,32px)" }}
          >
            {/* shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative">{slide.cta}</span>
            {/* arrow bounces right on hover */}
            {/* <svg
              className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg> */}
          </Link>
        </div>

        {/* Dots — pill container with frosted bg */}
        <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-[#1a1a2e] scale-110"
                    : "bg-[#1a1a2e]/40 hover:bg-[#1a1a2e]/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/85 hover:bg-white shadow-md flex items-center justify-center transition-all"
        >
          <svg className="w-3.5 h-3.5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/85 hover:bg-white shadow-md flex items-center justify-center transition-all"
        >
          <svg className="w-3.5 h-3.5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
