const topFeatures = [
  {
    icon: "/image/whychoice/6.png",
    label: "Authentically\nDesigned in Jaipur",
  },
  {
    icon: "/image/whychoice/5.png",
    label: "Artisan-Made Using\nTraditional Block Printing",
  },
  {
    icon: "/image/whychoice/4.png",
    label: "Naturally\nSkin-Friendly Fabrics",
  },
  {
    icon: "/image/whychoice/1.png",
    label: "Lightweight Textiles\nwith Superior Comfort",
  },
  {
    icon: "/image/whychoice/3.png",
    label: "Premium Craftsmanship\nBuilt to Last",
  },
  {
    icon: "/image/whychoice/2.png",
    label: "Flexible Customization\nfor Wholesale Buyers",
  },
];

const bottomFeatures = [
  {
    num: "01.",
    title: "Authentic\nCraftsmanship",
    desc: "Every piece is created using time-honored techniques by skilled artisans trained in traditional methods.",
  },
  {
    num: "02.",
    title: "Scalable\nProduction",
    desc: "From sample orders to large-scale production runs, we maintain quality across all order sizes.",
  },
  {
    num: "03.",
    title: "Customization\nExpertise",
    desc: "Work directly with our design team to create patterns, colors, and designs unique to your brand.",
  },
  {
    num: "04.",
    title: "Sustainable\nPractices",
    desc: "Natural dyes, eco-friendly processes, and fair labor practices are core to our operations.",
  },
  {
    num: "05.",
    title: "Quality\nAssurance",
    desc: "Rigorous quality control at every stage ensures consistent, export-ready products.",
  },
  {
    num: "06.",
    title: "Global\nExperience",
    desc: "Proven track record serving international brands with reliable shipping and communication.",
  },
];

export default function WhyChoose() {
  return (
    <section className="w-full py-14 md:py-20">
      <div className="w-full">

        {/* Heading */}
        <h2
          className="text-center text-[#1a1a2e] text-2xl md:text-5xl font-bold  mb-12"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Why Choose Bhayeli
        </h2>

        {/* Top icon row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 px-8 divide-x divide-gray-300 border-b border-gray-300">
          {topFeatures.map((f, i) => (
            <div key={i} className="flex flex-col items-start gap-4 p-6">
              <img src={f.icon} alt={f.label} className="w-20 h-20 object-contain" />
              <p className="text-[14px] text-[#0E0E0E] font-medium leading-snug whitespace-pre-line" style={{ fontFamily: "var(--font-montserrat)" }}>
                {f.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom numbered row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 px-8 divide-x divide-gray-300"  style={{ fontFamily: "var(--font-philosopher)" }}>
          {bottomFeatures.map((f, i) => (
            <div key={i} className="flex flex-col gap-2 p-6">
              <span className="text-[24px] text-[#0E0E0E] font-bold">{f.num}</span>
              <h3
                className="text-[#1a1a2e] text-[28px] md:text-[24px] font-bold leading-snug whitespace-pre-line"
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {f.title}
              </h3>
              <p className="text-[12px] text-gray-600 font-medium leading-relaxed font-sans">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
