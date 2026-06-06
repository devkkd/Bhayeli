"use client";
import React, { useState, useEffect } from 'react';

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null); // Selected video for modal popup
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/instagram-feed');
        const data = await res.json();
        if (data.success) {
          setPosts(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load Instagram video feed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400 font-sans text-sm">
          Loading Feed...
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't render empty sections
  }

  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-20 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <h2
          className="text-center text-[#1a1a2e] text-2xl md:text-3xl font-bold lg:text-[2.8rem] mb-6"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Follow us and Stay updated New Collection
        </h2>

        {/* Instagram handle */}
        <div className="flex items-center justify-center gap-2 mb-12">
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
            className="text-[14px] text-[#1a1a2e] font-semibold hover:underline font-sans"
          >
            @bhayeli.jaipur
          </a>
        </div>

        {/* Video Reel Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {posts.map((post, i) => (
            <div
              key={post._id || i}
              onClick={() => setActiveVideo(post)}
              className="relative overflow-hidden rounded-2xl group block cursor-pointer bg-black aspect-[9/16] shadow-sm hover:shadow-md"
            >
              <video
                src={post.videoUrl}
                poster={post.thumbnailUrl || undefined}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                {/* Play Icon */}
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                  <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* View count — bottom left */}
              {post.views > 0 && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full font-sans">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {post.views}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* ══ VIDEO LIGHTBOX OVERLAY MODAL ══ */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          {/* Main Modal Frame */}
          <div
            className="relative bg-[#FFF8EE] w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl flex flex-col aspect-[9/16]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar (Top Overlay) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              {/* Audio Control */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                {isMuted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video element */}
            <div className="flex-1 bg-black relative">
              <video
                src={activeVideo.videoUrl}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Info Bar */}
            <div className="p-4 border-t border-[#e5dfd5] bg-white flex flex-col gap-3 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500 font-sans flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {activeVideo.views} views
                </span>
                <span className="text-[10px] text-[#bfa15f] font-bold uppercase tracking-wider font-sans">Instagram Reel</span>
              </div>
              <a
                href={activeVideo.instagramUrl || "https://instagram.com/bhayeli.jaipur"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1a1a2e] text-white hover:bg-[#bfa15f] font-sans font-bold tracking-wider py-3 rounded-2xl text-[12px] text-center transition-colors uppercase"
              >
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
