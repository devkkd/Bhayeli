import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f0e8]">

      {/* Logo centered top */}
      <div className="flex justify-center pt-10 pb-8">
        <Link
          href="/"
          className="w-[68px] h-[68px] rounded-full bg-[#1a1a2e] flex items-center justify-center shadow-lg ring-4 shrink-0"
        >
          <img src="/image/logo.png" alt="bhayeli" className="w-full h-full object-cover rounded-full" />
        </Link>
      </div>

      {/* Divider */}
    

      {/* Main footer grid */}
      <div className="max-w-8xl mx-auto px-6 md:px-12 lg:px-20 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">

        {/* About Bhayeli */}
        <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-3">
          <h4 className="text-[#1a1a2e] text-[14px] font-bold">About Bhayeli</h4>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            BHAYELI provides home textiles & decor items, handbags, cosmetic bags & makeup pouch with global contemporary aesthetics rooted.
          </p>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            BHAYELI is all about pure design made with uncompromised craftsmanship. Since the establishment of its business in 2020, BHAYELI has focused on its key strengths – design, innovation, exquisite detailing and quality workmanship.
          </p>
          <Link
            href="/about"
            className="mt-2 inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white text-[12px] font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-colors w-fit"
          >
            Read About us →
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[#1a1a2e] text-[14px] font-bold">Quick Links</h4>
          <ul className="flex flex-col gap-2">
            {["About Us", "Custom Request", "FAQ's", "Contact Us", "Privacy Policy"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[12px] text-gray-500 hover:text-[#1a1a2e] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Techniques */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[#1a1a2e] text-[14px] font-bold">Techniques</h4>
          <ul className="flex flex-col gap-2">
            {["Block Print", "Dabu Print", "Hand Embroidery", "Hand Print"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[12px] text-gray-500 hover:text-[#1a1a2e] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[#1a1a2e] text-[14px] font-bold">Collections</h4>
          <ul className="flex flex-col gap-2">
            {["Hand Embroidered", "Nightwear", "Jacket", "Makeup Bags", "Kimono Robe", "Tote Bags"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[12px] text-gray-500 hover:text-[#1a1a2e] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Follow */}
        <div className="flex flex-col gap-6">
          {/* Contact Us */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[#1a1a2e] text-[14px] font-bold">Contact Us</h4>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Reach out to us Mon - Sat<br />(10 AM - 7 PM)
            </p>
            {/* <a href="tel:+911234567890" className="text-[12px] text-gray-500 hover:text-[#1a1a2e] transition-colors">
              +91 12345 67890
            </a> */}
            <div>
              <p className="text-[12px] text-gray-500">Email Us at</p>
              <a href="mailto:monika@bhayeli.com" className="text-[12px] text-gray-500 hover:text-[#1a1a2e] transition-colors">
                monika@bhayeli.com
              </a>
            </div>
          </div>

        
        </div>
  {/* Follow Us */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[#1a1a2e] text-[14px] font-bold">Follow Us</h4>
            <ul className="flex flex-col gap-2">
              {[
                {
                  label: "@bhayeli.jaipur",
                  href: "https://instagram.com/bhayeli.jaipur",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <radialGradient id="ig2" cx="30%" cy="107%" r="150%">
                          <stop offset="0%" stopColor="#fdf497"/>
                          <stop offset="45%" stopColor="#fd5949"/>
                          <stop offset="60%" stopColor="#d6249f"/>
                          <stop offset="90%" stopColor="#285AEB"/>
                        </radialGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig2)"/>
                      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
                    </svg>
                  ),
                },
                {
                  label: "@bhayeli.jaipur",
                  href: "#",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  label: "@bhayeli.jaipur",
                  href: "#",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF0000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  ),
                },
                {
                  label: "@bhayeli.jaipur",
                  href: "#",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#E60023">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                    </svg>
                  ),
                },
              ].map((social, i) => (
                <li key={i}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-[#1a1a2e] transition-colors"
                  >
                    {social.icon}
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
      </div>
  {/* <div className="border-t border-gray-300 mx-6 md:mx-12 lg:mx-20" /> */}
      {/* Copyright bar */}
      <div className="border-t border-gray-300 mx-6 md:mx-12 lg:mx-20" />
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[12px] text-gray-400">Copyright © 2026 Bhayeli.</p>
        <p className="text-[12px] text-gray-400">Crafted by : Kontent Kraft Digital</p>
      </div>

      {/* Jaipur skyline illustration */}
      <div className="w-full overflow-hidden">
        <img
          src="/image/footer.png"
          alt="Jaipur Skyline"
          className="w-full object-cover object-top"
        />
      </div>

    </footer>
  );
}
