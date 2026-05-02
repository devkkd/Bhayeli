import Image from "next/image";
import React from "react";

export default function FoundersPage() {
  return (
    <main className="w-full bg-[#FCF9F4]  py-8 md:py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16" style={{ fontFamily: "var(--font-philosopher)" }}>
          <span className="text-[#1a1a2e] text-lg md:text-xl font-bold block mb-4">
            Founder's Message
          </span>
          <h1 className="text-[#1a1a2e] text-3xl md:text-5xl lg:text-[3rem] font-bold leading-tight">
            Message from Our Founder
          </h1>
        </div>

        {/* --- Content Layout --- */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          
          {/* Left Side: Image */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
              <Image
                src="/image/founder.jpg" // Replace with your actual image path
                alt="Founder of Bhayeli"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full md:w-7/12 flex flex-col space-y-6 pt-2">
            <p className="text-[14.5px] md:text-[17px] text-[#0E0E0E] leading-relaxed">
              I was born and raised in a rural village of Rajasthan, where resilience is a way of life and opportunity is
              often limited. Growing up, I witnessed families separated by the search for work, and women especially
              single mothers carrying responsibilities far greater than the support available to them.
            </p>

            <p className="text-[14.5px] md:text-[17px] text-[#0E0E0E] leading-relaxed">
              These women were skilled, capable, and determined, yet access to dignified work remained out of reach.
              My journey led me to study Textile and Fashion Design and to work within the textile industry in a
              metropolitan city. There, I gained technical knowledge and industry insight.
            </p>

            <p className="text-[14.5px] md:text-[17px] text-[#0E0E0E] leading-relaxed pb-4">
              But when I looked back at my roots, I realized that despite time and progress, little had changed for the
              women I had grown up alongside.
            </p>

            <h2 
              className="text-[#1a1a2e] text-2xl md:text-[2rem] font-bold pb-2"
              style={{ fontFamily: "var(--font-philosopher)" }}
            >
              This Brand Was Born From That Realization
            </h2>

            <div className="space-y-4">
              <p className="text-[14.5px] md:text-[17px] text-[#0E0E0E] leading-relaxed">
                It is founded on the belief that meaningful work should not require leaving one's family, culture, or dignity
                behind. By creating opportunities within local communities, we aim to enable women particularly single
                mothers—to earn sustainably, with respect and independence.
              </p>
              
              <p className="text-[14.5px] md:text-[17px] text-[#0E0E0E] leading-relaxed">
                To me, true luxury is not defined by excess, but by intention, integrity, and impact.<br/>
                Every piece we create represents more than craftsmanship it represents strength, choice, and the
                possibility of a better future.
              </p>

              <p className="text-[14.5px] md:text-[17px] text-[#0E0E0E] leading-relaxed">
                When you support our brand, you're not just buying a product.<br/>
                You're supporting a woman's strength, a child's education, and a family's future.<br/>
                This is our beginning And together, this is how we create change.
              </p>
            </div>

            <p className="text-[15px] md:text-[18px] text-[#1a1a2e] font-bold pt-4">
              Thank you for being part of this journey.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}