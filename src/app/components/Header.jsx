// "use client";

// import Link from "next/link";
// import { useState } from "react";

// const categories = [
//   { label: "Hand Embroidered Jacket", href: "/hand-embroidered-jacket" },
//   { label: "Women's Nightwear", href: "/womens-nightwear" },
//   { label: "Jacket", href: "/jacket" },
//   { label: "Makeup Bags", href: "/makeup-bags" },
//   { label: "Kimono Robe", href: "/kimono-robe" },
//   { label: "Tote Bags", href: "/tote-bags" },
//   { label: "Custom Request", href: "/customReq" },
// ];

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [catOpen, setCatOpen] = useState(false);
//   const [mobileCatOpen, setMobileCatOpen] = useState(false);

//   return (
//     <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">

//       {/* ── Desktop (lg+) ── */}
//       <div className="hidden lg:grid items-center h-[72px] px-6 xl:px-10" style={{ gridTemplateColumns: "1fr auto 1fr" }}>

//         {/* LEFT NAV */}
//         <nav className="flex items-center gap-5 xl:gap-7">
//            {/* Search */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search Products..."
//               className="text-[12px] xl:text-[13px] border border-gray-200 rounded-full py-[7px] pl-8 pr-3 w-[140px] xl:w-[170px] bg-gray-50 outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all placeholder:text-gray-400"
//             />
//             <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//             </svg>
//           </div>
//           <Link href="/" className="text-[13px] xl:text-[14px] font-bold text-[#1a1a2e] whitespace-nowrap">
//             Home
//           </Link>
//           <Link href="/techniques" className="text-[13px] xl:text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">
//             Techniques
//           </Link>

//           {/* Categories Dropdown */}
//           <div
//             className="relative"
//             onMouseEnter={() => setCatOpen(true)}
//             onMouseLeave={() => setCatOpen(false)}
//           >
//             <button className="flex items-center gap-1 text-[13px] xl:text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] transition-colors whitespace-nowrap">
//               Categories
//               <svg className={`w-3.5 h-3.5 mt-px transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             <div className={`absolute top-full left-0 pt-2 z-50 transition-all duration-150 ${catOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
//               <div className="w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
//                 {categories.map((cat) => (
//                   <Link
//                     key={cat.href}
//                     href={cat.href}
//                     className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-[#1a1a2e] font-medium transition-colors border-b border-gray-100 last:border-0"
//                   >
//                     {cat.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <Link href="/founders" className="text-[13px] xl:text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">
//             Founder's
//           </Link>
//         </nav>

//         {/* CENTER LOGO — auto width, truly centered */}
//         <div className="flex items-center justify-center px-6">
//           <Link
//             href="/"
//             className="w-[62px] h-[62px] xl:w-[68px] xl:h-[68px] rounded-full bg-[#1a1a2e] flex items-center justify-center shadow-lg ring-4 ring-white"
//           >
//             <img src="/image/logo.png" alt="bhayeli" className="w-full h-full object-cover rounded-full" />
//           </Link>
//         </div>

//         {/* RIGHT NAV + ACTIONS */}
//         <div className="flex items-center gap-4 xl:gap-5 justify-end">
//           <Link href="/about" className="text-[13px] xl:text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">
//             About
//           </Link>
//           <Link href="/faq" className="text-[13px] xl:text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">
//             FAQ
//           </Link>
//           <Link href="/contact" className="text-[13px] xl:text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap transition-colors">
//             Contact Us
//           </Link>

         

//           <Link
//             href="/customReq"
//             className="text-[12px] xl:text-[13px] font-semibold bg-[#1a1a2e] text-white px-4 xl:px-5 py-2 rounded-full hover:bg-black transition-colors whitespace-nowrap"
//           >
//             Custom Request →
//           </Link>
//         </div>
//       </div>

//       {/* ── Mobile / Tablet (below lg) ── */}
//       <div className="flex lg:hidden items-center justify-between px-4 h-14">

//         {/* Logo */}
//         <Link href="/" className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0 shadow-md ring-2 ring-white overflow-hidden">
//           <img src="/image/logo.png" alt="bhayeli" className="w-full h-full object-cover" />
//         </Link>

//         {/* Site name — tablet only */}
//         {/* <span className="hidden sm:block text-[15px] font-bold text-[#1a1a2e] tracking-wide" style={{ fontFamily: "var(--font-philosopher)" }}>
//           Bhayeli
//         </span> */}

//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setSearchOpen(!searchOpen)}
//             className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
//             aria-label="Search"
//           >
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//             </svg>
//           </button>

//           <Link
//             href="/customReq"
//             className="hidden sm:inline-block text-[11px] font-semibold bg-[#1a1a2e] text-white px-3.5 py-1.5 rounded-full hover:bg-black transition-colors whitespace-nowrap"
//           >
//             Custom Request →
//           </Link>

//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] ml-1"
//             aria-label="Toggle menu"
//           >
//             <span className={`block w-[18px] h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
//             <span className={`block w-[18px] h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
//             <span className={`block w-[18px] h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Search Bar */}
//       {searchOpen && (
//         <div className="lg:hidden px-4 pb-3 border-t border-gray-100">
//           <div className="relative mt-3">
//             <input
//               type="text"
//               placeholder="Search Products..."
//               autoFocus
//               className="w-full text-sm border border-gray-200 rounded-full py-2.5 pl-10 pr-4 bg-gray-50 outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 placeholder:text-gray-400"
//             />
//             <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//             </svg>
//           </div>
//         </div>
//       )}

