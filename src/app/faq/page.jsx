"use client";

import React, { useState, useEffect } from 'react';

const faqData = [
  {
    id: "general-questions",
    category: "General Questions",
    items: [
      {
        q: "What is Bhayeli?",
        a: "Bhayeli is a Jaipur-based textile manufacturer specializing in traditional Indian printing and embroidery techniques including block print, Dabu print, Chikankari embroidery, digital print, and appliqué. We serve B2B clients worldwide with handcrafted fabrics for fashion, home textiles, and furnishing applications."
      },
      {
        q: "How long have you been in business?",
        a: "We have over 20 years of experience in handcrafted textile production, working with artisans who have inherited their skills through generations."
      },
      {
        q: "Do you work with international clients?",
        a: "Yes, we have extensive experience serving clients globally and handle international shipping, documentation, and communications routinely."
      },
      {
        q: "Where are you located?",
        a: "Our workshop and office are in Jaipur, Rajasthan, India—the cultural heart of Indian textile craftsmanship."
      }
    ]
  },
  {
    id: "products-techniques",
    category: "Products & Techniques",
    items: [
      {
        q: "What techniques do you specialize in?",
        a: "We specialize in block printing, Dabu printing (mud-resist dyeing), Chikankari embroidery, digital printing, and appliqué handwork. We can also combine techniques for unique, layered effects."
      },
      {
        q: "What is Dabu printing?",
        a: "Dabu is a traditional Rajasthani technique where mud paste is applied to fabric using blocks, creating a resist pattern. The fabric is then dyed, and the mud is washed away, revealing intricate designs with organic, textured qualities."
      },
      {
        q: "What is Chikankari?",
        a: "Chikankari is delicate embroidery from Lucknow featuring intricate threadwork, typically white-on-white, though we also work with colored threads. It involves over 30 specialized stitches creating shadow work, open jali patterns, and raised details."
      },
      {
        q: "Can you create custom designs?",
        a: "Absolutely. We excel at custom development. You can provide your own designs, work with our team to develop patterns, or modify existing designs to suit your needs."
      },
      {
        q: "What fabrics do you work with?",
        a: "We work with cotton (various weights), linen, silk, modal, rayon, and various blends. Fabric suitability depends on the technique being used."
      }
    ]
  },
  {
    id: "ordering-production",
    category: "Ordering & Production",
    items: [
      {
        q: "What are your minimum order quantities?",
        a: "MOQs vary by product type and technique. While we have minimums for production efficiency, we're flexible for the right projects. Contact us to discuss your specific needs."
      },
      {
        q: "Can I order samples first?",
        a: "Yes, we strongly encourage sampling. We can provide sample swatches or yardage for evaluation before you proceed with larger orders."
      },
      {
        q: "How long does production take?",
        a: "Sample production typically takes 2–4 weeks. Bulk production ranges from 6–10 weeks depending on order complexity, quantity, and technique involved."
      },
      {
        q: "How do I place an order?",
        a: "Submit an inquiry through our enquiry form or contact us directly. We'll discuss requirements, provide quotations, and arrange samples. Once approved, we formalize the order and begin production."
      },
      {
        q: "What are your payment terms?",
        a: "For new clients, we typically require advance payment. For larger orders, we accept Letters of Credit. Established partners may negotiate terms."
      }
    ]
  },
  {
    id: "customization",
    category: "Customization",
    items: [
      {
        q: "How much customization is possible?",
        a: "Extensive customization is available including colors (Pantone matching), pattern scale, fabric choices, design modifications, and finishing treatments."
      },
      {
        q: "Can you match specific colors?",
        a: "Yes, we can match Pantone references or physical samples. Color matching precision may vary slightly due to the handcrafted nature of our work."
      },
      {
        q: "Can you work from my designs?",
        a: "Yes, you can provide artwork, technical drawings, or reference materials, and we'll work with you to translate them into production specifications."
      },
      {
        q: "Do you offer exclusive designs?",
        a: "Yes, we can create exclusive designs reserved solely for your brand, typically discussed during custom development projects."
      }
    ]
  },
  {
    id: "quality-standards",
    category: "Quality & Standards",
    items: [
      {
        q: "How do you ensure quality?",
        a: "We have multi-stage quality control including raw material inspection, in-process checking, and final inspection before shipping. Our artisans are highly skilled, and we maintain strict standards throughout production."
      },
      {
        q: "Are there variations in handcrafted products?",
        a: "Yes, natural variations are inherent to handcrafted work and are considered signs of authenticity. However, we ensure all variations fall within acceptable quality standards."
      },
      {
        q: "Can you meet international quality standards?",
        a: "Yes, we're experienced in meeting various international quality requirements and can accommodate specific testing or certification needs."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general-questions");

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    faqData.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="w-full  min-h-screen py-16 md:py-24 px-4 sm:px-6"  style={{ fontFamily: "var(--font-philosopher)" }}>
      
      {/* --- Header Section --- */}
      <section className="max-w-6xl mx-auto text-center mb-16 md:mb-24">
        <span 
          className="text-[#1a1a2e] text-[20px] font-semibold block mb-4" 
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          FAQ's
        </span>
        <h1
          className="text-[#1a1a2e] text-3xl md:text-5xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Frequently Requested Information
        </h1>
        <h2 
          className="text-[#1a1a2e] text-xl md:text-2xl font-bold"
          style={{ fontFamily: "var(--font-philosopher)" }}
        >
          Quick answers to common questions
        </h2>
      </section>

      {/* --- Main Content Layout --- */}
      <section className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12 lg:gap-20 relative">
        
        {/* Left Column: Sidebar Navigation */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="md:sticky md:top-24 flex flex-col space-y-2">
            {faqData.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className={`text-left px-6 py-4 text-[16px] md:text-[17px] transition-colors duration-200 ${
                  activeCategory === category.id 
                    ? "bg-[#051124] text-white font-medium" 
                    : "text-[#0E0E0E] hover:bg-black/5"
                }`}
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {category.category}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: FAQ Content */}
        <div className="w-full md:w-2/3 lg:w-3/4 pb-20">
          {faqData.map((section) => (
            <div key={section.id} id={section.id} className="mb-16 md:mb-20 scroll-mt-28">
              
              <h3 
                className="text-[#1a1a2e] text-2xl md:text-3xl font-bold mb-8"
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {section.category}
              </h3>

              <div className="space-y-0">
                {section.items.map((item, idx) => (
                  // Added 'group' and 'cursor-default' or 'cursor-pointer' here
                  <div key={idx} className="group border-b border-gray-200 py-6 last:border-0 cursor-default">
                    
                    <div className="flex justify-between items-start gap-4">
                      <h4 
                        className="text-[#1a1a2e] text-[18px] md:text-[20px] font-bold"
                        style={{ fontFamily: "var(--font-philosopher)" }}
                      >
                        {item.q}
                      </h4>
                      {/* Arrow Icon rotates on hover */}
                      <span className="text-[#1a1a2e] text-xl font-bold flex-shrink-0 mt-1 transition-transform duration-300 group-hover:rotate-90">
                        →
                      </span>
                    </div>
                    
                    {/* Expandable Answer (CSS Grid transition trick) */}
                    <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      <div className="overflow-hidden">
                        {/* Added pt-4 to separate the answer from the question when opened */}
                        <p className="text-[14.5px] md:text-[16px] text-[#0E0E0E] pr-8 md:pr-12 pt-4">
                          {item.a}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}