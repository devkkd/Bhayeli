export default function Heritage() {
  return (
    <section className="w-full py-16 md:py-20 px-6"  style={{ fontFamily: "var(--font-philosopher)" }}>
      <div className="max-w-6xl mx-auto text-center">

        {/* Main heading — Philosopher font */}
        <h2
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold leading-tight mb-8"
        >
          Heritage Meets Innovation, Purpose Meets Luxury
        </h2>

        {/* Body paragraphs */}
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed mb-4" >
          For over two decades, Bhayeli has been a trusted name in handcrafted textile manufacturing. Based in Jaipur, the
          cultural capital of Rajasthan, we specialize in authentic block printing, Dabu printing, Chikankari embroidery, digital
          printing, and appliqué work that transforms fabric into art.
        </p>
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed mb-12" >
          Our commitment to traditional techniques, combined with modern quality standards and scalable production
          capabilities, makes us the ideal partner for brands, retailers, and designers worldwide who value authenticity and
          craftsmanship.
        </p>

        {/* Sub heading */}
        <h3
          className="text-[#1a1a2e] text-xl md:text-2xl font-bold mb-5"
        >
          But our work goes deeper than textiles
        </h3>

        {/* Sub body */}
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed mb-14" >
          Every piece we create supports women artisans especially single mothers in rural Rajasthan, providing dignified work
          opportunities within their own communities. When you partner with Bhayeli, you're not just sourcing exceptional
          textiles; you're contributing to meaningful change.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 text-[#c4a882]">
          <img src="/image/design/design1.png" className="w-1/2"/>
        </div>

      </div>
    </section>
  );
}
