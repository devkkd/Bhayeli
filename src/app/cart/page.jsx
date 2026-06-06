"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";

const INQUIRY_TYPES = ["Product Related", "Custom Order", "Feedback", "Complain"];

const EMPTY_FORM = {
  companyName: "", fullName: "", email: "", phone: "",
  country: "", companyWebsite: "", inquiryType: "Product Related", message: "",
};

const inp = "w-full border border-[#e5dfd5] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10 bg-white text-[#1a1a2e] placeholder:text-gray-300 transition-all";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { setError("Please add at least one product to the cart."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        clearCart();
        setForm(EMPTY_FORM);
      } else {
        setError(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppInquiry = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Please add at least one product to the cart.");
      return;
    }
    if (!form.companyName || !form.fullName || !form.email || !form.phone || !form.country) {
      setError("Please fill out all required fields marked with * before sending via WhatsApp.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();

      if (data.success) {
        let msg = `Hi Bhayeli, I am interested in inquiring about the following products:\n\n`;
        items.forEach((item, idx) => {
          msg += `${idx + 1}. *${item.productTitle}* - Qty: ${item.quantity} (${item.moq || "MOQ: 50 pcs"})\n`;
        });

        msg += `\n*Inquiry Details:*\n`;
        msg += `- Name: ${form.fullName}\n`;
        msg += `- Company: ${form.companyName}\n`;
        msg += `- Email: ${form.email}\n`;
        msg += `- Phone: ${form.phone}\n`;
        msg += `- Country: ${form.country}\n`;
        if (form.companyWebsite) {
          msg += `- Website: ${form.companyWebsite}\n`;
        }
        msg += `- Inquiry Type: ${form.inquiryType}\n`;
        if (form.message) {
          msg += `- Message: ${form.message}\n`;
        }

        const waUrl = `https://wa.me/917792811100?text=${encodeURIComponent(msg)}`;

        clearCart();
        setForm(EMPTY_FORM);
        setSubmitted(true);

        window.open(waUrl, "_blank", "noopener,noreferrer");
      } else {
        setError(data.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickWhatsApp = () => {
    if (items.length === 0) {
      setError("Please add at least one product to the cart.");
      return;
    }

    let msg = `Hi Bhayeli, I would like to inquire about these products in my cart:\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productTitle}* - Qty: ${item.quantity} (${item.moq || "MOQ: 50 pcs"})\n`;
    });

    const waUrl = `https://wa.me/917792811100?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // ── Success Screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#fcfaf7]">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-3" style={{ fontFamily: "var(--font-philosopher)" }}>
            Inquiry Sent!
          </h1>
          <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
            Thank you for your inquiry. Our team will get back to you within 24–48 hours.
          </p>
          <Link href="/" className="inline-block bg-[#1a1a2e] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-black transition-colors">
            Continue Shopping →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <nav className="text-[11px] text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Link href="/" className="hover:text-[#1a1a2e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#1a1a2e]">Inquiry Cart</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
            Inquiry Cart
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} ready to inquire` : "Your cart is empty"}
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f5f0e8] flex items-center justify-center mb-5">
              <svg className="w-9 h-9 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "var(--font-philosopher)" }}>
              Your cart is empty
            </h2>
            <p className="text-[14px] text-gray-400 mb-7 max-w-xs">
              Browse our collections and add products you want to inquire about.
            </p>
            <Link href="/categories" className="bg-[#1a1a2e] text-white px-7 py-3 rounded-full text-[13px] font-semibold hover:bg-black transition-colors">
              Browse Collections →
            </Link>
          </div>
        )}

        {/* Main layout */}
        {items.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* ── LEFT: Cart Items ── */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-[#e5dfd5] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#e5dfd5] flex items-center justify-between">
                    <h2 className="text-[15px] font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
                      Selected Products
                    </h2>
                    <button type="button" onClick={clearCart} className="text-[11px] text-rose-400 hover:text-rose-600 font-medium transition-colors">
                      Clear all
                    </button>
                  </div>

                  <div className="divide-y divide-[#e5dfd5]/50">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-start gap-4 p-5">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-[#e5dfd5] shrink-0">
                          {item.productImage
                            ? <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gray-200" />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1a1a2e] line-clamp-2 leading-snug">{item.productTitle}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{item.moq}</p>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="text-[11px] text-gray-400 font-medium">Qty:</span>
                            <div className="flex items-center border border-[#e5dfd5] rounded-lg overflow-hidden">
                              <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-[14px] font-bold">−</button>
                              <span className="w-8 text-center text-[12px] font-semibold text-[#1a1a2e]">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-[14px] font-bold">+</button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button type="button" onClick={() => removeItem(item.productId)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-rose-500 text-gray-400 flex items-center justify-center transition-colors shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#e5dfd5] flex flex-col gap-2.5 items-center">
                    <p className="text-[12px] text-gray-400 text-center">
                      {items.length} product{items.length > 1 ? "s" : ""} · Bulk inquiry
                    </p>
                    <button
                      type="button"
                      onClick={handleQuickWhatsApp}
                      className="w-full sm:w-auto bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[11px] font-semibold hover:bg-[#1ebe5d] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Quick WhatsApp Inquiry
                    </button>
                  </div>
                </div>

                {/* Add more link */}
                <Link href="/collections" className="flex items-center gap-2 text-[13px] font-semibold text-[#1a1a2e] hover:text-[#bfa15f] transition-colors px-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add more products
                </Link>
              </div>

              {/* ── RIGHT: Inquiry Form ── */}
              <div className="lg:col-span-7">
                <div className="bg-[#FFF8EE] rounded-3xl border border-[#e5dfd5] p-6 sm:p-8 shadow-sm">

                  <h2 className="text-[15px] font-bold text-[#1a1a2e] mb-6" style={{ fontFamily: "var(--font-philosopher)" }}>
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Left column */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Company Name <span className="text-rose-400">*</span></label>
                        <input value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="Enter Company Name" className={inp} required />
                      </div>
                      <div>
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Full Name <span className="text-rose-400">*</span></label>
                        <input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Enter Full Name" className={inp} required />
                      </div>
                      <div>
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Email Address <span className="text-rose-400">*</span></label>
                        <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Enter Email Address" className={inp} required />
                      </div>
                      <div>
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Phone / WhatsApp Number <span className="text-rose-400">*</span></label>
                        <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Enter Phone / WhatsApp Number" className={inp} required />
                      </div>
                      <div>
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Country <span className="text-rose-400">*</span></label>
                        <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="Enter Country" className={inp} required />
                      </div>
                      <div>
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Company Website <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input value={form.companyWebsite} onChange={e => set("companyWebsite", e.target.value)} placeholder="Enter Company Website" className={inp} />
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-6">
                      {/* Inquiry Type */}
                      <div>
                        <h3 className="text-[13px] font-bold text-[#1a1a2e] mb-4">Type</h3>
                        <div className="space-y-3">
                          {INQUIRY_TYPES.map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${form.inquiryType === type
                                  ? "border-[#1a1a2e] bg-[#1a1a2e]"
                                  : "border-gray-300 group-hover:border-[#1a1a2e]/40"
                                }`}>
                                {form.inquiryType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <input type="radio" name="inquiryType" value={type} checked={form.inquiryType === type}
                                onChange={() => set("inquiryType", type)} className="sr-only" />
                              <span className="text-[14px] text-[#1a1a2e]">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex-1 flex flex-col">
                        <label className="block text-[13px] text-[#1a1a2e] font-medium mb-2">Message</label>
                        <textarea
                          value={form.message}
                          onChange={e => set("message", e.target.value)}
                          placeholder="Write your message..."
                          className={inp + " resize-none flex-1 min-h-[140px]"}
                        />
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="text-[12px] text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                          {error}
                        </p>
                      )}

                      {/* Submit */}
                      <div className="flex flex-wrap items-center gap-3">
                        <button type="submit" disabled={submitting}
                          className="bg-[#1a1a2e] text-white px-8 py-3.5 rounded-full text-[14px] font-semibold hover:bg-black transition-all flex items-center gap-2 w-fit disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                          {submitting ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>Send Inquiry →</>
                          )}
                        </button>

                        <button type="button" onClick={handleWhatsAppInquiry} disabled={submitting}
                          className="bg-[#25D366] text-white px-8 py-3.5 rounded-full text-[14px] font-semibold hover:bg-[#1ebe5d] transition-all flex items-center gap-2 w-fit disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm">
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Inquire via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
