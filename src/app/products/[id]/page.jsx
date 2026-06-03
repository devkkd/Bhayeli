"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProduct(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-[#FCF9F4] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
    </main>
  );

  if (!product) return (
    <main className="min-h-screen bg-[#FCF9F4] flex items-center justify-center">
      <p className="text-gray-400 text-[16px]">Product not found.</p>
    </main>
  );

  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);

  // Split attributes into two columns for the table
  const leftAttrs  = product.attributes?.filter((_, i) => i % 2 === 0) || [];
  const rightAttrs = product.attributes?.filter((_, i) => i % 2 !== 0) || [];

  const whatsappUrl = `https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.title)}`;

  return (
    <main className="w-full bg-[#FCF9F4] min-h-screen pb-20" style={{ fontFamily: "var(--font-philosopher)" }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-6">
        <nav className="flex items-center gap-2 text-[13px] text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-[#1a1a2e] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#1a1a2e] transition-colors">Collections</Link>
          {product.collectionSlug && (
            <>
              <span>/</span>
              <Link href={`/collections/${product.collectionSlug}`} className="hover:text-[#1a1a2e] transition-colors capitalize">
                {product.collectionSlug.replace(/-/g, ' ')}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#1a1a2e] font-medium line-clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* ── Main Product Section ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* ── Left: Gallery ── */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 lg:w-[52%]">

            {/* Thumbnail strip */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pr-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? "border-[#1a1a2e]" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image with prev/next */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-gray-100 min-h-[320px] sm:min-h-[480px]">
              <img
                src={allImages[activeImg]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Technique tag */}
            {product.technique && (
              <p className="text-[16px] font-semibold text-[#1a1a2e]">{product.technique}</p>
            )}

            {/* Title */}
            <h1 className="text-[22px] md:text-[28px] font-bold text-[#1a1a2e] leading-snug">
              {product.title}
            </h1>

            {/* MOQ */}
            {product.moq && (
              <div className="inline-flex items-center gap-2 bg-[#1a1a2e]/5 rounded-full px-4 py-2 w-fit">
                <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-[13px] font-semibold text-[#1a1a2e]">{product.moq}</span>
              </div>
            )}

            {/* Product Description */}
            {(product.description || product.size || product.oemService) && (
              <div className="border-t border-gray-200 pt-5">
                <p className="text-[14px] font-bold text-[#1a1a2e] mb-3">Product Description</p>
                <div className="text-[14px] text-gray-700 space-y-1.5 leading-relaxed">
                  {product.description && <p>{product.description}</p>}
                  {product.size        && <p><span className="font-bold">Size</span> : {product.size}</p>}
                  {product.oemService  && <p><span className="font-bold">OEM Service</span> – {product.oemService}</p>}
                  {product.customization && (
                    <p><span className="font-bold">Customization</span> – {product.customization}</p>
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

            {/* Spotlight */}
            {product.spotlight && (
              <div className="border-t border-gray-200 pt-5">
                <p className="text-[14px] font-bold text-[#1a1a2e] mb-2">Product spotlights</p>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{product.spotlight}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Link
                href="/customReq"
                className="bg-[#1a1a2e] text-white text-[14px] font-semibold px-7 py-3 rounded-full hover:bg-black transition-colors whitespace-nowrap"
              >
                Enquire Now →
              </Link>
              <button className="border border-gray-300 text-[#1a1a2e] text-[14px] font-semibold px-7 py-3 rounded-full hover:border-[#1a1a2e] hover:bg-gray-50 transition-colors whitespace-nowrap">
                + Add to Cart
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#1ebe5d] transition-colors shrink-0"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Attributes Table ── */}
      {(() => {
        // Merge named fields + extra attributes[] into one flat list
        const namedFields = [
          { label: 'Material',          value: product.material },
          { label: 'Weaving Method',    value: product.weavingMethod },
          { label: 'Feature',           value: product.feature },
          { label: 'Style',             value: product.style },
          { label: 'Item Type',         value: product.itemType },
          { label: 'Sleeve Style',      value: product.sleeveStyle },
          { label: 'Pattern Type',      value: product.patternType },
          { label: 'Season',            value: product.season },
          { label: 'Thickness',         value: product.thickness },
          { label: 'Lining Material',   value: product.liningMaterial },
          { label: 'Shell Material',    value: product.shellMaterial },
          { label: 'Filling Material',  value: product.fillingMaterial },
          { label: 'Fabric Type',       value: product.fabricType },
          { label: 'Customization',     value: product.customizationAttr },
          { label: 'Technics',          value: product.technics },
          { label: 'Supply Type',       value: product.supplyType },
          { label: 'Support',           value: product.support },
          { label: 'Seamless Fusing',   value: product.seamlessFusing },
          { label: 'Model Number',      value: product.modelNumber },
          { label: 'Processing Type',   value: product.processingType },
          { label: 'Place of Origin',   value: product.placeOfOrigin },
          { label: 'Brand Name',        value: product.brandName },
          { label: 'Clothing Length',   value: product.clothingLength },
          { label: 'OEM/ODM',           value: product.oemOdm },
          { label: 'Material',          value: product.materialRight },
          { label: 'Delivery Time',     value: product.deliveryTime },
          { label: 'Quality',           value: product.quality },
          // Extra custom attributes
          ...(product.attributes || []),
        ].filter((a) => a.value && a.value.trim() !== '');

        if (namedFields.length === 0) return null;

        return (
          <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-14">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#1a1a2e] mb-6">Key attributes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 rounded-xl overflow-hidden">
              {namedFields.map((attr, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 px-5 py-3 border-b border-gray-100 last:border-0 ${
                    i % 2 === 0 ? 'md:border-r md:border-r-gray-200' : ''
                  }`}
                >
                  <span className="text-[13px] text-gray-500 w-36 shrink-0 leading-relaxed">{attr.label}</span>
                  <span className="text-[13px] font-bold text-[#1a1a2e] leading-relaxed">{attr.value}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })()}
    </main>
  );
}