//       {/* Mobile Menu Drawer */}
//       {menuOpen && (
//         <nav className="lg:hidden border-t border-gray-100 bg-white px-5 py-1 flex flex-col">
//           <Link href="/" onClick={() => setMenuOpen(false)} className="text-[13.5px] font-bold text-[#1a1a2e] py-3 border-b border-gray-100">
//             Home
//           </Link>
//           <Link href="/techniques" onClick={() => setMenuOpen(false)} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">
//             Techniques
//           </Link>

//           {/* Categories accordion */}
//           <div className="border-b border-gray-100">
//             <button
//               onClick={() => setMobileCatOpen(!mobileCatOpen)}
//               className="w-full flex items-center justify-between text-[13.5px] font-medium text-gray-600 py-3"
//             >
//               Categories
//               <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileCatOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {mobileCatOpen && (
//               <div className="mb-2 flex flex-col">
//                 {categories.map((cat) => (
//                   <Link
//                     key={cat.href}
//                     href={cat.href}
//                     onClick={() => setMenuOpen(false)}
//                     className="py-2.5 pl-3 text-[13px] text-gray-500 hover:text-[#1a1a2e] border-b border-gray-50 last:border-0 transition-colors"
//                   >
//                     {cat.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           <Link href="/founders" onClick={() => setMenuOpen(false)} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">
//             Founder's
//           </Link>
//           <Link href="/about" onClick={() => setMenuOpen(false)} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">
//             About
//           </Link>
//           <Link href="/faq" onClick={() => setMenuOpen(false)} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">
//             FAQ
//           </Link>
//           <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-[13.5px] font-medium text-gray-600 hover:text-[#1a1a2e] py-3 border-b border-gray-100 transition-colors">
//             Contact Us
//           </Link>

//           {/* Custom Request in mobile menu */}
//           <div className="py-4 sm:hidden">
//             <Link
//               href="/customReq"
//               onClick={() => setMenuOpen(false)}
//               className="inline-block text-[13px] font-semibold bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors"
//             >
//               Custom Request →
//             </Link>
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { label: "Hand Embroidered Jacket", href: "/collections/hand-embroidered-jacket" },
  { label: "Women's Nightwear", href: "/collections/womens-nightwear" },
  { label: "Jacket", href: "/collections/jacket" },
  { label: "Makeup Bags", href: "/collections/makeup-bags" },
  { label: "Kimono Robe", href: "/collections/kimono-robe" },
  { label: "Tote Bags", href: "/collections/tote-bags" },
  { label: "Custom Request", href: "/customReq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Max-width container for corner spacing */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* --- Desktop Layout (lg+) --- */}
        <div className="hidden lg:flex items-center justify-between h-[80px] relative">
          
          {/* LEFT SIDE: Search + Main Links */}
          <div className="flex items-center gap-5 xl:gap-7 w-[42%]">
            {/* Search Bar */}
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

            {/* Main Nav */}
            <nav className="flex items-center gap-5 xl:gap-7">
              <Link href="/" className="text-[14px] font-bold text-[#1a1a2e] whitespace-nowrap">Home</Link>
              <Link href="/techniques" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap">Techniques</Link>
              
              {/* Categories Dropdown */}
              <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <button className="flex items-center gap-1 text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] transition-colors">
                  Categories
                  <svg className={`w-3.5 h-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {catOpen && (
                  <div className="absolute top-full -left-2 pt-2 w-52 z-50">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden">
                      {categories.map((cat) => (
                        <Link key={cat.href} href={cat.href} className="block px-5 py-2 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-[#1a1a2e]">
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/founders" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap">Founder's</Link>
            </nav>
          </div>

          {/* CENTER: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link href="/" className="block w-[72px] h-[72px] rounded-full bg-[#1a1a2e] p-[3px] shadow-lg ring-4 ring-white">
              <img src="/image/logo.png" alt="logo" className="w-full h-full object-cover rounded-full" />
            </Link>
          </div>

          {/* RIGHT SIDE: Utility Links + Button */}
          <div className="flex items-center justify-start gap-5 xl:gap-9 w-[42%]">
            <nav className="flex items-center gap-5 xl:gap-7">
              <Link href="/about" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap">About</Link>
              <Link href="/faq" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap">FAQ</Link>
              <Link href="/contact" className="text-[14px] font-medium text-gray-500 hover:text-[#1a1a2e] whitespace-nowrap">Contact Us</Link>
            </nav>
            <Link href="/custom" className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-black transition-all flex items-center gap-2 whitespace-nowrap">
              Custom Request →
            </Link>
          </div>
        </div>

        {/* --- Mobile Layout (lg se niche) --- */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <Link href="/" className="w-11 h-11 rounded-full bg-[#1a1a2e] p-1 shadow-md">
             <img src="/image/logo.png" alt="logo" className="w-full h-full object-cover rounded-full" />
          </Link>

          <div className="flex items-center gap-3">
             <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
             </button>
             <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-[#1a1a2e]">
                <div className="space-y-1.5 w-6">
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Search/Menu logic remains same as before... */}
    </header>
  );
}