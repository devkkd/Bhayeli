"use client";
import React, { useState } from 'react';

export default function ContactPage() {
  const contactFields = [
    { key: "companyName", label: "Company Name", placeholder: "Enter Company Name", required: false },
    { key: "fullName", label: "Full Name", placeholder: "Enter Full Name", required: true },
    { key: "email", label: "Email Address", placeholder: "Enter Email Address", type: "email", required: true },
    { key: "phone", label: "Phone / WhatsApp Number", placeholder: "Enter Phone / WhatsApp Number", required: true },
    { key: "country", label: "Country", placeholder: "Enter Country", required: true },
    { key: "companyWebsite", label: "Company Website (Optional)", placeholder: "Enter Company Website", required: false },
  ];

  const inquiryTypes = [
    "Product Related",
    "Custom Order",
    "Feedback",
    "Complain",
  ];

  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    companyWebsite: "",
    inquiryType: "Product Related",
    message: "",
  });

  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (status.error) setStatus((prev) => ({ ...prev, error: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.fullName.trim()) return setStatus({ loading: false, error: "Full Name is required.", success: false });
    if (!formData.email.trim()) return setStatus({ loading: false, error: "Email is required.", success: false });
    if (!formData.phone.trim()) return setStatus({ loading: false, error: "Phone number is required.", success: false });
    if (!formData.country.trim()) return setStatus({ loading: false, error: "Country is required.", success: false });
    if (!formData.message.trim()) return setStatus({ loading: false, error: "Message is required.", success: false });

    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          inquiryType: "Product Related",
          message: "",
        });
      } else {
        setStatus({ loading: false, error: data.message || "Something went wrong. Please try again.", success: false });
      }
    } catch (err) {
      setStatus({ loading: false, error: "Network error. Please check your connection and try again.", success: false });
    }
  };

  return (
    <main className="w-full min-h-screen py-16 md:py-20 px-4 sm:px-6 bg-[#f5f0e8]" style={{ fontFamily: "var(--font-philosopher)" }}>
      {/* --- Header Section --- */}
      <section className="max-w-7xl mx-auto text-center mb-16">
        <span 
          className="text-[#1a1a2e] text-[20px] font-semibold block mb-4" 
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Contact Us
        </span>
        
        <h1
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold mb-8"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          We're here to help bring your vision to life
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] mb-2 font-sans">
            Whether you're ready to place an order, have questions about our techniques, want to discuss a custom project, or
            are simply exploring options, we welcome your inquiry.
          </p>
          <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] font-sans">
            Our team is responsive, knowledgeable, and committed to finding solutions that work for your business.
          </p>
        </div>
      </section>

      {/* --- Form Section --- */}
      <section className="max-w-[1100px] mx-auto bg-[#FFF8EE] rounded-[2rem] p-8 md:p-12 lg:p-16 border border-[#e5dfd5] shadow-sm transition-all duration-300">
        {status.success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-[#bfa15f]/10 rounded-full flex items-center justify-center border border-[#bfa15f]/30">
              <svg className="w-10 h-10 text-[#bfa15f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-[#1a1a2e] text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-philosopher)" }}>
                Thank You!
              </h2>
              <p className="text-[15px] text-gray-700 max-w-lg mx-auto font-sans leading-relaxed">
                Your message has been sent successfully. Our support team has received your details and will get in touch with you at the earliest.
              </p>
            </div>
            <button
              onClick={() => setStatus({ loading: false, error: null, success: false })}
              className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] transition-all font-bold tracking-wider py-3.5 px-8 rounded-full text-[13px] uppercase"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left Column: Contact Information */}
            <div>
              <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a1a2e] mb-8" style={{ fontFamily: "var(--font-philosopher)" }}>
                Contact Information
              </h3>
              
              <div className="space-y-6 font-sans">
                {contactFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[13px] md:text-[14.5px] text-gray-800 mb-2 font-medium">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type || "text"}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-[14.5px] focus:border-[#bfa15f] focus:ring-2 focus:ring-[#bfa15f]/15 bg-white placeholder-gray-300 transition-all text-[#1a1a2e]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Type & Message */}
            <div className="flex flex-col">
              <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a1a2e] mb-6" style={{ fontFamily: "var(--font-philosopher)" }}>
                Inquiry Type
              </h3>
              
              {/* Checkboxes / Radio buttons */}
              <div className="space-y-4 mb-8 font-sans">
                {inquiryTypes.map((type, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="inquiryType"
                      value={type}
                      checked={formData.inquiryType === type}
                      onChange={() => handleChange("inquiryType", type)}
                      className="w-[20px] h-[20px] rounded-full border-gray-300 text-[#1a1a2e] focus:ring-[#1a1a2e] bg-white cursor-pointer" 
                    />
                    <span className="text-[14.5px] text-gray-700 group-hover:text-[#1a1a2e] transition-colors">{type}</span>
                  </label>
                ))}
              </div>

              {/* Message Textarea */}
              <label className="block text-[13px] md:text-[14.5px] text-gray-800 mb-2 font-medium font-sans">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write your message..."
                required
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-4 outline-none text-[14.5px] focus:border-[#bfa15f] focus:ring-2 focus:ring-[#bfa15f]/15 bg-white placeholder-gray-300 h-56 resize-none mb-6 text-[#1a1a2e] transition-all font-sans"
              ></textarea>

              {/* Feedback Message */}
              {status.error && (
                <div className="mb-6 p-4 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-700 font-sans">
                  ⚠ {status.error}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={status.loading}
                  className="bg-[#1a1a2e] text-white px-10 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#bfa15f] active:scale-95 transition-all text-[14px] font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {status.loading ? "Sending..." : "Send Message"} <span className="ml-1">→</span>
                </button>
              </div>
            </div>

          </form>
        )}
      </section>
    </main>
  );
}