import React from 'react';

export default function ContactPage() {
  const contactFields = [
    { label: "Company Name", placeholder: "Enter Company Name" },
    { label: "Full Name", placeholder: "Enter Full Name" },
    { label: "Email Address", placeholder: "Enter Email Address" },
    { label: "Phone / WhatsApp Number", placeholder: "Enter Phone / WhatsApp Number" },
    { label: "Country", placeholder: "Enter Country" },
    { label: "Company Website (Optional)", placeholder: "Enter Company Website" },
  ];

  const inquiryTypes = [
    "Product Related",
    "Custom Order",
    "Feedback",
    "Complain",
  ];

  return (
    <main className="w-full min-h-screen py-16 md:py-20 px-4 sm:px-6"  style={{ fontFamily: "var(--font-philosopher)" }}>
      {/* --- Header Section --- */}
      <section className="max-w-7xl mx-auto text-center mb-16">
        <span 
          className="text-[#1a1a2e] text-[20px] font-semibold block mb-4" 
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Contact Us
        </span>
        
        <h1
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold  mb-8"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          We're here to help bring your vision to life
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E]  mb-2">
            Whether you're ready to place an order, have questions about our techniques, want to discuss a custom project, or
            are simply exploring options, we welcome your inquiry.
          </p>
          <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E]">
            Our team is responsive, knowledgeable, and committed to finding solutions that work for your business.
          </p>
        </div>
      </section>

      {/* --- Form Section --- */}
      <section className="max-w-[1100px] mx-auto bg-[#FFF8EE] rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Contact Information */}
          <div>
            <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a1a2e] mb-8">
              Contact Information
            </h3>
            
            <div className="space-y-6">
              {contactFields.map((field, idx) => (
                <div key={idx}>
                  <label className="block text-[13px] md:text-[14.5px] text-gray-800 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-[14.5px] focus:border-gray-400 bg-white placeholder-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Type & Message */}
          <div className="flex flex-col">
            <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a1a2e] mb-6">
              Type
            </h3>
            
            {/* Checkboxes / Radio buttons */}
            <div className="space-y-4 mb-8">
              {inquiryTypes.map((type, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="inquiryType"
                    className="w-[22px] h-[22px] rounded border-gray-200 text-[#051124] focus:ring-[#051124] bg-white cursor-pointer" 
                  />
                  <span className="text-[14.5px] text-gray-800">{type}</span>
                </label>
              ))}
            </div>

            {/* Message Textarea */}
            <h3 className="text-[14.5px] text-gray-800 mb-2">
              Message
            </h3>
            <textarea
              placeholder="Write your message..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-4 outline-none text-[14.5px] focus:border-gray-400 bg-white placeholder-gray-300 h-64 resize-none mb-8"
            ></textarea>

            {/* Submit Button */}
            <div>
              <button className="bg-[#051124] text-white px-10 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#0a1d3a] transition-all text-[15px]">
                Send <span className="ml-1">→</span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}