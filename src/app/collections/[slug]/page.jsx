import { fetchCatalog, fetchProducts } from "@/lib/api";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import LookingForward from "@/app/components/LookingForward";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { categories } = await fetchCatalog();
  const category = categories.find((c) => c.slug === slug);
  return {
    title: category ? `${category.title} — Bhayeli` : "Collection — Bhayeli",
    description: category?.description || "Handcrafted textiles from rural Rajasthan.",
  };
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  // Fetch categories + filtered products in parallel — two focused calls
  const [{ categories }, filtered] = await Promise.all([
    fetchCatalog(),
    fetchProducts({ categorySlug: slug }),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  return (
    <main className="min-h-screen ">

      {/* ── Breadcrumb + Title Banner ── */}
      <section className="w-full py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-4 font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-[#1a1a2e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#1a1a2e]">{currentCategory.title}</span>
          </nav>
          <h1
            className="text-2xl md:text-4xl font-bold text-[#1a1a2e] mb-2"
            style={{ fontFamily: "var(--font-philosopher)" }}
          >
            {currentCategory.title}
          </h1>
          {currentCategory.description && (
            <p className="text-sm text-gray-500 max-w-xl">{currentCategory.description}</p>
          )}
        </div>
      </section>

      {/* ── Sticky Category Filter Tabs ── */}
      <section className="w-full justify-center bg-[#fcfaf7] border-b border-gray-100 sticky top-[64px] lg:top-[80px] z-30">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 py-3 min-w-max justify-center">
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/collections/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                  cat.slug === slug
                    ? "bg-[#1a1a2e] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100"
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="w-full py-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">

          {filtered.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-[#1a1a2e] text-lg font-bold mb-2" style={{ fontFamily: "var(--font-philosopher)" }}>
                No Products Yet
              </h2>
              <p className="text-sm text-gray-400 mb-6 max-w-xs">
                We&apos;re adding products to this collection soon. Check back or explore other collections.
              </p>
              <Link href="/" className="bg-[#1a1a2e] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full hover:bg-black transition-colors">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-gray-400 font-medium mb-6 uppercase tracking-wider">
                {filtered.length} {filtered.length === 1 ? "Product" : "Products"}
              </p>

              {/* 3 col desktop, 2 col mobile — matches design */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    _id={product._id}
                    title={product.title}
                    image={product.image}
                    href={product.slug ? `/products/${product.slug}` : `/products/${product._id}`}
                    moq={product.moq}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="w-full py-12 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[#1a1a2e] font-bold text-lg" style={{ fontFamily: "var(--font-philosopher)" }}>
              Looking for something custom?
            </h3>
            <p className="text-sm text-gray-400 mt-1">We do bespoke orders for bulk B2B requirements.</p>
          </div>
          <Link
            href="/custom"
            className="bg-[#1a1a2e] text-white px-7 py-3 rounded-full text-[13px] font-bold hover:bg-black transition-all whitespace-nowrap"
          >
            Custom Request →
          </Link>
        </div>
      </section>

      <LookingForward />
    </main>
  );
}
