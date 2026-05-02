export default function OurCraftspeople() {
  return (
    <section className="w-full py-14 md:py-20 px-6 md:px-12 lg:px-20" style={{ fontFamily: "var(--font-philosopher)" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10 md:gap-16">

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start gap-5">

          <p className="text-[16px] font-semibold text-[#1a1a2e] tracking-wide">
            Our Craftspeople
          </p>

          <h2 className="font-philosopher text-[#1a1a2e] text-[28px] md:text-[36px] font-bold leading-snug">
            The Heart of Bhayeli
          </h2>

          <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed">
            Behind every piece we create are skilled artisans who have dedicated their lives to
            mastering their craft. Our block carvers create intricate designs with precision and
            patience.
          </p>

          <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed">
            Our printers apply each color with practiced hands that understand the exact
            pressure and rhythm needed. Our embroiderers transform plain fabric into elaborate
            artwork, stitch by careful stitch.
          </p>

          <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed">
            We invest in our artisan community through fair compensation, continuous training,
            and a work environment that respects their expertise and dignity.
          </p>

        </div>

        {/* Right Image */}
        <div className="flex-1 w-full">
          <img
            src="/image/about/Mask group (15).png"
            alt="The Heart of Bhayeli"
            className="w-full h-[320px] md:h-[380px] object-cover rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
