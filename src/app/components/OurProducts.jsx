import ProductCard from "./ProductCard";
import { fetchCatalog } from "@/lib/api";

export default async function OurProducts() {
  const { products } = await fetchCatalog();
  const display = products.slice(0, 8);

  if (display.length === 0) return null;

  return (
    <section className="w-full py-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        <h2
          className="text-center text-[#1a1a2e] text-2xl md:text-5xl font-bold mb-12"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Our Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {display.map((product) => (
            <ProductCard
              key={product._id}
              _id={String(product._id)}
              title={product.title}
              image={product.image}
              href={product.slug ? `/products/${product.slug}` : `/products/${product._id}`}
              moq={product.moq}
            />
          ))}
        </div>

      </div>

      <div className="flex items-center mt-12 justify-center gap-3 text-[#c4a882]">
        <img src="/image/design/design1.png" className="w-1/3" alt="" />
      </div>
    </section>
  );
}
