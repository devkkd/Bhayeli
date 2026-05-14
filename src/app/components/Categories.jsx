import Link from "next/link";

const categories = [
  {
    tag: "Indian Floral",
    title: "Susani Hand Embroidery Jackets",
    image: "/image/category/Mask group (4).png",
    href: "/collections/hand-embroidered-jacket",
  },
  {
    tag: "Long Sleeves",
    title: "Womens Nightware",
    image: "/image/category/Mask group (5).png",
    href: "/collections/womens-nightwear",
  },
  {
    tag: "Hand Block Printed Floral Woven",
    title: "Quilted Jacket",
    image: "/image/category/Mask group (10).png",
    href: "/collections/jacket",
  },
  {
    tag: "Eco-Friendly Sustainable Cotton Block Print",
    title: "Makeup Bags",
    image: "/image/category/Mask group (11).png",
    href: "/collections/makeup-bags",
  },
  {
    tag: "Lightweight 100% Cotton",
    title: "Kimono Robe",
    image: "/image/category/Mask group (12).png",
    href: "/collections/kimono-robe",
  },
  {
    tag: "Eco-Friendly Quilted Cotton Sustainable",
    title: "Women's Tote Bags",
    image: "/image/category/Mask group (13).png",
    href: "/collections/tote-bags",
  },
];

export default function Categories() {
  return (
    <section className="w-full py-14 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col gap-3">

              {/* Image */}
              <div className="w-full overflow-hidden rounded-2xl">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-[280px] sm:h-[300px] md:h-[520px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info row — stacked on mobile, side by side on md+ */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-gray-400 font-medium leading-tight">
                    {cat.tag}
                  </span>
                  <h3
                    className="text-[#1a1a2e] text-[14px] md:text-[18px] font-medium leading-snug"
                    style={{ fontFamily: "var(--font-philosopher)" }}
                  >
                    {cat.title}
                  </h3>
                </div>

                <Link
                  href={cat.href}
                  className="self-start bg-[#1a1a2e] text-white text-[11px] font-semibold px-4 py-2 rounded-full hover:bg-black transition-colors whitespace-nowrap"
                >
                  See All →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white text-[13px] font-semibold px-8 py-3 rounded-full hover:bg-black transition-colors"
          >
            See All Our Collections →
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 text-[#c4a882] mt-12">
           <img src="/image/design/design1.png" className="w-2/5"/>
        </div>

      </div>
    </section>
  );
}
