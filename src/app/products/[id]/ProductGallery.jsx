"use client";
import { useState } from "react";

/**
 * ProductGallery — unified component
 * Desktop: thumbnails (left col) + main image (center col) side by side
 * Mobile: combined stacked layout
 */
export default function ProductGallery({ image, gallery = [] }) {
  const allImages = [image, ...gallery].filter(Boolean);
  const [active, setActive] = useState(0);

  const prev = () => setActive((p) => (p - 1 + allImages.length) % allImages.length);
  const next = () => setActive((p) => (p + 1) % allImages.length);

  return (
    <>
      {/* ── Mobile: stacked (thumbnails below main image) ── */}
      <div className="lg:hidden flex flex-col gap-3 col-span-1">
        {/* Main image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-3/4 min-h-[320px]">
          <img
            src={allImages[active]}
            alt="product"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {allImages.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors">
                <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors">
                <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`shrink-0 w-[58px] h-[68px] rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-[#1a1a2e]" : "border-transparent hover:border-gray-300"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop: thumbnails left col + main image center col ── */}

      {/* Left: thumbnail column */}
      <div className="hidden lg:flex lg:col-span-1 flex-col gap-2 overflow-y-auto max-h-[560px] pr-1">
        {allImages.map((img, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`shrink-0 w-full h-[76px] rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-[#1a1a2e]" : "border-transparent hover:border-gray-300"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Center: main image */}
      <div className="hidden lg:block lg:col-span-5">
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-3/4 min-h-[420px]">
          <img
            src={allImages[active]}
            alt="product"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {allImages.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors">
                <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors">
                <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          {/* Dot indicators */}
          {/* {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "bg-[#1a1a2e] w-4" : "bg-white/70 w-1.5"}`}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
