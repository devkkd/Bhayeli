export default function   OurPhilosophy() {
  return (
    <>
    <section className="w-full py-14 md:py-20 px-6 md:px-12 lg:px-20"  style={{ fontFamily: "var(--font-philosopher)" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Left Image */}
        <div className="flex-1 w-full">
          <img
            src="/image/about/image 101.png"
            alt="Our Philosophy"
            className="w-full h-[320px] md:h-[420px] lg:h-[460px] object-cover rounded-2xl"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col items-start gap-4">

          <p className="text-[18px] font-semibold text-[#1a1a2e] tracking-wide">
            Our Philosophy
          </p>

          <h2 className="text-[#1a1a2e] text-2xl md:text-3xl lg:text-[2rem] font-bold">
            Luxury Is Not Excess It Is Purpose,<br />
            Integrity, And Human Value
          </h2>

          {/* Arrow list */}
          <ul className="flex flex-col gap-1">
            {[
              "Every piece we create carries more than design.",
              "It carries independence.",
              "It carries respect.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] md:text-[16px] text-gray-800">
                <span className="mt-0.5 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-[13.5px] md:text-[16px] text-gray-800 ">
            It carries the promise of a future shaped by choice, not limitation.
          </p>

          <p className="text-[13.5px] md:text-[16px] text-gray-800 ">
            When you choose our brand, you are not only choosing refined design you are
            participating in a quieter, deeper form of change.
          </p>

          <p className="text-[13.5px] md:text-[16px] text-gray-800">
            This is where tradition meets intention.
          </p>

          <p className="text-[13.5px] md:text-[16px] text-gray-800">
            This is luxury with meaning.
          </p>

        </div>
      </div>
    </section>

    {/* ── What We Do ── */}
    <section className="w-full  px-6">
      <div className="max-w-5xl mx-auto text-center flex flex-col gap-6">

        {/* Decorative divider top */}
         <div className="flex items-center justify-center gap-3 text-[#c4a882]">
          <img src="/image/design/design1.png" className="w-1/3"/>
        </div>

        <h2 className=" text-[#1a1a2e] mt-4 text-2xl md:text-3xl lg:text-4xl font-bold">
          What We Do
        </h2>
<div className=" flex flex-col gap-2">
        <p className="text-[13.5px] md:text-[16px] text-gray-800 font-semibold">
          Bhayeli is a Jaipur-based textile manufacturer specializing in traditional Indian printing and
          embroidery techniques.
        </p>
        <p className="text-[13.5px] md:text-[16px] text-gray-800 font-bold">
          <span className="font-extrabold  text-[#1a1a2e]">With over 20 years of experience,</span> we serve B2B clients worldwide, providing handcrafted fabrics
          for fashion, home textiles, and furnishing applications.
        </p>

        <p className="text-[18px] font-semibold text-[#1a1a2e]">Our Core Techniques:</p>
</div>
        {/* Techniques row */}
        <div className="flex flex-wrap items-center justify-center divide-x divide-gray-300 mt-2">
          {["Block Print", "Hand Printing", "Embroidery", "Digital Print"].map((t, i) => (
            <span
              key={i}
              className="font-philosopher text-[#1a1a2e] text-[15px] md:text-[17px] font-bold px-4 md:px-6 py-2"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-[13.5px] md:text-[16px] text-gray-800 font-semibold mt-2">
          We work with skilled artisans who have inherited their craft through generations, ensuring that
          every piece we create carries the soul of authentic Indian craftsmanship.
        </p>

        {/* Decorative divider bottom */}
         <div className="flex items-center justify-center gap-3 text-[#c4a882]">
          <img src="/image/design/design1.png" className="w-1/3"/>
        </div>
      </div>
    </section>

    {/* ── Our Mission ── */}
    <section className="w-full  py-10 px-6">
      <div className="max-w-5xl mx-auto text-center flex flex-col gap-6">

        <h2 className="font-philosopher text-[#1a1a2e] text-2xl md:text-3xl lg:text-4xl font-bold">
          Our Mission
        </h2>

        <p className="text-[13.5px] md:text-[16px] text-gray-800 font-bold leading-relaxed">
          To be the global bridge between traditional Indian textile artistry and contemporary design needs, delivering
          exceptional handcrafted fabrics while supporting artisan communities and sustainable practices.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 text-[#c4a882]">
          <img src="/image/design/design1.png" className="w-1/3"/>
        </div>
      </div>
    </section>

    {/* ── Our Values ── */}
    <section className="w-full px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        <h2 className="font-philosopher text-[#1a1a2e] text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12">
          Our Values
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-200">
          {[
            {
              title: "Authenticity",
              desc: "We never compromise on traditional techniques. Every block is hand-carved, every print is hand-applied, every stitch is made with care.",
            },
            {
              title: "Artisan Empowerment",
              desc: "Our artisans are partners, not just workers. We provide fair wages, safe working conditions, and opportunities for skill development.",
            },
            {
              title: "Quality Excellence",
              desc: "From raw materials to finished products, we maintain rigorous standards that meet international expectations.",
            },
            {
              title: "Sustainable Creation",
              desc: "We use natural dyes, minimize waste, recycle water, and choose eco-friendly materials wherever possible.",
            },
            {
              title: "Collaborative Partnership",
              desc: "Your success is our success. We work closely with clients to understand their needs and exceed expectations.",
            },
            {
              title: "Cultural Preservation",
              desc: "By keeping traditional techniques alive and relevant, we ensure these crafts survive for future generations.",
            },
          ].map((val, i) => (
            <div key={i} className="flex flex-col gap-3 px-5 py-2 first:pl-0 last:pr-0">
              <h3 className="text-[#1a1a2e] text-[16px] md:text-[18px] font-bold leading-snug">
                {val.title}
              </h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  </>
  );
}
