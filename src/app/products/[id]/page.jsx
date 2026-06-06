import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProductById, fetchProducts, buildAttributeList } from "@/lib/api";
import ProductGallery from "./ProductGallery";
import ProductCard from "@/app/components/ProductCard";
import AddToCartButton from "@/app/components/AddToCartButton";
import LookingForward from "@/app/components/LookingForward";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);
  return {
    title: product ? `${product.title} | Bhayeli` : "Product | Bhayeli",
    description: product?.description || "Handcrafted textiles from rural Rajasthan.",
  };
}

function productHref(p) {
  return p.slug ? `/products/${p.slug}` : `/products/${p._id}`;
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = await fetchProductById(id);
  if (!product) notFound();

  const attrList = buildAttributeList(product);

  // Related products — same category, exclude current
  const related = await fetchProducts({ categorySlug: product.categorySlug });
  const relatedFiltered = related
    .filter((p) => String(p._id) !== String(product._id))
    .slice(0, 3);

  // Split attributes into two halves for two-column table
  const half = Math.ceil(attrList.length / 2);
  const leftAttrs = attrList.slice(0, half);
  const rightAttrs = attrList.slice(half);

  return (
    <main className="bg-[#faf8f5] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-6 flex-wrap font-medium uppercase tracking-wider">
          <Link href="/" className="hover:text-[#1a1a2e] transition-colors">Home</Link>
          <span>/</span>
          {product.categorySlug && (
            <>
              <Link href={`/collections/${product.categorySlug}`} className="hover:text-[#1a1a2e] transition-colors capitalize">
                {product.categorySlug.replace(/-/g, " ")}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#1a1a2e] normal-case">{product.title}</span>
        </nav>

        {/* ── Main Product Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Mobile: ProductGallery handles its own layout */}
          {/* Desktop: col-1 thumbnails + col-5 main image rendered inside ProductGallery */}
          <ProductGallery image={product.image} gallery={product.gallery || []} />

          {/* Product info — right */}
          <div className="lg:col-span-6 space-y-5">

            {/* Title */}
            <h1
              className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-[#1a1a2e] leading-snug"
              style={{ fontFamily: "var(--font-philosopher)" }}
            >
              {product.title}
            </h1>

            {/* MOQ pricing tiers — figma style */}
            {product.moq && (
              <div className="flex flex-wrap items-center gap-4 border-t border-b border-gray-200 py-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] text-gray-400 mr-1">{product.moq}</span>
                </div>
                {product.technique && (
                  <span className="text-[11px] text-gray-400 border-l border-gray-200 pl-4">
                    {product.technique}
                  </span>
                )}
              </div>
            )}

            {/* Product Description */}
            {(product.description || product.size || product.oemService || product.customization || product.customizedLogo || product.customizedPackaging) && (
              <div className="space-y-1.5">
                <h3 className="text-[13px] font-bold text-[#1a1a2e]">Product Description</h3>
                <div className="text-[13px] text-gray-600 space-y-1 leading-relaxed">
                  {product.description && <p>{product.description}</p>}
                  {product.size && (
                    <p><span className="font-semibold text-[#1a1a2e]">Size</span> : {product.size}</p>
                  )}
                  {product.oemService && (
                    <p><span className="font-semibold text-[#1a1a2e]">OEM Service</span> : {product.oemService}</p>
                  )}
                  {product.customization && (
                    <p><span className="font-semibold text-[#1a1a2e]">Customization</span> : {product.customization}</p>
                  )}
                  {product.customizedLogo && (
                    <p>Customized logo (Min. order: {product.customizedLogo})</p>
                  )}
                  {product.customizedPackaging && (
                    <p>Customized packaging (Min. order: {product.customizedPackaging})</p>
                  )}
                </div>
              </div>
            )}

            {/* Product Spotlights */}
            {product.spotlight && (
              <div className="space-y-1.5">
                <h3 className="text-[13px] font-bold text-[#1a1a2e]">Product spotlights</h3>
                <p className="text-[12.5px] text-gray-500 leading-relaxed">{product.spotlight}</p>
              </div>
            )}

            {/* CTA Buttons — Add to Cart + WhatsApp (client, reads cart state) */}
            <AddToCartButton
              productId={String(product._id)}
              title={product.title}
              image={product.image}
              moq={product.moq}
              size="lg"
            />

          </div>
        </div>

        {/* ── Key Attributes — two column table like figma ── */}
        {attrList.length > 0 && (
          <div className="mt-14">
            <h2
              className="text-[18px] font-bold text-[#1a1a2e] mb-5"
              style={{ fontFamily: "var(--font-philosopher)" }}
            >
              Key attributes
            </h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-gray-200">
                {/* Left column */}
                <div className="divide-y divide-gray-100">
                  {leftAttrs.map((attr, i) => (
                    <div key={i} className="grid grid-cols-2 px-4 py-2.5 text-[12.5px] hover:bg-[#faf8f5] transition-colors">
                      <span className="text-gray-400 font-medium pr-2">{attr.label}</span>
                      <span className="text-[#1a1a2e] font-semibold">{attr.value}</span>
                    </div>
                  ))}
                </div>
                {/* Right column */}
                <div className="divide-y divide-gray-100">
                  {rightAttrs.map((attr, i) => (
                    <div key={i} className="grid grid-cols-2 px-4 py-2.5 text-[12.5px] hover:bg-[#faf8f5] transition-colors">
                      <span className="text-gray-400 font-medium pr-2">{attr.label}</span>
                      <span className="text-[#1a1a2e] font-semibold">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Decorative divider ── */}
        <div className="flex items-center justify-center my-14">
          <img src="/image/design/design1.png" className="w-1/3" alt="" />
        </div>

        {/* ── Products Also Like You ── */}
        {relatedFiltered.length > 0 && (
          <div>
            <h2
              className="text-[22px] md:text-[28px] font-bold text-[#1a1a2e] mb-8 text-center"
              style={{ fontFamily: "var(--font-philosopher)" }}
            >
              Products Also Like You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {relatedFiltered.map((p) => (
                <ProductCard
                  key={p._id}
                  _id={String(p._id)}
                  title={p.title}
                  image={p.image}
                  href={productHref(p)}
                  moq={p.moq}
                />
              ))}
            </div>
          </div>
        )}

        
      </div>
       <LookingForward />
    </main>
  );
}
