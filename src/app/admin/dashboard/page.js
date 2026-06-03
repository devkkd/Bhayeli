"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'collections', 'categories'
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid' (for products)
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbType, setDbType] = useState('MongoDB');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [modalType, setModalType] = useState('product'); // 'product' or 'category'
  const [currentProductId, setCurrentProductId] = useState(null); // acts as itemId for both
  
  // Form Fields - Common & Product Specific
  const [formTitle, setFormTitle] = useState('');
  const [formMOQ, setFormMOQ] = useState('MOQ: 50 pcs');
  const [formCollection, setFormCollection] = useState('');
  const [formImage, setFormImage] = useState('/image/category/makeup-bags.png');

  // Form Fields - Category Specific
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Upload & Drag-and-Drop States
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Notification / Feedback State
  const [feedback, setFeedback] = useState(null);
  
  // Preset Images with labels and icons for visual choice
  const presetImages = [
    { label: 'Makeup Bags', value: '/image/category/makeup-bags.png', preview: '/image/category/makeup-bags.png' },
    { label: 'Kimono Robe', value: '/image/category/kimono-robe.png', preview: '/image/category/kimono-robe.png' },
    { label: 'Tote Bags', value: '/image/category/tote-bag.png', preview: '/image/category/tote-bag.png' },
    { label: 'Jacket', value: '/image/category/jacket.png', preview: '/image/category/jacket.png' },
    { label: 'Nightwear', value: '/image/category/nightwear.png', preview: '/image/category/nightwear.png' },
    { label: 'Embroidered', value: '/image/category/hand-embroidered.png', preview: '/image/category/hand-embroidered.png' },
  ];

  // Fetch Dashboard Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.data || []);
      }
      
      // 2. Fetch Collections
      const colRes = await fetch('/api/collections');
      const colData = await colRes.json();
      if (colData.success) {
        setCollections(colData.data || []);
        if (colData.data && colData.data.length > 0 && !formCollection) {
          setFormCollection(colData.data[0].slug);
        }
      }

      // 3. Fetch Categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.data || []);
      }

      // Check DB configuration via endpoint
      const dbCheckRes = await fetch('/api/admin/setup');
      const dbCheckData = await dbCheckRes.json();
      if (dbCheckData.database) {
        setDbType(dbCheckData.database);
      } else {
        setDbType('MongoDB Active');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showFeedback('error', 'Failed to retrieve products, collections, and categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/admin';
      }
    } catch (error) {
      showFeedback('error', 'Logout failed.');
    }
  };

  // Open Create Modal (Product or Category)
  const openCreateModal = (type = 'product') => {
    setModalType(type);
    setModalMode('create');
    setCurrentProductId(null);
    setFormTitle('');
    setFormImage('/image/category/makeup-bags.png');
    setUploading(false);
    setIsDragActive(false);
    
    if (type === 'product') {
      setFormMOQ('MOQ: 50 pcs');
      if (collections.length > 0) {
        setFormCollection(collections[0].slug);
      }
    } else {
      setFormSlug('');
      setFormDescription('');
    }
    
    setIsModalOpen(true);
  };

  // Open Edit Modal (Product or Category)
  const openEditModal = (item, type = 'product') => {
    setModalType(type);
    setModalMode('edit');
    setCurrentProductId(item._id);
    setFormTitle(item.title || item.name || '');
    setFormImage(item.image);
    setUploading(false);
    setIsDragActive(false);
    
    if (type === 'product') {
      setFormMOQ(item.moq || 'MOQ: 50 pcs');
      setFormCollection(item.collectionSlug);
    } else {
      setFormSlug(item.slug || '');
      setFormDescription(item.description || '');
    }
    
    setIsModalOpen(true);
  };

  // Handle Drag & Drop Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle Image Upload API request
  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Only image files (JPG, PNG, WebP) are allowed.');
      return;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      showFeedback('error', 'Image size should be less than 5MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setFormImage(data.url);
        showFeedback('success', `Image uploaded successfully! (${data.engine || 'Local Disk'})`);
      } else {
        showFeedback('error', data.message || 'Image upload failed.');
      }
    } catch (error) {
      showFeedback('error', 'Network error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  // Handle Form Submit (Create & Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formTitle.trim()) {
      showFeedback('error', `${modalType === 'product' ? 'Product' : 'Category'} title is required.`);
      return;
    }
    
    // Assemble appropriate payload
    let payload = {};
    let endpoint = '';
    let method = 'POST';

    if (modalType === 'product') {
      payload = {
        title: formTitle,
        moq: formMOQ,
        collectionSlug: formCollection,
        image: formImage
      };
      endpoint = modalMode === 'create' ? '/api/products' : `/api/products/${currentProductId}`;
      method = modalMode === 'create' ? 'POST' : 'PUT';
    } else {
      const generatedSlug = formSlug.trim() || formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (!generatedSlug) {
        showFeedback('error', 'Category title is required to generate a slug.');
        return;
      }

      payload = {
        title: formTitle,
        slug: generatedSlug,
        image: formImage,
        description: ''
      };
      endpoint = modalMode === 'create' ? '/api/categories' : `/api/categories/${currentProductId}`;
      method = modalMode === 'create' ? 'POST' : 'PUT';
    }

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showFeedback('success', `${modalType === 'product' ? 'Product' : 'Category'} ${modalMode === 'create' ? 'created' : 'updated'} successfully!`);
        setIsModalOpen(false);
        fetchData(); // reload
      } else {
        showFeedback('error', data.message || 'Operation failed.');
      }
    } catch (error) {
      showFeedback('error', 'An error occurred during submission.');
    }
  };

  // Handle Delete Product or Category
  const handleDeleteProduct = async (id, type = 'product') => {
    const label = type === 'product' ? 'product' : 'category';
    if (!confirm(`Are you absolutely sure you want to delete this ${label}?`)) return;

    const endpoint = type === 'product' ? `/api/products/${id}` : `/api/categories/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        showFeedback('success', `${type === 'product' ? 'Product' : 'Category'} deleted successfully.`);
        fetchData();
      } else {
        showFeedback('error', data.message || `Failed to delete ${label}.`);
      }
    } catch (error) {
      showFeedback('error', `Failed to delete ${label}.`);
    }
  };

  // Client-side search filtration
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.collectionSlug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f5f0e8] to-[#ede7dd] flex font-sans text-gray-800 overflow-hidden">
      
      {/* ──── Floating Ambient Light Accents ──── */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1a1a2e]/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#bfa15f]/8 blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a2e03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
      
      {/* ──── Sidebar ──── */}
      <aside className="w-66 bg-white/75 border-r border-[#e5dfd5]/80 backdrop-blur-xl flex flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(26,26,46,0.02)] z-20 relative transition-all duration-300">
        <div className="z-10">
          {/* Logo Brand Box */}
          <div className="p-6 border-b border-[#e5dfd5]/60 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-[2px] border border-[#bfa15f]/30 shadow-md transition-all duration-500 hover:rotate-6 hover:scale-105">
              <img src="/image/logo.png" alt="Bhayeli Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="text-[#1a1a2e] text-md font-bold tracking-wider font-philosopher">BHAYELI</h2>
              <span className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold font-montserrat">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {/* Products Tab */}
            <button
              onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 group ${
                activeTab === 'products'
                  ? 'bg-[#1a1a2e] text-white shadow-lg shadow-[#1a1a2e]/10 border-l-4 border-[#bfa15f]'
                  : 'text-gray-500 hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${activeTab === 'products' ? 'text-[#bfa15f]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Products</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${activeTab === 'products' ? 'bg-[#bfa15f]/25 text-[#f5f0e8]' : 'bg-gray-100 text-gray-500'}`}>
                {products.length}
              </span>
            </button>

            {/* Categories Tab */}
            <button
              onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 group ${
                activeTab === 'categories'
                  ? 'bg-[#1a1a2e] text-white shadow-lg shadow-[#1a1a2e]/10 border-l-4 border-[#bfa15f]'
                  : 'text-gray-500 hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${activeTab === 'categories' ? 'text-[#bfa15f]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                <span>Categories</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${activeTab === 'categories' ? 'bg-[#bfa15f]/25 text-[#f5f0e8]' : 'bg-gray-100 text-gray-500'}`}>
                {categories.length}
              </span>
            </button>

            {/* Collections Tab */}
            <button
              onClick={() => { setActiveTab('collections'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 group ${
                activeTab === 'collections'
                  ? 'bg-[#1a1a2e] text-white shadow-lg shadow-[#1a1a2e]/10 border-l-4 border-[#bfa15f]'
                  : 'text-gray-500 hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${activeTab === 'collections' ? 'text-[#bfa15f]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>Collections</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${activeTab === 'collections' ? 'bg-[#bfa15f]/25 text-[#f5f0e8]' : 'bg-gray-100 text-gray-500'}`}>
                {collections.length}
              </span>
            </button>
          </nav>
        </div>

        {/* View Storefront Shortcut & Profile box */}
        <div className="p-4 border-t border-[#e5dfd5]/60 space-y-4 bg-[#fcfbf9]/40 z-10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#bfa15f]/10 border border-[#bfa15f]/20 text-[#bfa15f] hover:bg-[#bfa15f] hover:text-white transition-all duration-300 font-bold py-2 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-sm"
          >
            <span>Live Storefront</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1a1a2e] to-[#2e2e50] text-[#f5f0e8] font-bold flex items-center justify-center text-xs shadow-md border border-white/50">
              <svg className="w-4 h-4 text-[#f5f0e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[#1a1a2e] text-xs font-bold leading-tight font-montserrat">Admin User</p>
              <span className="text-[8px] text-[#bfa15f] tracking-widest uppercase font-bold">Store Manager</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 text-[#1a1a2e] font-bold py-2.5 rounded-xl text-xs hover:bg-[#1a1a2e] hover:text-white hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ──── Main Content Area ──── */}
      <section className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
        
        {/* Action Header */}
        <header className="h-[80px] bg-white/40 border-b border-[#e5dfd5]/60 px-8 flex items-center justify-between shrink-0 backdrop-blur-md z-10 relative">
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e] font-philosopher uppercase tracking-wider leading-none">Dashboard Overview</h1>
            <p className="text-[9px] text-[#bfa15f] font-bold uppercase tracking-widest mt-1.5 font-montserrat">Real-time catalog control panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-600 bg-white/80 border border-[#e5dfd5]/60 rounded-full px-3.5 py-1.5 shadow-sm font-semibold flex items-center gap-2 font-montserrat tracking-wide">
              <svg className="w-3.5 h-3.5 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <div className="h-5 w-px bg-gray-300/60" />
            <span className="text-[10px] font-bold text-[#1a1a2e] bg-white/80 border border-[#e5dfd5]/60 rounded-full px-3 py-1.5 shadow-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {dbType.split(' ')[0]} Server
            </span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8 relative">

          {/* Feedback Alerts */}
          {feedback && (
            <div className={`p-4 rounded-2xl text-xs border leading-relaxed shadow-lg animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700 backdrop-blur-md'
                : 'bg-rose-50/90 border-rose-200 text-rose-700 backdrop-blur-md'
            }`}>
              <div className="flex gap-2.5 items-center">
                <span className="text-sm font-bold">{feedback.type === 'success' ? '✓' : '⚠'}</span>
                <strong>{feedback.text}</strong>
              </div>
            </div>
          )}

          {/* ──── Stat Cards Section ──── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stat Card 1 - Products */}
            <div 
              onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
              className={`bg-white/85 border rounded-2xl p-6 shadow-[0_10px_30px_rgba(26,26,46,0.02)] flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer ${activeTab === 'products' ? 'border-[#bfa15f] bg-[#f5f0e8]/20' : 'border-[#e5dfd5]/80'}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1a1a2e]/2 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />
              <div className="z-10">
                <span className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold font-montserrat">Total Products</span>
                <p className="text-4xl font-bold text-[#1a1a2e] mt-1 font-philosopher leading-tight">{products.length}</p>
                <span className="text-[10px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Real-time synced
                </span>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-[#faf8f5] border border-[#e5dfd5]/60 flex items-center justify-center text-[#1a1a2e] shadow-sm transition-all duration-300 group-hover:bg-[#1a1a2e] group-hover:text-[#f5f0e8] group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            {/* Stat Card 2 - Categories */}
            <div 
              onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
              className={`bg-white/85 border rounded-2xl p-6 shadow-[0_10px_30px_rgba(26,26,46,0.02)] flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer ${activeTab === 'categories' ? 'border-[#bfa15f] bg-[#f5f0e8]/20' : 'border-[#e5dfd5]/80'}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#bfa15f]/2 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />
              <div className="z-10">
                <span className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold font-montserrat">Catalog Categories</span>
                <p className="text-4xl font-bold text-[#1a1a2e] mt-1 font-philosopher leading-tight">{categories.length}</p>
                <span className="text-[10px] text-gray-500 font-semibold mt-2.5 block">Store categories with images</span>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-[#faf8f5] border border-[#e5dfd5]/60 flex items-center justify-center text-[#1a1a2e] shadow-sm transition-all duration-300 group-hover:bg-[#1a1a2e] group-hover:text-[#f5f0e8] group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
              </div>
            </div>

            {/* Stat Card 3 - Collections */}
            <div 
              onClick={() => { setActiveTab('collections'); setSearchQuery(''); }}
              className={`bg-white/85 border rounded-2xl p-6 shadow-[0_10px_30px_rgba(26,26,46,0.02)] flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer ${activeTab === 'collections' ? 'border-[#bfa15f] bg-[#f5f0e8]/20' : 'border-[#e5dfd5]/80'}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#bfa15f]/2 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />
              <div className="z-10">
                <span className="text-[9px] uppercase tracking-widest text-[#bfa15f] font-bold font-montserrat">Active Collections</span>
                <p className="text-4xl font-bold text-[#1a1a2e] mt-1 font-philosopher leading-tight">{collections.length}</p>
                <span className="text-[10px] text-[#bfa15f] font-semibold mt-2.5 block font-montserrat tracking-wide">Dynamic folders</span>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-[#faf8f5] border border-[#e5dfd5]/60 flex items-center justify-center text-[#bfa15f] shadow-sm transition-all duration-300 group-hover:bg-[#bfa15f] group-hover:text-white group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>

          </div>

          {/* ──── Tab 1: Products Manager ──── */}
          {activeTab === 'products' && (
            <div className="bg-white/80 border border-[#e5dfd5]/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(26,26,46,0.02)] overflow-hidden">
              
              {/* Products Toolbar */}
              <div className="p-6 border-b border-[#e5dfd5]/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fcfbf9]/50">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-full sm:w-64 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search catalog products..."
                      className="w-full bg-white border border-[#e5dfd5] rounded-full py-2.5 pl-9 pr-4 text-xs outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 transition-all text-[#1a1a2e] font-sans shadow-inner placeholder:text-gray-400"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>

                  <div className="flex bg-[#f5f0e8]/80 p-1 rounded-full border border-[#e5dfd5]/70 shadow-sm shrink-0">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1 ${
                        viewMode === 'table'
                          ? 'bg-[#1a1a2e] text-[#f5f0e8] shadow-md'
                          : 'text-gray-500 hover:text-[#1a1a2e]'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1 ${
                        viewMode === 'grid'
                          ? 'bg-[#1a1a2e] text-[#f5f0e8] shadow-md'
                          : 'text-gray-500 hover:text-[#1a1a2e]'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Cards
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => openCreateModal('product')}
                  className="bg-[#1a1a2e] text-[#f5f0e8] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#1a1a2e]/95 hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer w-full sm:w-auto justify-center group"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-95 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products content list */}
              {loading ? (
                <div className="p-20 text-center text-gray-400 space-y-4">
                  <div className="relative w-12 h-12 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-[#e5dfd5] opacity-25" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#1a1a2e] border-r-[#bfa15f] animate-spin" />
                  </div>
                  <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-montserrat">Fetching dynamic catalog data...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-20 text-center bg-white/40">
                  <div className="w-16 h-16 bg-[#faf8f5] border border-[#e5dfd5]/60 rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">📭</div>
                  <h3 className="text-md font-bold text-[#1a1a2e] mt-4 font-philosopher uppercase tracking-wider">No matching products found</h3>
                  <p className="text-xs text-gray-400 mt-1">Try modifying your search or click add product.</p>
                </div>
              ) : viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fcfbf9]/60 text-[9px] text-[#bfa15f] uppercase tracking-widest font-bold border-b border-[#e5dfd5]/60 font-montserrat">
                        <th className="py-4 px-6">Product Details</th>
                        <th className="py-4 px-6">Collection Group</th>
                        <th className="py-4 px-6">Minimum Order (MOQ)</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5dfd5]/40 bg-white/30">
                      {filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-[#f5f0e8]/30 transition-all duration-200 group">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <div className="w-13 h-13 rounded-xl bg-white border border-[#e5dfd5] p-0.5 overflow-hidden shrink-0 shadow-sm group-hover:scale-[1.03] transition-transform duration-300">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => { e.target.src = '/image/category/makeup-bags.png'; }}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#1a1a2e] leading-snug group-hover:text-[#bfa15f] transition-colors">{product.title}</h4>
                              <span className="text-[9px] text-gray-400 font-mono select-all mt-1 block">ID: {product._id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5 bg-white border border-[#e5dfd5] text-[#1a1a2e] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-montserrat shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#bfa15f]" />
                              {product.collectionSlug}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs text-gray-600 font-semibold">{product.moq || 'MOQ: 50 pcs'}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2.5">
                              <button
                                onClick={() => openEditModal(product, 'product')}
                                className="px-3.5 py-1.5 bg-[#1a1a2e]/5 hover:bg-[#1a1a2e] text-[#1a1a2e] hover:text-[#f5f0e8] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 border border-[#1a1a2e]/10 hover:border-transparent hover:shadow-sm cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id, 'product')}
                                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 border border-rose-200/50 hover:border-transparent hover:shadow-sm cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-[#fcfbf9]/40 border-t border-[#e5dfd5]/40">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="flex flex-col gap-3.5 bg-white border border-[#e5dfd5]/85 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
                      <div className="w-full h-44 overflow-hidden rounded-xl bg-[#faf8f5] border border-[#e5dfd5]/40 relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.target.src = '/image/category/makeup-bags.png'; }}
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#1a1a2e]/85 backdrop-blur-sm text-[8px] font-bold text-[#f5f0e8] uppercase tracking-wider px-2 py-1 rounded-full border border-white/10">
                          <span>📁 {product.collectionSlug}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 px-1 min-h-[46px] justify-center">
                        <h3 className="text-[#1a1a2e] text-[13px] font-bold leading-snug group-hover:text-[#bfa15f] transition-colors line-clamp-2">{product.title}</h3>
                        <span className="text-[10px] text-gray-400 font-bold tracking-wide mt-1 block">{product.moq || 'MOQ: 50 pcs'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5dfd5]/50">
                        <button
                          onClick={() => openEditModal(product, 'product')}
                          className="w-full py-2 bg-[#f5f0e8] hover:bg-[#1a1a2e] hover:text-white text-[#1a1a2e] text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 text-center cursor-pointer border border-[#e5dfd5]/60 hover:border-transparent"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, 'product')}
                          className="w-full py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 text-center cursor-pointer border border-rose-100 hover:border-transparent"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──── Tab 2: Categories Page / Manager ──── */}
          {activeTab === 'categories' && (
            <div className="bg-white/80 border border-[#e5dfd5]/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(26,26,46,0.02)] overflow-hidden">
              
              {/* Categories Toolbar */}
              <div className="p-6 border-b border-[#e5dfd5]/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fcfbf9]/50">
                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories by title..."
                    className="w-full bg-white border border-[#e5dfd5] rounded-full py-2.5 pl-9 pr-4 text-xs outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 transition-all text-[#1a1a2e] font-sans shadow-inner placeholder:text-gray-400"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>

                <button
                  onClick={() => openCreateModal('category')}
                  className="bg-[#1a1a2e] text-[#f5f0e8] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#1a1a2e]/95 hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer w-full sm:w-auto justify-center group"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-95 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Category</span>
                </button>
              </div>

              {/* Categories Cards Layout Display */}
              {loading ? (
                <div className="p-20 text-center text-gray-400">
                  <div className="animate-spin h-6 w-6 text-[#1a1a2e] mx-auto border-2 border-t-current rounded-full" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-20 text-center bg-white/40">
                  <div className="w-16 h-16 bg-[#faf8f5] border border-[#e5dfd5]/60 rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">🏷️</div>
                  <h3 className="text-md font-bold text-[#1a1a2e] mt-4 font-philosopher uppercase tracking-wider">No categories found</h3>
                  <p className="text-xs text-gray-400 mt-1">Try adding a new category above.</p>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#fcfbf9]/45">
                  {filteredCategories.map((category) => (
                    <div key={category._id} className="p-5 border border-[#e5dfd5]/80 bg-white rounded-2xl flex flex-col justify-between hover:border-[#bfa15f] hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-2.5 h-full bg-[#bfa15f] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div>
                        {/* Category Heading & Image Preview */}
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#e5dfd5] bg-[#faf8f5] p-0.5 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                            <img 
                              src={category.image} 
                              alt={category.title} 
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => { e.target.src = '/image/category/makeup-bags.png'; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider font-montserrat truncate group-hover:text-[#bfa15f] transition-colors">{category.title || category.name}</h4>
                            <span className="text-[9px] font-mono text-gray-400 block mt-1 select-all">slug: <strong className="text-[#1a1a2e] font-semibold">{category.slug}</strong></span>
                          </div>
                        </div>

                        {/* Description block */}
                        <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-3 font-sans min-h-[54px]">{category.description || 'No description configured for this active storefront category.'}</p>
                      </div>

                      {/* Action buttons footer */}
                      <div className="mt-5 pt-3.5 border-t border-[#e5dfd5]/60 flex justify-between items-center select-none">
                        <span className="text-[8px] bg-[#1a1a2e]/5 border border-[#e5dfd5] text-gray-500 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-montserrat">
                          Store Category
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(category, 'category')}
                            className="px-3.5 py-1.5 bg-[#f5f0e8] hover:bg-[#1a1a2e] hover:text-[#f5f0e8] text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 border border-[#e5dfd5]/60 hover:border-transparent cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(category._id, 'category')}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 border border-rose-100 hover:border-transparent cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──── Tab 3: Collections View ──── */}
          {activeTab === 'collections' && (
            <div className="bg-white/80 border border-[#e5dfd5]/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(26,26,46,0.02)] p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#e5dfd5]/60">
                <div>
                  <h3 className="text-md font-bold text-[#1a1a2e] font-philosopher uppercase tracking-wider">Active Folders</h3>
                  <p className="text-[10px] text-[#bfa15f] font-bold uppercase tracking-widest mt-1 font-montserrat">Active catalog collection groupings</p>
                </div>
                <span className="text-[10px] bg-[#1a1a2e]/5 border border-[#e5dfd5] text-[#1a1a2e] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full font-montserrat shadow-sm select-none">
                  Total Groups: {collections.length}
                </span>
              </div>

              {loading ? (
                <div className="p-16 text-center text-gray-400">
                  <div className="animate-spin h-6 w-6 text-[#1a1a2e] mx-auto border-2 border-t-current rounded-full" />
                </div>
              ) : collections.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No collection folders exist.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                  {collections.map((col) => {
                    const count = products.filter(p => p.collectionSlug === col.slug).length;

                    return (
                      <div key={col._id} className="p-6 border border-[#e5dfd5]/80 rounded-2xl bg-white flex flex-col justify-between hover:border-[#bfa15f] hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-[#1a1a2e] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#f5f0e8] text-[#1a1a2e] flex items-center justify-center border border-[#e5dfd5]/60 group-hover:bg-[#1a1a2e] group-hover:text-white transition-colors duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                              </div>
                              <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider font-montserrat">{col.title}</h4>
                            </div>
                            <span className="text-[9px] font-bold bg-[#bfa15f]/15 text-[#bfa15f] px-2.5 py-1 rounded-full border border-[#bfa15f]/10 shadow-sm uppercase font-montserrat">
                              {count} {count === 1 ? 'Product' : 'Products'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-4 leading-relaxed font-sans">{col.description || 'No description available for this active collection folder.'}</p>
                        </div>
                        <div className="mt-5 pt-3.5 border-t border-[#e5dfd5]/60 flex justify-between items-center select-all">
                          <span className="text-[9px] font-mono text-gray-400">slug: <strong className="text-[#1a1a2e]">{col.slug}</strong></span>
                          <span className="text-[9px] bg-[#faf8f5] border border-[#e5dfd5]/80 text-[#bfa15f] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-montserrat">
                            {col.tag || 'Bhayeli Design'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ──── Add / Edit Premium Polymorphic Modal with Real-Time Live Preview ──── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0d0d17]/45 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          
          <div className="bg-white border border-[#e5dfd5] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-slide-up relative flex flex-col md:grid md:grid-cols-12 min-h-[580px] md:h-auto max-h-[90vh]">
            
            {/* LEFT COLUMN: Input Form (Col span 7) */}
            <div className="p-6 md:p-8 col-span-7 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-none">
              
              {/* Modal header inside form */}
              <div className="pb-4 border-b border-[#e5dfd5]/60 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-widest font-philosopher flex items-center gap-2">
                    {modalMode === 'create' ? (
                      <>
                        <span className="w-5 h-5 rounded-full bg-[#1a1a2e]/5 text-[#1a1a2e] flex items-center justify-center border border-[#1a1a2e]/10 text-xs">＋</span>
                        <span>Add {modalType === 'product' ? 'Product' : 'Category'} Entry</span>
                      </>
                    ) : (
                      <>
                        <span className="w-5 h-5 rounded-full bg-[#1a1a2e]/5 text-[#1a1a2e] flex items-center justify-center border border-[#1a1a2e]/10 text-xs">✎</span>
                        <span>Edit {modalType === 'product' ? 'Product' : 'Category'} Details</span>
                      </>
                    )}
                  </h3>
                  <p className="text-[9px] text-[#bfa15f] font-bold uppercase tracking-widest mt-1 font-montserrat">Define catalog metadata values</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#1a1a2e] hover:text-white flex items-center justify-center text-xs text-gray-500 transition-all duration-300 border border-gray-200 cursor-pointer shadow-sm"
                >
                  ✕
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleFormSubmit} className="space-y-4 pt-5 flex-1">
                
                {/* Title Input (Common) */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest font-montserrat">
                    {modalType === 'product' ? 'Product' : 'Category'} Name / Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (modalType === 'category') {
                        setFormSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '')
                        );
                      }
                    }}
                    placeholder={modalType === 'product' ? 'e.g., Hand Block Printed Silk Robe' : 'e.g., Luxury Apparel'}
                    required
                    className="w-full bg-[#faf8f5] border border-[#e5dfd5] rounded-xl px-4 py-2.5 text-xs text-[#1a1a2e] outline-none focus:bg-white focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/20 transition-all font-sans"
                  />
                </div>

                {/* Category Slug Field auto-generated, not rendered in form */}

                {/* MOQ Field (Only for products) */}
                {modalType === 'product' && (
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest font-montserrat">
                      Minimum Order Quantity (MOQ)
                    </label>
                    <input
                      type="text"
                      value={formMOQ}
                      onChange={(e) => setFormMOQ(e.target.value)}
                      placeholder="e.g., MOQ: 50 pcs"
                      className="w-full bg-[#faf8f5] border border-[#e5dfd5] rounded-xl px-4 py-2.5 text-xs text-[#1a1a2e] outline-none focus:bg-white focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/20 transition-all font-sans"
                    />
                  </div>
                )}

                {/* Collection Dropdown (Only for products) */}
                {modalType === 'product' && (
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest font-montserrat">
                      Collection Folder Group *
                    </label>
                    <select
                      value={formCollection}
                      onChange={(e) => setFormCollection(e.target.value)}
                      required
                      className="w-full bg-[#faf8f5] border border-[#e5dfd5] rounded-xl px-4 py-2.5 text-xs text-[#1a1a2e] outline-none focus:bg-white focus:border-[#bfa15f] transition-all font-sans cursor-pointer"
                    >
                      {collections.map((col) => (
                        <option key={col.slug} value={col.slug}>
                          📁 {col.title} ({col.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category Description not rendered in form */}

                {/* Image Selection with Drag-and-Drop Uploader */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest font-montserrat">
                    Product Image / Cover Photo *
                  </label>
                  
                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('modal-image-upload-file').click()}
                    className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                      isDragActive
                        ? 'border-[#bfa15f] bg-[#bfa15f]/5 shadow-inner'
                        : 'border-[#e5dfd5] hover:border-[#bfa15f] bg-[#faf8f5]/40 hover:bg-[#faf8f5]/80'
                    }`}
                  >
                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="modal-image-upload-file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                      }}
                    />

                    {uploading ? (
                      /* Uploading Spinner Overlay */
                      <div className="flex flex-col items-center gap-2.5 py-2 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-3 border-[#e5dfd5] border-t-[#bfa15f] animate-spin" />
                        <span className="text-[10px] text-[#bfa15f] font-bold uppercase tracking-wider font-montserrat">Uploading to server...</span>
                      </div>
                    ) : (
                      /* Default Uploader State */
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#e5dfd5]/60 shadow-sm group-hover:scale-105 transition-transform duration-300">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-[#bfa15f] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-[11px] text-[#1a1a2e] font-semibold font-sans">
                          Drag & drop your file here, or <span className="text-[#bfa15f] hover:underline">browse files</span>
                        </p>
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider font-montserrat">Supports JPG, PNG, WebP up to 5MB</span>
                      </div>
                    )}
                  </div>

                  {/* Text path backup */}
                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="/image/category/makeup-bags.png"
                      required
                      className="w-full bg-[#faf8f5] border border-[#e5dfd5] rounded-xl pl-4 pr-16 py-2.5 text-[10px] text-[#1a1a2e] outline-none focus:bg-white focus:border-[#bfa15f] transition-all font-mono shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
                      URL PATH
                    </span>
                  </div>
                  
                  {/* Visual presets thumbnails grid removed */}
                </div>

                {/* Form Buttons */}
                <div className="pt-6 border-t border-[#e5dfd5]/60 flex items-center justify-end gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1a1a2e] text-[#f5f0e8] text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1a1a2e]/90 hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 shadow-md cursor-pointer border border-transparent"
                  >
                    <span>✓ Save Entry</span>
                  </button>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: Real-Time Live Preview Bay (Col span 5) */}
            <div className="col-span-5 bg-gradient-to-br from-[#faf8f5] to-[#f5f0e8] border-t md:border-t-0 md:border-l border-[#e5dfd5]/80 p-8 flex flex-col justify-center items-center relative overflow-hidden select-none">
              
              {/* Preview Bay Accents */}
              <div className="absolute top-[-20%] right-[-20%] w-48 h-48 rounded-full bg-[#bfa15f]/5 blur-xl pointer-events-none" />
              <div className="absolute bottom-[-25%] left-[-20%] w-48 h-48 rounded-full bg-[#1a1a2e]/3 blur-xl pointer-events-none" />
              
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-[#1a1a2e] font-montserrat shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live {modalType === 'product' ? 'Product' : 'Category'} preview
              </div>

              {/* CONDITIONAL RENDER: Product Mockup vs Category Mockup */}
              {modalType === 'product' ? (
                /* Real-Time Product Card Preview */
                <div className="w-full max-w-[210px] bg-white border border-[#e5dfd5]/85 rounded-2xl p-3 shadow-md transform rotate-1 scale-[1.02] hover:rotate-0 transition-transform duration-500 z-10 flex flex-col gap-2.5 animate-fade-in">
                  
                  {/* Visual Image Screen */}
                  <div className="w-full h-36 overflow-hidden rounded-xl bg-[#faf8f5] border border-[#e5dfd5]/40 relative">
                    <img
                      src={formImage || '/image/category/makeup-bags.png'}
                      alt="Live preview mockup"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/image/category/makeup-bags.png'; }}
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#1a1a2e]/85 backdrop-blur-sm text-[6.5px] font-bold text-[#f5f0e8] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/5">
                      📁 {formCollection || 'collections'}
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="flex flex-col gap-0.5 px-0.5 min-h-[38px] justify-center text-left">
                    <h4 className="text-[#1a1a2e] text-[11px] font-bold leading-tight font-sans line-clamp-2">
                      {formTitle || 'Sample Product Title'}
                    </h4>
                    <span className="text-[8px] text-gray-400 font-bold mt-0.5 block uppercase tracking-wide">
                      {formMOQ || 'MOQ: 50 pcs'}
                    </span>
                  </div>

                  {/* Mock buttons */}
                  <div className="flex flex-col gap-1.5 pt-1.5 border-t border-[#e5dfd5]/50">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-[#1a1a2e] text-[#f5f0e8] text-[7.5px] font-bold py-1.5 rounded-full text-center tracking-wider">
                        Enquire Now →
                      </div>
                      <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm">
                        <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="w-full text-center border border-gray-300 text-[#1a1a2e] text-[7px] font-bold py-1.5 rounded-full tracking-wide bg-white shadow-inner">
                      + Add to Cart
                    </div>
                  </div>
                </div>
              ) : (
                /* Real-Time Category Card Preview */
                <div className="w-full max-w-[230px] bg-white border border-[#e5dfd5] rounded-2xl p-4.5 shadow-md transform -rotate-1 scale-[1.02] hover:rotate-0 transition-transform duration-500 z-10 flex flex-col gap-3.5 animate-fade-in text-left">
                  
                  {/* Category Image Frame */}
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-[#e5dfd5]/60 bg-[#faf8f5] p-0.5 relative">
                    <img 
                      src={formImage || '/image/category/makeup-bags.png'} 
                      alt="Category preview" 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/image/category/makeup-bags.png'; }}
                    />
                    <div className="absolute bottom-2 left-2 bg-[#bfa15f]/90 text-[7px] font-bold text-white px-2 py-0.5 rounded-full tracking-wider uppercase font-montserrat shadow-sm">
                      Aesthetic Category
                    </div>
                  </div>

                  {/* Info block details */}
                  <div className="space-y-1 select-none">
                    <h4 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider font-montserrat truncate leading-tight">
                      {formTitle || 'Category Name'}
                    </h4>
                    <span className="text-[8px] font-mono text-gray-400 block tracking-wide">
                      slug: <span className="text-[#1a1a2e] font-semibold">{formSlug || 'category-slug'}</span>
                    </span>
                  </div>

                  {/* Category Description preview omitted */}
                </div>
              )}

              {/* Subtext info */}
              <p className="text-[8px] text-gray-400 text-center mt-5 leading-normal max-w-[200px] z-10">
                This shows precisely how the {modalType === 'product' ? 'product' : 'category'} will display on the storefront and control tables.
              </p>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}
