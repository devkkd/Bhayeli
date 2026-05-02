const posts = [
  { image: "/image/insta/image 18.png", views: 240 },
  { image: "/image/insta/image 19.png", views: 428 },
  { image: "/image/insta/image 20 (1).png", views: 439 },
  { image: "/image/insta/image 21.png", views: 278 },
];

export default function InstagramFeed() {
  return (
    <section className="w-full bg-[#f5f0e8] py-14 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
       <h2
          className="text-center text-[#1a1a2e] text-2xl md:text-3xl font-bold lg:text-[2.8rem] mb-12"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Follow us and Stay updated New Collection
        </h2>

        {/* Instagram handle */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {/* Instagram gradient icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <defs>
              <radialGradient id="ig" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#fdf497"/>
                <stop offset="5%" stopColor="#fdf497"/>
                <stop offset="45%" stopColor="#fd5949"/>
                <stop offset="60%" stopColor="#d6249f"/>
                <stop offset="90%" stopColor="#285AEB"/>
              </radialGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)"/>
            <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1" fill="white"/>
          </svg>
          <a
            href="https://instagram.com/bhayeli.jaipur"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#1a1a2e] font-medium hover:underline"
          >
            @bhayeli.jaipur
          </a>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {posts.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com/bhayeli.jaipur"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-2xl group block"
            >
              <img
                src={post.image}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />

              {/* View count — bottom left */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[12px] font-medium px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {post.views}
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
