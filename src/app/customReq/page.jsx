import React from 'react';

export default function CustomRequest() {
  // Data for the form to keep the JSX clean
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
    { label: "Company Name", placeholder: "Enter Company Name" },
    { label: "Full Name", placeholder: "Enter Full Name" },
    { label: "Email Address", placeholder: "Enter Email Address" },
    { label: "Phone / WhatsApp Number", placeholder: "Enter Phone / WhatsApp Number" },
    { label: "Country", placeholder: "Enter Country" },
    { label: "Company Website (Optional)", placeholder: "Enter Company Website" },
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

  return (
    <main className="w-full bg-[#FCF9F4] min-h-screen py-16 md:py-20 px-4 sm:px-6">
      {/* --- Header Section --- */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <span className="text-[#1a1a2e] text-[16px] font-semibold block mb-4" style={{ fontFamily: "var(--font-philosopher)" }}>
          Custom Request
        </span>
        <h1
          className="text-[#1a1a2e] text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Let's create something beautiful together
        </h1>
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed mb-4">
          Whether you have a fully developed concept or are exploring possibilities, we're here to help. Share your
          requirements below, and our team will respond within 24-48 hours with information, samples, or quotations to move
          your project forward.
        </p>
        <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed">
          All inquiries are treated confidentially. We respect your design concepts and business information.
        </p>
      </section>

      {/* --- Form Section --- */}
      <section className="max-w-[1200px] mx-auto bg-white/40 border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-24">
        {/* Form Header */}
        <div className="py-6 border-b border-gray-200 text-center">
          <h2 className="text-[#1a1a2e] text-2xl font-bold" style={{ fontFamily: "var(--font-philosopher)" }}>
            Product Enquiry Form
          </h2>
        </div>

        {/* Form Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* Column 1: Contact Info */}
          <div className="p-6 md:p-8 lg:p-10">
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-6">Contact Information</h3>
            <div className="space-y-5">
              {contactFields.map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm text-gray-800 mb-2">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-gray-400 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Project Details */}
          <div className="p-6 md:p-8 lg:p-10">
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-6">Project Details</h3>
            
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-800 mb-4">I'm interested in:</label>
              <div className="space-y-3">
                {interests.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-[#051124] focus:ring-[#051124]" />
                    <span className="text-[14.5px] text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">Preferred Techniques:</label>
              <div className="space-y-3">
                {techniques.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-[#051124] focus:ring-[#051124]" />
                    <span className="text-[14.5px] text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Specification Details */}
          <div className="p-6 md:p-8 lg:p-10">
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-6">Specification Details</h3>
            
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-800 mb-4">Estimated Quantity:</label>
              <div className="space-y-3">
                {quantities.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-[#051124] focus:ring-[#051124]" />
                    <span className="text-[14.5px] text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Product Description</label>
              <textarea
                placeholder="Please describe your requirements:"
                className="w-full border border-gray-200 rounded-xl px-4 py-4 outline-none text-sm focus:border-gray-400 bg-white h-48 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm text-gray-800 mb-2">Upload Reference Images (optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Upload Reference Images (optional)"
                  readOnly
                  className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 outline-none text-sm bg-white cursor-pointer"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer / Submit Button */}
        <div className="py-10 border-t border-gray-200 flex justify-center">
          <button className="bg-[#051124] text-white px-8 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#0a1d3a] transition-all text-sm md:text-base">
            Send Product Enquiry <span>→</span>
          </button>
        </div>
      </section>

      {/* --- Decorative Divider --- */}
      <div className="flex items-center justify-center mb-20 px-6">
        <img src="/image/design/design-1.png" alt="Decorative Divider" className="w-full max-w-lg opacity-80" />
      </div>

      {/* --- What Happens Next Section --- */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold text-center mb-16"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          What Happens Next?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-gray-200">
          {steps.map((step, idx) => (
            <div key={idx} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <h3 
                className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-4"
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {step.title}
              </h3>
              <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}