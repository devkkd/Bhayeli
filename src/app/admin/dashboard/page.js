"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const KEY_ATTRIBUTES = [
  { field: "material", label: "Material" },
  { field: "weavingMethod", label: "Weaving Method" },
  { field: "feature", label: "Feature" },
  { field: "style", label: "Style" },
  { field: "itemType", label: "Item Type" },
  { field: "sleeveStyle", label: "Sleeve Style" },
  { field: "patternType", label: "Pattern Type" },
  { field: "season", label: "Season" },
  { field: "thickness", label: "Thickness" },
  { field: "liningMaterial", label: "Lining Material" },
  { field: "shellMaterial", label: "Shell Material" },
  { field: "fillingMaterial", label: "Filling Material" },
  { field: "fabricType", label: "Fabric Type" },
  { field: "customizationAttr", label: "Customization" },
  { field: "technics", label: "Technics" },
  { field: "supplyType", label: "Supply Type" },
  { field: "support", label: "Support" },
  { field: "seamlessFusing", label: "Seamless Fusing" },
  { field: "modelNumber", label: "Model Number" },
  { field: "processingType", label: "Processing Type" },
  { field: "placeOfOrigin", label: "Place of Origin" },
  { field: "brandName", label: "Brand Name" },
  { field: "clothingLength", label: "Clothing Length" },
  { field: "oemOdm", label: "OEM/ODM" },
  { field: "materialRight", label: "Material (Alt)" },
  { field: "deliveryTime", label: "Delivery Time" },
  { field: "quality", label: "Quality" },
];

const EMPTY_PRODUCT = {
  title: "", categorySlug: "", technique: "", moq: "MOQ: 50 pcs",
  image: "", gallery: [],
  description: "", size: "", oemService: "", customization: "",
  customizedLogo: "", customizedPackaging: "", spotlight: "", brandName: "BHAYELI",
  material: "", weavingMethod: "", feature: "", style: "", itemType: "",
  sleeveStyle: "", patternType: "", season: "", thickness: "", liningMaterial: "",
  shellMaterial: "", fillingMaterial: "", fabricType: "", customizationAttr: "",
  technics: "", supplyType: "", support: "", seamlessFusing: "", modelNumber: "",
  processingType: "", placeOfOrigin: "", clothingLength: "", oemOdm: "",
  materialRight: "", deliveryTime: "", quality: "", attributes: [],
};

