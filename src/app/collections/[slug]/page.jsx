import { notFound } from "next/navigation";
import Link from "next/link";
import { collections } from "../../data/collections";
import LookingForward from "../../components/LookingForward";

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const collection = collections.find((c) => c.slug === params.slug);
  if (!collection) return {};
  return { title: `${collection.title} | Bhayeli` };
}

export default function CollectionPage({ params }) {
  const collection = collections.find((c) => c.slug === params.slug);
  if (!collection) notFound();

  const whatsappBase = "https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20";

  return (
    <main className="w-full bg-[#FCF9F4] min-h-screen" style={{ fontFamily: "var(--font-philosopher)" }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8">
        <nav className="flex items-center gap-2 text-[13px] text-gray-400">
          <Link href="/" className="hover:text-[#1a1a2e] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#1a1a2e] transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-[#1a1a2e] font-medium">{collection.title}</span>
        </nav>
      </div>

      {/* ── Hero Header ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-10 pb-12 text-center">
        <span className="text-[16px] font-semibold text-[#1a1a2e] block mb-3">
          {collection.tag}
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight mb-6">
          {collection.title}
        </h1>
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed max-w-2xl mx-auto">
          {collection.description}
        </p>
      </section>

      {/* ── Category Filter Pills ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className={`text-[13px] font-medium px-5 py-2 rounded-full border transition-colors whitespace-nowrap ${
                c.slug === collection.slug
                  ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                  : "bg-white text-[#1a1a2e] border-gray-300 hover:border-[#1a1a2e]"
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {collection.products.map((product, i) => (
            <div key={i} className="flex flex-col gap-3">

              {/* Image */}
              <div className="w-full overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-[260px] sm:h-[320px] md:h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title + MOQ */}
              <div className="flex flex-col gap-0.5 px-1">
                <h3 className="text-[#1a1a2e] text-[14px] md:text-[16px] font-semibold leading-snug">
                  {product.title}
                </h3>
                <span className="text-[12px] text-gray-400 font-medium">{product.moq}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 px-1 flex-wrap">
                <Link
                  href={`/customReq`}
                  className="bg-[#1a1a2e] text-white text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-black transition-colors whitespace-nowrap"
                >
                  Enquire Now →
                </Link>

                <button className="border border-gray-300 text-[#1a1a2e] text-[12px] font-semibold px-4 py-2 rounded-full hover:border-[#1a1a2e] hover:bg-gray-50 transition-colors whitespace-nowrap">
                  + Add to Cart
                </button>

                <a
                  href={`${whatsappBase}${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#1ebe5d] transition-colors shrink-0"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center justify-center pb-10 px-6">
        <img src="/image/design/design1.png" className="w-2/5 md:w-1/4" alt="divider" />
      </div>

      <LookingForward />
    </main>
  );
}
