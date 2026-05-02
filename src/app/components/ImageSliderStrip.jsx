"use client";

const images = [
  { src: "/image/about/image 37.png", alt: "Block printing tools" },
  { src: "/image/about/image 38 (1).png", alt: "Hand block printing" },
  { src: "/image/about/image 40.png", alt: "Printed fabric products" },
  { src: "/image/about/image 37.png", alt: "Craftsmanship detail" },
  { src: "/image/about/image 38 (1).png", alt: "Artisan at work" },
  { src: "/image/about/image 40.png", alt: "Textile collection" },
];

// Duplicate for seamless infinite loop
const allImages = [...images, ...images];

export default function ImageSliderStrip() {
  return (
    <section className="w-full overflow-hidden py-10">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 25s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-track">
        {allImages.map((img, i) => (
          <div
            key={i}
            style={{
              width: "33.33vw",
              height: "26vw",
              minWidth: "260px",
              minHeight: "170px",
              flexShrink: 0,
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
