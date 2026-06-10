"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "../context/CartContext";

const RIGHT_NAV = [
  { label: "About",      href: "/about" },
  { label: "FAQ",        href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

/* ── Search Bar Component ─────────────────────────────────────────── */
function SearchBar({ mobile = false, onClose }) {
  const [query, setQuery]           = useState("");
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState(false);
  const inputRef                    = useRef(null);
  const dropdownRef                 = useRef(null);
  const debounceRef                 = useRef(null);

  // Debounced parallel search — products + categories
  const doSearch = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setProducts([]); setCategories([]); setLoading(false); return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?search=${encodeURIComponent(q.trim())}`),
          fetch(`/api/categories`),
        ]);
        const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);

        setProducts(prodData.success ? (prodData.data || []) : []);

        // Filter categories whose title matches the query
        const allCats = catData.success ? (catData.data || []) : [];
        setCategories(
          allCats.filter((c) =>
            c.title.toLowerCase().includes(q.trim().toLowerCase())
          )
        );
      } catch {
        setProducts([]); setCategories([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => { doSearch(query); }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current   && !inputRef.current.contains(e.target)
      ) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Group products by categorySlug
  const grouped = products.reduce((acc, product) => {
    const cat = product.categorySlug || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const hasResults   = products.length > 0 || categories.length > 0;
  const showDropdown = focused && query.trim().length > 0;

  const handleResultClick = () => {
    setQuery(""); setProducts([]); setCategories([]);
    setFocused(false);
    if (onClose) onClose();
  };

  return (
    <div className={`relative ${mobile ? "w-full" : ""}`}>
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search products & categories..."
          autoFocus={mobile}
          className={`text-[13px] border border-gray-100 rounded-full py-2.5 pl-9 pr-8 bg-gray-50 outline-none focus:ring-1 focus:ring-[#1a1a2e]/20 focus:border-gray-300 transition-all placeholder:text-gray-400 text-[#1a1a2e] ${
            mobile ? "w-full" : "w-[170px] xl:w-[210px]"
          }`}
        />
        {/* Search / spinner icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <svg className="animate-spin w-4 h-4 text-[#bfa15f]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          )}
        </span>
        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(""); setProducts([]); setCategories([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[999] ${
            mobile ? "w-full left-0" : "w-[360px] left-0"
          }`}
          style={{ maxHeight: "460px", overflowY: "auto" }}
        >
          {/* Loading state */}
          {loading && !hasResults ? (
            <div className="flex items-center justify-center py-8 gap-2 text-gray-400 text-[13px]">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Searching...
            </div>
          ) : !hasResults ? (
            /* Empty state */
            <div className="py-10 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-[13px] text-gray-500 font-medium">No results found</p>
              <p className="text-[12px] text-gray-400 mt-1">Try a different keyword</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Summary */}
              <div className="px-4 py-2 border-b border-gray-50">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {categories.length + products.length} result{categories.length + products.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                </span>
              </div>

              {/* ── CATEGORIES SECTION ── */}
              {categories.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1.5">
                    <span className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-widest">
                      Collections
                    </span>
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id || cat.slug}
                      href={`/collections/${cat.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf8f5] transition-colors group"
                    >
                      {/* Category thumbnail */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#1a1a2e]/5 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#bfa15f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1a1a2e] group-hover:text-black truncate leading-tight">
                          {cat.title}
                        </p>
                        <p className="text-[11px] text-[#bfa15f] mt-0.5">View collection →</p>
                      </div>
                      {/* Tag */}
                      <span className="text-[9px] font-bold bg-[#1a1a2e]/5 text-[#1a1a2e] px-2 py-1 rounded-full uppercase tracking-wide shrink-0">
                        Collection
                      </span>
                    </Link>
                  ))}

                  {/* Divider before products */}
                  {products.length > 0 && (
                    <div className="mx-4 my-1 border-t border-gray-50" />
                  )}
                </div>
              )}

              {/* ── PRODUCTS SECTION — grouped by category ── */}
              {Object.entries(grouped).map(([catSlug, prods]) => (
                <div key={catSlug}>
                  {/* Category group header */}
                  <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-widest">
                      {catSlug.replace(/-/g, " ")}
                    </span>
                    <Link
                      href={`/collections/${catSlug}`}
                      onClick={handleResultClick}
                      className="text-[10px] text-gray-400 hover:text-[#1a1a2e] transition-colors"
                    >
                      View all →
                    </Link>
                  </div>

                  {/* Product rows */}
                  {prods.slice(0, 4).map((product) => {
                    const href = product.slug
                      ? `/products/${product.slug}`
                      : `/products/${product._id}`;
                    return (
                      <Link
                        key={product._id}
                        href={href}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf8f5] transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1a1a2e] group-hover:text-black truncate leading-tight">
                            {product.title}
                          </p>
                          {product.moq && (
                            <p className="text-[11px] text-gray-400 mt-0.5">{product.moq}</p>
                          )}
                        </div>
                        {/* Arrow */}
                        <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#bfa15f] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    );
                  })}

                  {prods.length > 4 && (
                    <Link
                      href={`/collections/${catSlug}`}
                      onClick={handleResultClick}
                      className="block mx-4 mb-1 text-center text-[11px] text-[#bfa15f] hover:text-[#1a1a2e] font-semibold py-1.5 rounded-lg hover:bg-[#faf8f5] transition-colors"
                    >
                      +{prods.length - 4} more in {catSlug.replace(/-/g, " ")}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Header ──────────────────────────────────────────────────── */
export default function Header({ categories = [] }) {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [catOpen,       setCatOpen]       = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const { totalItems } = useCart();

  const closeMenu = () => setMenuOpen(false);

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

        {/* ── Desktop ── */}
        <div className="hidden lg:flex items-center justify-between h-[80px] relative">

          {/* LEFT: Search + Nav */}
          <div className="flex items-center gap-5 xl:gap-7 w-[44%]">
            <SearchBar />

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

        {/* ── Mobile ── */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <Link href="/" className="block w-11 h-11 rounded-full bg-[#1a1a2e] p-[3px] shadow-md ring-2 ring-white">
            <img src="/image/logo.png" alt="Bhayeli" className="w-full h-full object-cover rounded-full" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              {searchOpen ? (
                <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
              )}
            </button>

            <CartIcon className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors" />

            <Link href="/custom" className="hidden sm:inline-block text-[11px] font-semibold bg-[#1a1a2e] text-white px-4 py-2 rounded-full hover:bg-black transition-colors whitespace-nowrap">
              Custom Request →
            </Link>

            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
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

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-4 pt-3 border-t border-gray-100 bg-white">
          <SearchBar mobile onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-5 py-1 flex flex-col">
          <Link href="/"          onClick={closeMenu} className="text-[13.5px] font-bold text-[#1a1a2e] py-3 border-b border-gray-100">Home</Link>
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
