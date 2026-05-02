export default function TurningPoint() {
  return (
    <section className="w-full py-14 md:py-20 px-6 md:px-12 lg:px-20" style={{ fontFamily: "var(--font-philosopher)" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10 md:gap-16">

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start gap-5">

          <p className="text-[16px] font-semibold text-[#1a1a2e] tracking-wide">
            Our Purpose
          </p>

          <h2 className="font-philosopher text-[#1a1a2e] text-2xl md:text-3xl lg:text-[2rem] leading-snug">
            The Turning Point
          </h2>

          <p className="text-[13.5px] md:text-[14px] text-gray-600 leading-relaxed">
            Growing up, we witnessed women with immense potential held back by
            circumstance alone. Years later, after completing a degree in Textile & Fashion
            Design and working within the textile industry in a metropolitan city, we
            gained insight into design, production, and global markets.
          </p>

          {/* Arrow list */}
          <ul className="flex flex-col gap-2">
            {[
              "But when we looked back home, little had changed.",
              "Skill still lacked access.",
              "Strength still lacked opportunity.",
              "That realization became our turning point.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] md:text-[14px] text-gray-600">
                <span className="mt-0.5 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-[13.5px] md:text-[14px] text-[#1a1a2e] font-bold leading-relaxed">
            This brand was founded with a clear intention: to create meaningful,
            dignified work for women especially single mothers within their own
            communities.
          </p>

          <p className="text-[13.5px] md:text-[14px] text-gray-600 leading-relaxed">
            By bringing craftsmanship, contemporary design, and ethical production
            together, we enable women to earn sustainably while remaining rooted in their
            families and culture. Here, work does not demand separation. Progress does
            not require displacement.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full">
          <img
            src="/image/about/image 100.png"
            alt="The Turning Point"
            className="w-full h-[320px] md:h-[420px] lg:h-[480px] object-cover rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
