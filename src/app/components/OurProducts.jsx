import Link from "next/link";
import ProductCard from "./ProductCard";

const products = [
  { title: "Hand Embroidered Jacket", image: "/image/category/Mask group (10).png", href: "/collections/hand-embroidered-jacket", moq: "MOQ: 50 pcs" },
  { title: "Women's Nightwear", image: "/image/category/Mask group (11).png", href: "/collections/womens-nightwear", moq: "MOQ: 100 pcs" },
  { title: "Quilted Jacket", image: "/image/category/Mask group (13).png", href: "/collections/jacket", moq: "MOQ: 50 pcs" },
  { title: "Hand Embroidered Jacket", image: "/image/category/Mask group (5).png", href: "/collections/hand-embroidered-jacket", moq: "MOQ: 50 pcs" },
  { title: "Women's Nightwear", image: "/image/category/Mask group (4).png", href: "/collections/womens-nightwear", moq: "MOQ: 100 pcs" },
  { title: "Quilted Jacket", image: "/image/category/Mask group (12).png", href: "/collections/jacket", moq: "MOQ: 50 pcs" },
  { title: "Hand Embroidered Jacket", image: "/image/category/Mask group (10).png", href: "/collections/hand-embroidered-jacket", moq: "MOQ: 50 pcs" },
  { title: "Women's Nightwear", image: "/image/category/Mask group (11).png", href: "/collections/womens-nightwear", moq: "MOQ: 100 pcs" },
];

export default function OurProducts() {
  return (
    <section className="w-full py-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h2
          className="text-center text-[#1a1a2e] text-2xl md:text-5xl font-bold mb-12"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Our Products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>

       

      </div>
       {/* Decorative divider */}
         <div className="flex items-center mt-12 justify-center gap-3 text-[#c4a882]">
          <img src="/image/design/design1.png" className="w-1/3"/>
        </div>
    </section>
  );
}
