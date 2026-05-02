import Link from "next/link";

export default function LookingForward() {
  return (
    <section className="w-full bg-[#0d1b2a] py-16 md:py-12 px-6">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">

        <h2
          className="text-white text-3xl md:text-4xl lg:text-[2.5rem] leading-tight"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Looking Forward
        </h2>

        <p className="text-[14px] md:text-[15px] text-white/70 leading-relaxed max-w-2xl">
          As we continue to grow, our commitment remains unchanged: to create textiles of exceptional quality that honor
          tradition while meeting the evolving needs of global partners. We're excited about the future and the opportunity to
          collaborate with brands and designers who share our values.
        </p>

        <Link
          href="/contact"
          className="mt-2 inline-flex items-center gap-2 bg-white text-[#0d1b2a] text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          Become a Partner →
        </Link>

      </div>
    </section>
  );
}
