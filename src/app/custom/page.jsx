"use client";
import React, { useState, useRef } from 'react';

export default function CustomRequest() {
  const fileInputRef = useRef(null);

  const interests = [
    "Hand Embroidered Jacket",
    "Women's Nightwear",
    "Jacket",
    "Makeup Bags",
    "Kimono Robe",
    "Tote Bags",
  ];

  const techniques = [
    "Block Print",
    "Dabu Print",
    "Chikankari Embroidery",
    "Digital Print",
    "Appliqué Handwork",
  ];

  const quantities = [
    "Small order (30 - 49 pieces)",
    "Medium order (50 - 99 pieces)",
    "Large order (>= 100 pieces)",
  ];

  const contactFields = [
    { key: "companyName", label: "Company Name", placeholder: "Enter Company Name", required: false },
    { key: "fullName", label: "Full Name", placeholder: "Enter Full Name", required: true },
    { key: "email", label: "Email Address", placeholder: "Enter Email Address", type: "email", required: true },
    { key: "phone", label: "Phone / WhatsApp Number", placeholder: "Enter Phone / WhatsApp Number", required: true },
    { key: "country", label: "Country", placeholder: "Enter Country", required: true },
    { key: "companyWebsite", label: "Company Website (Optional)", placeholder: "Enter Company Website", required: false },
  ];

  const steps = [
    {
      title: "1. Acknowledgment",
      desc: "You'll receive an automated confirmation email immediately upon submission.",
    },
    {
      title: "2. Review",
      desc: "Our team reviews your requirements and prepares a tailored response.",
    },
    {
      title: "3. Response",
      desc: "Within 24–48 business hours, you'll receive a detailed response with information, recommendations, or quotations.",
    },
    {
      title: "4. Conversation",
      desc: "We'll continue the dialogue to refine specifications, arrange samples, and develop your project.",
    },
  ];

  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    companyWebsite: "",
    interests: [],
    techniques: [],
    quantities: [],
    message: "",
    referenceImages: [],
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleTextChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (status.error) setStatus(prev => ({ ...prev, error: null }));
  };

  const handleCheckboxChange = (group, item) => {
    setFormData(prev => {
      const list = prev[group];
      const newList = list.includes(item)
        ? list.filter(i => i !== item)
        : [...list, item];
      return { ...prev, [group]: newList };
    });
  };

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setStatus(prev => ({ ...prev, error: "File size exceeds 8MB limit." }));
      return;
    }

    const data = new FormData();
    data.append("file", file);

    setUploadingFile(true);
    setStatus(prev => ({ ...prev, error: null }));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      if (resData.success) {
        setFormData(prev => ({
          ...prev,
          referenceImages: [...prev.referenceImages, resData.url]
        }));
      } else {
        setStatus(prev => ({ ...prev, error: resData.message || "Failed to upload image." }));
      }
    } catch {
      setStatus(prev => ({ ...prev, error: "Network error during upload." }));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) return setStatus({ loading: false, error: "Full Name is required.", success: false });
    if (!formData.email.trim()) return setStatus({ loading: false, error: "Email Address is required.", success: false });
    if (!formData.phone.trim()) return setStatus({ loading: false, error: "Phone / WhatsApp Number is required.", success: false });
    if (!formData.country.trim()) return setStatus({ loading: false, error: "Country is required.", success: false });
    if (!formData.message.trim()) return setStatus({ loading: false, error: "Product Description is required.", success: false });

    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch("/api/custom-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ loading: false, error: null, success: true });
        setFormData({
          companyName: "",
          fullName: "",
          email: "",
          phone: "",
          country: "",
          companyWebsite: "",
          interests: [],
          techniques: [],
          quantities: [],
          message: "",
          referenceImages: [],
        });
      } else {
        setStatus({ loading: false, error: data.message || "Something went wrong.", success: false });
      }
    } catch {
      setStatus({ loading: false, error: "Network error. Please try again.", success: false });
    }
  };

  return (
    <main className="w-full min-h-screen py-16 md:py-20 px-4 sm:px-6 bg-[#f5f0e8]" style={{ fontFamily: "var(--font-philosopher)" }}>
      {/* --- Header Section --- */}
      <section className="max-w-7xl mx-auto text-center mb-16 animate-fadeIn">
        <span className="text-[#1a1a2e] text-[20px] font-semibold block mb-4">
          Custom Request
        </span>
        <h1
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold leading-tight mb-8"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Let's create something beautiful together
        </h1>
        <div className="max-w-3xl mx-auto font-sans text-gray-700 leading-relaxed text-[15px] md:text-[16px] space-y-4">
          <p>
            Whether you have a fully developed concept or are exploring possibilities, we're here to help. Share your
            requirements below, and our team will respond within 24-48 hours with information, samples, or quotations to move
            your project forward.
          </p>
          <p className="text-[#bfa15f] font-semibold">
            All inquiries are treated confidentially. We respect your design concepts and business information.
          </p>
        </div>
      </section>

      {/* --- Form Section --- */}
      <section className="max-w-[1200px] mx-auto bg-[#FFF8EE] border border-[#e5dfd5] rounded-3xl shadow-sm overflow-hidden mb-16">
        {/* Form Header */}
        <div className="py-6 border-b border-[#e5dfd5] bg-white/50 text-center">
          <h2 className="text-[#1a1a2e] text-2xl font-bold" style={{ fontFamily: "var(--font-philosopher)" }}>
            Product Customization Form
          </h2>
        </div>

        {status.success ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6 animate-fadeIn font-sans">
            <div className="w-20 h-20 bg-[#bfa15f]/10 rounded-full flex items-center justify-center border border-[#bfa15f]/30">
              <svg className="w-10 h-10 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-[#1a1a2e] text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-philosopher)" }}>
                Custom Request Submitted!
              </h2>
              <p className="text-[15px] text-gray-700 max-w-lg mx-auto leading-relaxed">
                Thank you for your custom order inquiry. Our artisans and design team are reviewing your project specifications and will contact you via email or WhatsApp within 24 to 48 hours.
              </p>
            </div>
            <button
              onClick={() => setStatus({ loading: false, error: null, success: false })}
              className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] transition-all font-bold tracking-wider py-3.5 px-8 rounded-full text-[13px] uppercase cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e5dfd5]">
              
              {/* Column 1: Contact Info */}
              <div className="p-6 md:p-8 lg:p-10 space-y-6">
                <h3 className="text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
                  Contact Information
                </h3>
                <div className="space-y-5 font-sans">
                  {contactFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-[13px] text-gray-800 mb-2 font-medium">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={field.type || "text"}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={(e) => handleTextChange(field.key, e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-[13.5px] focus:border-[#bfa15f] focus:ring-2 focus:ring-[#bfa15f]/15 bg-white placeholder-gray-300 transition-all text-[#1a1a2e]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Project Details */}
              <div className="p-6 md:p-8 lg:p-10 space-y-8">
                <h3 className="text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
                  Project Specifications
                </h3>
                
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-4 font-sans">I'm interested in:</label>
                  <div className="space-y-3 font-sans">
                    {interests.map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(item)}
                          onChange={() => handleCheckboxChange("interests", item)}
                          className="w-5 h-5 rounded border-gray-300 text-[#1a1a2e] focus:ring-[#1a1a2e] cursor-pointer"
                        />
                        <span className="text-[14px] text-gray-700 group-hover:text-[#1a1a2e] transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-4 font-sans">Preferred Techniques:</label>
                  <div className="space-y-3 font-sans">
                    {techniques.map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.techniques.includes(item)}
                          onChange={() => handleCheckboxChange("techniques", item)}
                          className="w-5 h-5 rounded border-gray-300 text-[#1a1a2e] focus:ring-[#1a1a2e] cursor-pointer"
                        />
                        <span className="text-[14px] text-gray-700 group-hover:text-[#1a1a2e] transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Specification Details */}
              <div className="p-6 md:p-8 lg:p-10 space-y-6">
                <h3 className="text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
                  Specification & Notes
                </h3>
                
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-4 font-sans">Estimated Quantities:</label>
                  <div className="space-y-3 font-sans">
                    {quantities.map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.quantities.includes(item)}
                          onChange={() => handleCheckboxChange("quantities", item)}
                          className="w-5 h-5 rounded border-gray-300 text-[#1a1a2e] focus:ring-[#1a1a2e] cursor-pointer"
                        />
                        <span className="text-[14px] text-gray-700 group-hover:text-[#1a1a2e] transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13.5px] font-medium text-gray-800 mb-2 font-sans">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Describe size, materials, patterns, deadlines, or design guidelines..."
                    value={formData.message}
                    onChange={(e) => handleTextChange("message", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-[13.5px] focus:border-[#bfa15f] focus:ring-2 focus:ring-[#bfa15f]/15 bg-white h-40 resize-none font-sans text-[#1a1a2e]"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[13px] text-gray-800 mb-2 font-sans font-medium">Reference Images (Optional)</label>
                  <div className="relative font-sans">
                    <input
                      type="text"
                      readOnly
                      onClick={triggerUpload}
                      placeholder={uploadingFile ? "Uploading image..." : "Upload references (PNG, JPG, PDF)"}
                      className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 outline-none text-[13px] bg-white cursor-pointer placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={triggerUpload}
                      disabled={uploadingFile}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#bfa15f] disabled:opacity-50"
                    >
                      {uploadingFile ? (
                        <svg className="animate-spin h-5 w-5 text-[#bfa15f]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Image Previews */}
                  {formData.referenceImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2 font-sans">
                      {formData.referenceImages.map((imgUrl, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
                          {imgUrl.endsWith('.pdf') ? (
                            <div className="w-full h-full flex items-center justify-center bg-rose-50 text-[10px] font-bold text-rose-500">PDF</div>
                          ) : (
                            <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm hover:bg-rose-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {status.error && (
              <div className="mx-6 md:mx-10 p-4 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-700 font-sans">
                ⚠ {status.error}
              </div>
            )}

            {/* Form Footer / Submit Button */}
            <div className="py-8 border-t border-[#e5dfd5] bg-white/30 flex justify-center">
              <button
                type="submit"
                disabled={status.loading || uploadingFile}
                className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] active:scale-95 transition-all font-bold tracking-wider py-4 px-10 rounded-full text-[14px] md:text-[15px] uppercase cursor-pointer disabled:opacity-50"
              >
                {status.loading ? "Submitting Request..." : "Send Product Enquiry"} <span>→</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* --- Decorative Divider --- */}
      <div className="flex items-center py-6 justify-center gap-3 text-[#c4a882] select-none">
        <img src="/image/design/design1.png" alt="Decorative Divider" className="w-1/3 max-w-[200px]" />
      </div>

      {/* --- What Happens Next Section --- */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold text-center mb-16"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          What Happens Next?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[#e5dfd5]">
          {steps.map((step, idx) => (
            <div key={idx} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <h3 
                className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-4"
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {step.title}
              </h3>
              <p className="text-[14.5px] md:text-[16px] text-gray-700 leading-relaxed font-sans">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}