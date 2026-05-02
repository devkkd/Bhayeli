const steps = [
  {
    num: "01.",
    title: "Consultation",
    desc: "Discuss your requirements, design vision, and specifications",
    icon: "/image/process/Group 96.png",
  },
  {
    num: "02.",
    title: "Design",
    desc: "Our artisans create samples based on your brief",
    icon: "/image/process/Vector.png",
  },
  {
    num: "03.",
    title: "Sample",
    desc: "Review and refine until perfection",
    icon: "/image/process/Group 98.png",
  },
  {
    num: "04.",
    title: "Production",
    desc: "Skilled craftspeople bring your order to life",
    icon: "/image/process/Group 99.png",
  },
  {
    num: "05.",
    title: "Quality Check",
    desc: "Multi-point inspection ensures excellence",
    icon: "/image/process/Group 100.png",
  },
  {
    num: "06.",
    title: "Delivery",
    desc: "Reliable shipping to your location worldwide",
    icon: "/image/process/Group 101.png",
  },
];

export default function OurProcess() {
  return (
    <section className="w-full  py-14 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
         <h2
          className="text-center text-[#1a1a2e] text-2xl md:text-3xl font-bold lg:text-[2.8rem] mb-12"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Our Process - From Concept to Creation
        </h2>

        {/* Steps grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-300">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-3 px-5 py-2 first:pl-0 last:pr-0 ">
              {/* Icon */}
              <img src={step.icon} alt={step.title} className="w-18 h-18 object-contain" />

              {/* Number */}
              <span className="text-[24px] text-[#0E0E0E] font-bold">{step.num}</span>

              {/* Title */}
             <h3
                className="text-[#1a1a2e] text-[28px] md:text-[24px] font-bold leading-snug whitespace-pre-line"
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {step.title}
              </h3>

              {/* Desc */}
              <p className="text-[14px] text-[#0E0E0E] leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }} >{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Decorative divider */}
       <div className="flex items-center justify-center gap-3 text-[#c4a882] mt-20">
           <img src="/image/design/design-1.png" className="w-2/5"/>
        </div>

      </div>
    </section>
  );
}