const EMPTY_CATEGORY = { title: "", slug: "", image: "", description: "" };

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "products";

  const setActiveTab = (tab) => {
    router.push(`/admin/dashboard?tab=${tab}`);
  };

  const [viewMode, setViewMode] = useState("table");
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbType, setDbType] = useState("MongoDB");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalType, setModalType] = useState("product");
  const [editId, setEditId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [catUploading, setCatUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, colRes, catRes, dbRes] = await Promise.all([
        fetch("/api/products"), fetch("/api/collections"),
        fetch("/api/categories"), fetch("/api/admin/setup"),
      ]);
      const [prod, col, cat, db] = await Promise.all([
        prodRes.json(), colRes.json(), catRes.json(), dbRes.json(),
      ]);
      if (prod.success) setProducts(prod.data || []);
      if (col.success) setCollections(col.data || []);
      if (cat.success) setCategories(cat.data || []);
      setDbType(db.database || "MongoDB Active");
    } catch { showFeedback("error", "Failed to load dashboard data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const uploadImage = async (file, isGallery = false) => {
    if (!file?.type.startsWith("image/")) { showFeedback("error", "Only image files allowed."); return null; }
    if (file.size > 5 * 1024 * 1024) { showFeedback("error", "Max file size is 5MB."); return null; }
    isGallery ? setUploadingGallery(true) : setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { showFeedback("success", `Uploaded via ${data.engine || "storage"}`); return data.url; }
      showFeedback("error", data.message || "Upload failed."); return null;
    } catch { showFeedback("error", "Upload error."); return null; }
    finally { isGallery ? setUploadingGallery(false) : setUploading(false); }
  };

  const handleMainImageUpload = async (file) => {
    const url = await uploadImage(file, false);
    if (url) setProductForm(f => ({ ...f, image: url }));
  };

  const handleGalleryUpload = async (files) => {
    const uploads = await Promise.all(Array.from(files).map(f => uploadImage(f, true)));
    const urls = uploads.filter(Boolean);
    if (urls.length) setProductForm(f => ({ ...f, gallery: [...f.gallery, ...urls] }));
  };

  const removeGalleryImage = (idx) =>
    setProductForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));

  const handleCatImageUpload = async (file) => {
    if (!file?.type.startsWith("image/")) { showFeedback("error", "Only image files allowed."); return; }
    setCatUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setCategoryForm(f => ({ ...f, image: data.url }));
      else showFeedback("error", "Upload failed.");
    } catch { showFeedback("error", "Upload error."); }
    finally { setCatUploading(false); }
  };

  const openCreate = (type) => {
    setModalType(type); setModalMode("create"); setEditId(null);
    if (type === "product") setProductForm({ ...EMPTY_PRODUCT, categorySlug: categories[0]?.slug || "" });
    else setCategoryForm(EMPTY_CATEGORY);
    setIsModalOpen(true);
  };

  const openEdit = (item, type) => {
    setModalType(type); setModalMode("edit"); setEditId(item._id);
    if (type === "product") setProductForm({ ...EMPTY_PRODUCT, ...item, gallery: item.gallery || [], attributes: item.attributes || [] });
    else setCategoryForm({ title: item.title || "", slug: item.slug || "", image: item.image || "", description: item.description || "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload, endpoint, method;
    if (modalType === "product") {
      if (!productForm.title.trim()) { showFeedback("error", "Title is required."); return; }
      if (!productForm.categorySlug) { showFeedback("error", "Category is required."); return; }
      if (!productForm.image) { showFeedback("error", "Main image is required."); return; }
      payload = { ...productForm };
      endpoint = modalMode === "create" ? "/api/products" : `/api/products/${editId}`;
      method = modalMode === "create" ? "POST" : "PUT";
    } else {
      if (!categoryForm.title.trim()) { showFeedback("error", "Title is required."); return; }
      const slug = categoryForm.slug.trim() || categoryForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      payload = { ...categoryForm, slug };
      endpoint = modalMode === "create" ? "/api/categories" : `/api/categories/${editId}`;
      method = modalMode === "create" ? "POST" : "PUT";
    }
    try {
      const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", `${modalType === "product" ? "Product" : "Category"} ${modalMode === "create" ? "created" : "updated"} successfully!`);
        setIsModalOpen(false); fetchData();
      } else showFeedback("error", data.message || "Operation failed.");
    } catch { showFeedback("error", "Submission error."); }
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Delete this ${type}?`)) return;
    const endpoint = type === "product" ? `/api/products/${id}` : `/api/categories/${id}`;
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showFeedback("success", "Deleted successfully."); fetchData(); }
      else showFeedback("error", data.message || "Delete failed.");
    } catch { showFeedback("error", "Delete error."); }
  };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorySlug?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCategories = categories.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages || 1));

  const inp = "w-full border border-[#e5dfd5] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e] placeholder:text-gray-300";
  const lbl = "block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1";

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">

        {/* Inner Page Header */}
        <div className="flex justify-between items-center border-b border-[#e5dfd5] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] font-philosopher uppercase tracking-wider">
              {activeTab === "products" ? "Products Catalog" : "Categories Catalog"}
            </h2>
            <p className="text-xs text-gray-500">
              {activeTab === "products" ? "Manage and update your products listings" : "Manage your catalog categories"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-[#1a1a2e] bg-white border border-[#e5dfd5] rounded-full px-3 py-1.5 flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              {dbType}
            </span>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-xs border shadow-sm ${feedback.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
            <strong>{feedback.type === "success" ? "✓" : "⚠"} {feedback.text}</strong>
          </div>
        )}

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "products",   label: "Products",   count: products.length },
                  { id: "categories", label: "Categories", count: categories.length },
                  { id: "inquiries",  label: "Inquiries",  count: null, href: "/admin/inquiries" },
                ].map(s => (
                  s.href ? (
                    <a key={s.id} href={s.href}
                      className="bg-white border border-[#e5dfd5] rounded-2xl p-5 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold">{s.label}</span>
                        <p className="text-sm font-semibold text-[#1a1a2e] mt-1">View All →</p>
                      </div>
                      <svg className="w-6 h-6 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  ) : (
                    <div key={s.id} onClick={() => setActiveTab(s.id)}
                      className={`bg-white border rounded-2xl p-5 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer ${activeTab === s.id ? "border-[#bfa15f]" : "border-[#e5dfd5]"}`}>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold">{s.label}</span>
                        <p className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mt-1" style={{ fontFamily: "var(--font-philosopher)" }}>{s.count}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* ── Products Tab ── */}
              {activeTab === "products" && (
                <div className="bg-white border border-[#e5dfd5] rounded-2xl overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-[#e5dfd5] flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 sm:max-w-xs">
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className={inp + " pl-8"} />
                        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex bg-[#f5f0e8] p-1 rounded-full border border-[#e5dfd5]">
                          <button onClick={() => setViewMode("table")} className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${viewMode === "table" ? "bg-[#1a1a2e] text-white shadow-sm" : "text-gray-500 hover:text-[#1a1a2e]"}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <span className="hidden sm:inline">Table</span>
                          </button>
                          <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${viewMode === "grid" ? "bg-[#1a1a2e] text-white shadow-sm" : "text-gray-500 hover:text-[#1a1a2e]"}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            <span className="hidden sm:inline">Cards</span>
                          </button>
                        </div>
                        <button onClick={() => openCreate("product")} className="bg-[#1a1a2e] text-white text-[11px] font-bold px-4 py-2.5 rounded-full hover:bg-black transition-colors flex items-center gap-2 shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                          <span className="hidden sm:inline">Add Product</span>
                          <span className="sm:hidden">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center text-gray-400 text-xs">Loading...</div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 text-xs">No products found.</div>
                  ) : viewMode === "table" ? (
                    <>
                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-xs min-w-[520px]">
                          <thead className="bg-[#faf8f5] border-b border-[#e5dfd5]">
                            <tr>
                              {["Image","Title","Category","Technique","MOQ","Actions"].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e5dfd5]/40">
                            {paginatedProducts.map(p => (
                              <tr key={p._id} className="hover:bg-[#faf8f5] transition-colors">
                                <td className="px-4 py-3">
                                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 border border-[#e5dfd5] shrink-0">
                                    {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-semibold text-[#1a1a2e] max-w-[200px] truncate">{p.title}</td>
                                <td className="px-4 py-3 text-gray-500">{p.categorySlug}</td>
                                <td className="px-4 py-3 text-gray-500">{p.technique || "—"}</td>
                                <td className="px-4 py-3 text-gray-500">{p.moq}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => openEdit(p, "product")} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#1a1a2e]/20 text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all">Edit</button>
                                    <button onClick={() => handleDelete(p._id, "product")} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Del</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile card rows */}
                      <div className="sm:hidden divide-y divide-[#e5dfd5]/40">
                        {paginatedProducts.map(p => (
                          <div key={p._id} className="flex items-start gap-3 p-3 hover:bg-[#faf8f5] transition-colors">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-[#e5dfd5] shrink-0">
                              {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-[#1a1a2e] truncate">{p.title}</p>
                              <div className="flex flex-wrap gap-x-3 mt-1">
                                <span className="text-[10px] text-gray-500"><span className="font-semibold text-gray-400">Cat: </span>{p.categorySlug || "—"}</span>
                                <span className="text-[10px] text-gray-500"><span className="font-semibold text-gray-400">Tech: </span>{p.technique || "—"}</span>
                                <span className="text-[10px] text-[#bfa15f] font-semibold">{p.moq}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button onClick={() => openEdit(p, "product")} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#1a1a2e]/20 text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all">Edit</button>
                                <button onClick={() => handleDelete(p._id, "product")} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                      {paginatedProducts.map(p => (
                        <div key={p._id} className="border border-[#e5dfd5] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-square bg-gray-100">
                            {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>}
                          </div>
                          <div className="p-2.5">
                            <p className="text-[11px] font-bold text-[#1a1a2e] truncate">{p.title}</p>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{p.categorySlug}</p>
                            <span className="text-[10px] text-[#bfa15f] font-semibold">{p.moq}</span>
                            <div className="flex gap-1.5 mt-2">
                              <button onClick={() => openEdit(p, "product")} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg border border-[#1a1a2e]/20 text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all">Edit</button>
                              <button onClick={() => handleDelete(p._id, "product")} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Del</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="p-4 border-t border-[#e5dfd5] flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[10px] text-gray-400">Page {currentPage} of {totalPages} ({filteredProducts.length} items)</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#e5dfd5] text-gray-500 hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-all disabled:opacity-40 disabled:cursor-not-allowed">←</button>
                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#e5dfd5] text-gray-500 hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-all disabled:opacity-40 disabled:cursor-not-allowed">→</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Categories Tab ── */}
              {activeTab === "categories" && (
                <div className="bg-white border border-[#e5dfd5] rounded-2xl overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-[#e5dfd5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative w-full sm:w-64">
                      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search categories..." className={inp + " pl-8"} />
                      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <button onClick={() => openCreate("category")} className="bg-[#1a1a2e] text-white text-[11px] font-bold px-4 py-2.5 rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Add Category
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                    {filteredCategories.map(c => (
                      <div key={c._id} className="border border-[#e5dfd5] rounded-xl overflow-hidden bg-white">
                        <div className="aspect-square bg-gray-100">
                          {c.image && <img src={c.image} alt={c.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="p-2.5">
                          <p className="text-[11px] font-bold text-[#1a1a2e] truncate">{c.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{c.slug}</p>
                          <div className="flex gap-1.5 mt-2">
                            <button onClick={() => openEdit(c, "category")} className="flex-1 text-[10px] font-bold px-2 py-1 rounded-lg border border-[#1a1a2e]/20 text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all">Edit</button>
                            <button onClick={() => handleDelete(c._id, "category")} className="flex-1 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Del</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections tab removed — replaced by Inquiries */}

      </div>

      {/* ══ MODAL — outside the h-screen div so it overlays everything ══ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-4 sm:my-8">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
                {modalMode === "create" ? "Create" : "Edit"} {modalType === "product" ? "Product" : "Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">

              {/* PRODUCT FORM */}
              {modalType === "product" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="col-span-1 sm:col-span-2">
                      <label className={lbl}>Product Title *</label>
                      <input value={productForm.title} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} className={inp} placeholder="e.g. Hand Embroidered Jacket" required />
                    </div>
                    <div>
                      <label className={lbl}>Category *</label>
                      <select value={productForm.categorySlug} onChange={e => setProductForm(f => ({ ...f, categorySlug: e.target.value }))} className={inp} required>
                        <option value="">Select category...</option>
                        {categories.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Technique</label>
                      <input value={productForm.technique} onChange={e => setProductForm(f => ({ ...f, technique: e.target.value }))} className={inp} placeholder="e.g. Embroidery" />
                    </div>
                    <div>
                      <label className={lbl}>MOQ</label>
                      <input value={productForm.moq} onChange={e => setProductForm(f => ({ ...f, moq: e.target.value }))} className={inp} placeholder="MOQ: 50 pcs" />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Main Image *</label>
                    <div
                      onDragEnter={() => setIsDragActive(true)} onDragLeave={() => setIsDragActive(false)}
                      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setIsDragActive(false); handleMainImageUpload(e.dataTransfer.files[0]); }}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${isDragActive ? "border-[#bfa15f] bg-[#bfa15f]/5" : "border-gray-200 hover:border-[#bfa15f]/50"}`}>
                      {productForm.image ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <img src={productForm.image} className="w-16 h-16 rounded-lg object-cover border shrink-0" alt="main" />
                          <div className="text-left min-w-0">
                            <p className="text-[11px] text-emerald-600 font-bold">✓ Image uploaded</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">{productForm.image}</p>
                            <button type="button" onClick={() => setProductForm(f => ({ ...f, image: "" }))} className="text-[10px] text-rose-500 mt-1">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleMainImageUpload(e.target.files[0])} />
                          <div className="text-gray-400 text-[11px] py-2">{uploading ? "Uploading..." : "Tap to upload or drag & drop main image"}</div>
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Gallery Images</label>
                    <div className="flex flex-wrap gap-2">
                      {productForm.gallery.map((img, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} className="w-full h-full object-cover" alt={`g-${i}`} />
                          <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">✕</button>
                        </div>
                      ))}
                      <label className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#bfa15f]/50 flex items-center justify-center cursor-pointer text-gray-400 text-lg transition-colors">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleGalleryUpload(e.target.files)} />
                        {uploadingGallery ? "..." : "+"}
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-[11px] font-bold text-[#1a1a2e] mb-3 uppercase tracking-wider">Product Description</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="col-span-1 sm:col-span-2">
                        <label className={lbl}>Description</label>
                        <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className={inp + " resize-none h-20"} placeholder="Brief product description..." />
                      </div>
                      <div><label className={lbl}>Size</label><input value={productForm.size} onChange={e => setProductForm(f => ({ ...f, size: e.target.value }))} className={inp} placeholder="Free Size" /></div>
                      <div><label className={lbl}>OEM Service</label><input value={productForm.oemService} onChange={e => setProductForm(f => ({ ...f, oemService: e.target.value }))} className={inp} placeholder="Available" /></div>
                      <div className="col-span-1 sm:col-span-2"><label className={lbl}>Customization</label><input value={productForm.customization} onChange={e => setProductForm(f => ({ ...f, customization: e.target.value }))} className={inp} placeholder="Anything can be customized..." /></div>
                      <div><label className={lbl}>Customized Logo (min order)</label><input value={productForm.customizedLogo} onChange={e => setProductForm(f => ({ ...f, customizedLogo: e.target.value }))} className={inp} placeholder="300 pieces" /></div>
                      <div><label className={lbl}>Customized Packaging (min order)</label><input value={productForm.customizedPackaging} onChange={e => setProductForm(f => ({ ...f, customizedPackaging: e.target.value }))} className={inp} placeholder="300 pieces" /></div>
                      <div className="col-span-1 sm:col-span-2">
                        <label className={lbl}>Product Spotlight</label>
                        <textarea value={productForm.spotlight} onChange={e => setProductForm(f => ({ ...f, spotlight: e.target.value }))} className={inp + " resize-none h-20"} placeholder="Highlight features..." />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-[11px] font-bold text-[#1a1a2e] mb-3 uppercase tracking-wider">Key Attributes</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {KEY_ATTRIBUTES.map(({ field, label: attrLbl }) => (
                        <div key={field}>
                          <label className={lbl}>{attrLbl}</label>
                          <input value={productForm[field] || ""} onChange={e => setProductForm(f => ({ ...f, [field]: e.target.value }))} className={inp} placeholder={`Enter ${attrLbl}...`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* CATEGORY FORM */}
              {modalType === "category" && (
                <div className="space-y-4">
                  <div><label className={lbl}>Category Title *</label><input value={categoryForm.title} onChange={e => setCategoryForm(f => ({ ...f, title: e.target.value }))} className={inp} placeholder="e.g. Hand Embroidered Jacket" required /></div>
                  <div><label className={lbl}>Slug (auto-generated if empty)</label><input value={categoryForm.slug} onChange={e => setCategoryForm(f => ({ ...f, slug: e.target.value }))} className={inp} placeholder="hand-embroidered-jacket" /></div>
                  <div><label className={lbl}>Description</label><textarea value={categoryForm.description} onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))} className={inp + " resize-none h-20"} placeholder="Brief category description..." /></div>
                  <div>
                    <label className={lbl}>Category Image *</label>
                    <div className="border-2 border-dashed border-gray-200 hover:border-[#bfa15f]/50 rounded-xl p-4 text-center transition-colors">
                      {categoryForm.image ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <img src={categoryForm.image} className="w-16 h-16 rounded-lg object-cover border shrink-0" alt="cat" />
                          <div className="text-left">
                            <p className="text-[11px] text-emerald-600 font-bold">✓ Image uploaded</p>
                            <button type="button" onClick={() => setCategoryForm(f => ({ ...f, image: "" }))} className="text-[10px] text-rose-500">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleCatImageUpload(e.target.files[0])} />
                          <div className="text-gray-400 text-[11px] py-2">{catUploading ? "Uploading..." : "Tap to upload category image"}</div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-[12px] font-semibold px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="text-[12px] font-bold px-6 py-2.5 rounded-full bg-[#1a1a2e] text-white hover:bg-black transition-colors">
                  {modalMode === "create" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400 text-xs">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
