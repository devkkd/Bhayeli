import Link from "next/link";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function Categories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {categories.map((cat) => (
            <div key={cat._id} className="flex flex-col gap-3">

              {/* Image */}
              <div className="w-full overflow-hidden rounded-2xl">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-[280px] sm:h-[300px] md:h-[520px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  {cat.description && (
                    <span className="text-[11px] text-gray-400 font-medium leading-tight line-clamp-1">
                      {cat.description}
                    </span>
                  )}
                  <h3
                    className="text-[#1a1a2e] text-[14px] md:text-[18px] font-medium leading-snug"
                    style={{ fontFamily: "var(--font-philosopher)" }}
                  >
                    {cat.title}
                  </h3>
                </div>

                <Link
                  href={`/collections/${cat.slug}`}
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
       <div className="flex items-center justify-center mt-12 gap-3 text-[#c4a882]">
          <img src="/image/design/design1.png" className="w-1/3"/>
        </div>
      </div>
    </section>
  );
}
