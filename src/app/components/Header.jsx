"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const RIGHT_NAV = [
  { label: "About",      href: "/about" },
  { label: "FAQ",        href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header({ categories = [] }) {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [catOpen,       setCatOpen]       = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const { totalItems } = useCart();

  const closeMenu = () => setMenuOpen(false);

  // Cart icon component
  const CartIcon = ({ className = "" }) => (
    <Link href="/cart" className={`relative flex items-center justify-center ${className}`} aria-label="View cart">
      <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1a1a2e] text-white text-[9px] font-bold flex items-center justify-center leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

        {/* ── Desktop (lg+) ── */}
        <div className="hidden lg:flex items-center justify-between h-[80px] relative">

          {/* LEFT: Search + Nav */}
          <div className="flex items-center gap-5 xl:gap-7 w-[44%]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Products..."
                className="text-[13px] border border-gray-100 rounded-full py-2.5 pl-9 pr-4 w-[160px] xl:w-[190px] bg-gray-50 outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>

            <nav className="flex items-center gap-5 xl:gap-7">
              <Link href="/" className="text-[14px] font-bold text-[#1a1a2e] whitespace-nowrap">Home</Link>
              <Link href="/techniques" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">Techniques</Link>

              {/* Categories dropdown */}
              <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <button className="flex items-center gap-1 text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] transition-colors whitespace-nowrap">
                  Categories
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {catOpen && categories.length > 0 && (
                  <div className="absolute top-full -left-2 pt-2 z-50 min-w-[200px]">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden">
                      {categories.map((cat) => (
                        <Link
                          key={cat._id || cat.slug}
                          href={`/collections/${cat.slug}`}
                          className="block px-5 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-[#1a1a2e] transition-colors"
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/founders" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">Founder&apos;s</Link>
            </nav>
          </div>

          {/* CENTER: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link href="/" className="block w-[72px] h-[72px] rounded-full bg-[#1a1a2e] p-[3px] shadow-lg ring-4 ring-white">
              <img src="/image/logo.png" alt="Bhayeli" className="w-full h-full object-cover rounded-full" />
            </Link>
          </div>

          {/* RIGHT: Links + CTA */}
          <div className="flex items-center justify-end gap-5 xl:gap-7 w-[44%]">
            <nav className="flex items-center gap-5 xl:gap-7">
              {RIGHT_NAV.map(n => (
                <Link key={n.href} href={n.href} className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">
                  {n.label}
                </Link>
              ))}
            </nav>
            <CartIcon className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors" />
            <Link href="/custom" className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-black transition-all whitespace-nowrap">
              Custom Request →
            </Link>
          </div>
        </div>

        {/* ── Mobile (below lg) ── */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <Link href="/" className="block w-11 h-11 rounded-full bg-[#1a1a2e] p-[3px] shadow-md ring-2 ring-white">
            <img src="/image/logo.png" alt="Bhayeli" className="w-full h-full object-cover rounded-full" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Cart icon — mobile */}
            <CartIcon className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors" />

            <Link href="/custom" className="hidden sm:inline-block text-[11px] font-semibold bg-[#1a1a2e] text-white px-4 py-2 rounded-full hover:bg-black transition-colors whitespace-nowrap">
              Custom Request →
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3 border-t border-gray-100 bg-white">
          <div className="relative mt-3">
            <input
              type="text"
              placeholder="Search Products..."
              autoFocus
              className="w-full text-sm border border-gray-200 rounded-full py-2.5 pl-10 pr-4 bg-gray-50 outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10 placeholder:text-gray-400"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-5 py-1 flex flex-col">
          <Link href="/" onClick={closeMenu} className="text-[13.5px] font-bold text-[#1a1a2e] py-3 border-b border-gray-100">Home</Link>
          <Link href="/techniques" onClick={closeMenu} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">Techniques</Link>

          {/* Categories accordion */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="w-full flex items-center justify-between text-[13.5px] font-medium text-gray-600 py-3"
            >
              Categories
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileCatOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileCatOpen && categories.length > 0 && (
              <div className="mb-2 flex flex-col">
                {categories.map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    href={`/collections/${cat.slug}`}
                    onClick={closeMenu}
                    className="py-2.5 pl-4 text-[13px] text-gray-500 hover:text-[#1a1a2e] border-b border-gray-50 last:border-0 transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/founders" onClick={closeMenu} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">Founder&apos;s</Link>
          <Link href="/about"    onClick={closeMenu} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">About</Link>
          <Link href="/faq"      onClick={closeMenu} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">FAQ</Link>
          <Link href="/contact"  onClick={closeMenu} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">Contact Us</Link>

          <div className="py-4 sm:hidden">
            <Link href="/custom" onClick={closeMenu} className="inline-block text-[13px] font-semibold bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors">
              Custom Request →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
