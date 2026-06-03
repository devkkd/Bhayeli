import Link from "next/link";
import LookingForward from "../components/LookingForward";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "All Collections | Bhayeli",
};

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

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <main className="w-full bg-[#FCF9F4] min-h-screen" style={{ fontFamily: "var(--font-philosopher)" }}>

      {/* ── Header ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-14 text-center">
        <span className="text-[16px] font-semibold text-[#1a1a2e] block mb-3">
          Our Collections
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight mb-6">
          Handcrafted with Heritage
        </h1>
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed max-w-2xl mx-auto">
          Explore our full range of handcrafted textile products — each made by skilled artisans in rural Rajasthan using
          traditional techniques passed down through generations.
        </p>
      </section>

      {/* ── Collections Grid ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-20">
        {categories.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[16px] text-gray-400">No collections available yet.</p>
            <p className="text-[14px] text-gray-400 mt-2">Add categories from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {categories.map((cat) => (
              <div key={cat._id} className="flex flex-col gap-3">

                {/* Image */}
                <Link href={`/collections/${cat.slug}`} className="w-full overflow-hidden rounded-2xl block">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-[280px] sm:h-[320px] md:h-[520px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Info */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#1a1a2e] text-[14px] md:text-[18px] font-medium leading-snug">
                    {cat.title}
                  </h3>
                  {cat.description && (
                    <p className="text-[12px] text-gray-400 leading-snug line-clamp-2">{cat.description}</p>
                  )}
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
        )}
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center justify-center pb-10 px-6">
        <img src="/image/design/design1.png" className="w-2/5 md:w-1/4" alt="divider" />
      </div>

      <LookingForward />
    </main>
  );
}
