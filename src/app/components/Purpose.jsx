import Link from "next/link";

export default function Purpose() {
  return (
    <section className="w-full py-14 md:py-20 px-6 md:px-12 lg:px-20"  style={{ fontFamily: "var(--font-philosopher)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start">
          <p className="text-[24px] font-semibold text-[#1a1a2e] mb-3 tracking-wide">
            Our Purpose
          </p>

          <h2
            className="text-[#1a1a2e] text-2xl md:text-3xl lg:text-[2.7rem] font-bold leading-snug mb-5"
           
          >
            Craftsmanship with Impact
          </h2>

          <p className="text-[13.5px] md:text-[18px] font-medium text-[#0E0E0E] leading-relaxed mb-8">
            Born from the realities of rural Rajasthan, where skilled women often lack
            access to dignified work opportunities, Bhayeli was founded to create change.
            We bring meaningful employment to women particularly single mothers
            enabling them to earn sustainably while remaining close to their families and
            culture. True luxury is not defined by excess, but by intention, integrity, and
            human value.
          </p>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white text-[16px] font-light px-6 py-3 rounded-full hover:bg-black transition-colors"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
         >
            Read Our Complete Story →
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full">
          <img
            src="/image/design/block.png"
            alt="Craftsmanship with Impact"
            className="w-full h-[280px] md:h-[340px] lg:h-[380px] object-cover rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
