"use client";
import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NAV = [
  {
    id: "products",
    label: "Products",
    href: "/admin/dashboard?tab=products",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    id: "categories",
    label: "Categories",
    href: "/admin/dashboard?tab=categories",
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z",
  },
  {
    id: "inquiries",
    label: "Inquiry Cart",
    href: "/admin/inquiries",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    id: "contacts",
    label: "Customer Inquiry",
    href: "/admin/contacts",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    id: "custom",
    label: "Custom Inquiries",
    href: "/admin/custom-inquiries",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    id: "instagram-feed",
    label: "Instagram Feed",
    href: "/admin/instagram-feed",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
];

// Login page — no sidebar
const LOGIN_PATHS = ["/admin", "/admin/"];

function AdminLayoutContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "products";
  
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [newContactsCount, setNewContactsCount] = useState(0);
  const [newCustomCount, setNewCustomCount] = useState(0);

  useEffect(() => {
    const fetchNewCounts = async () => {
      try {
        const [inqRes, conRes, custRes] = await Promise.all([
          fetch("/api/inquiries?status=new"),
          fetch("/api/contacts?status=new"),
          fetch("/api/custom-inquiries?status=new")
        ]);
        const [inqData, conData, custData] = await Promise.all([
          inqRes.json(),
          conRes.json(),
          custRes.json()
        ]);
        if (inqData.success) {
          setNewInquiriesCount(inqData.data?.length || 0);
        }
        if (conData.success) {
          setNewContactsCount(conData.data?.length || 0);
        }
        if (custData.success) {
          setNewCustomCount(custData.data?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };
    fetchNewCounts();
    // Poll every 30 seconds for counts
    const interval = setInterval(fetchNewCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  let title = "Admin";
  let sub = "";

  if (pathname === "/admin/dashboard") {
    if (tab === "categories") {
      title = "Categories";
      sub = "Catalog category management";
    } else {
      title = "Products";
      sub = "Catalog product management";
    }
  } else if (pathname === "/admin/inquiries") {
    title = "Inquiry Cart";
    sub = "Customer cart pre-purchase inquiries";
  } else if (pathname === "/admin/contacts") {
    title = "Customer Inquiry";
    sub = "General contact form submissions";
  } else if (pathname === "/admin/custom-inquiries") {
    title = "Custom Inquiry";
    sub = "Artisan customization project requests";
  } else if (pathname === "/admin/instagram-feed") {
    title = "Instagram Feed";
    sub = "Manage video reels and image overlays";
  }

  const handleLogout = async () => {
    const res = await fetch("/api/admin/auth/logout", { method: "POST" });
    const data = await res.json();
    if (data.success) window.location.href = "/admin";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f0e8] font-sans text-gray-800">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══ SIDEBAR ══ */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-64 shrink-0 h-full bg-white border-r border-[#e5dfd5]
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Brand */}
        <div className="h-16 px-5 border-b border-[#e5dfd5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#bfa15f]/30 shrink-0">
              <img src="/image/logo.png" alt="Bhayeli" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[#1a1a2e] text-sm font-bold tracking-wider" style={{ fontFamily: "var(--font-philosopher)" }}>BHAYELI</p>
              <p className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV.map(item => {
            const active = item.id === "inquiries"
              ? pathname === "/admin/inquiries"
              : item.id === "contacts"
                ? pathname === "/admin/contacts"
                : item.id === "custom"
                  ? pathname === "/admin/custom-inquiries"
                  : item.id === "instagram-feed"
                    ? pathname === "/admin/instagram-feed"
                    : pathname === "/admin/dashboard" && tab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-200 ${
                  active
                    ? "bg-[#1a1a2e] text-white shadow-md border-l-4 border-[#bfa15f]"
                    : "text-gray-500 hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 shrink-0 ${active ? "text-[#bfa15f]" : "text-gray-400"}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </div>
                {item.id === "inquiries" && newInquiriesCount > 0 && (
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {newInquiriesCount}
                  </span>
                )}
                {item.id === "contacts" && newContactsCount > 0 && (
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {newContactsCount}
                  </span>
                )}
                {item.id === "custom" && newCustomCount > 0 && (
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {newCustomCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-[#e5dfd5] space-y-2 shrink-0">
          <a
            href="/" target="_blank" rel="noopener noreferrer"
            className="w-full bg-[#bfa15f]/10 border border-[#bfa15f]/20 text-[#bfa15f] hover:bg-[#bfa15f] hover:text-white transition-all font-bold py-2 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            Live Storefront
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={handleLogout}
            className="w-full bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 text-[#1a1a2e] font-bold py-2.5 rounded-xl text-xs hover:bg-[#1a1a2e] hover:text-white transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN AREA ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Sticky header */}
        <header className="h-16 shrink-0 bg-white border-b border-[#e5dfd5] px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 border border-[#e5dfd5] flex items-center justify-center shrink-0"
          >
            <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h1
              className="text-base sm:text-lg font-bold text-[#1a1a2e] uppercase tracking-wider truncate"
              style={{ fontFamily: "var(--font-philosopher)" }}
            >
              {title}
            </h1>
            {sub && (
              <p className="text-[9px] text-[#bfa15f] font-bold uppercase tracking-widest hidden sm:block">
                {sub}
              </p>
            )}
          </div>
        </header>

        {/* Page content — each page renders inside here */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Show plain layout for login page
  if (LOGIN_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#f5f0e8] text-gray-500">Loading Admin...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
