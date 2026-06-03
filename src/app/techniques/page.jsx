import Image from "next/image";
import LookingForward from "../components/LookingForward";

const techniquesData = [
  {
    title: "Block Print",
    subtitle: "The Art of Precision Repetition",
    description:
      "Block printing is among India's oldest textile decoration methods, dating back over 4,000 years. This technique uses hand-carved wooden blocks to apply patterns onto fabric, creating beautiful designs through careful alignment and repeated application. The rhythm of block printing dip, position, press is a meditative practice that our master printers have perfected over decades.",
    image: "/image/technique/technique1.png",
    buttonText: "See All Block Print Products",
    reverse: false,
  },
  {
    title: "Hand Printing",
    subtitle: "Ancient Mud-Resist Magic",
    description:
      "Dabu is a traditional Rajasthani mud-resist printing technique that creates distinctive, organic patterns with beautiful textural qualities. This eco-friendly process uses natural materials and produces results impossible to achieve through modern printing methods. The technique's name comes from the Hindi word 'dabana,' meaning 'to press.'",
    image: "/image/technique/technique2.png",
    buttonText: "See All Hand Printing Products",
    reverse: true,
  },
  {
    title: "Embroidery",
    subtitle: "The Poetry of White Thread",
    description:
      "Chikankari is the legendary embroidery tradition of Lucknow, characterized by delicate, intricate threadwork typically done in white on white, though contemporary interpretations explore colored threads on various base fabrics. The name comes from the Persian word 'Chikan,' meaning embroidery. This technique involves over 30 different stitches, each with its own name, purpose, and aesthetic effect.",
    image: "/image/technique/technique3.png",
    buttonText: "See All Embroidery Products",
    reverse: false,
  },
  {
    title: "Digital Print",
    subtitle: "Contemporary Precision, Unlimited Possibility",
    description:
      "Digital printing brings modern technology to our traditional textile workshop, offering capabilities that complement our handwork techniques. Using advanced digital printers, we can reproduce complex designs, photographic images, gradients, and unlimited color combinations with precision and speed.",
    image: "/image/technique/technique4.png",
    buttonText: "See All Digital Print Products",
    reverse: true,
  },
];

export default function TechniquePage() {
  return (
    <main className="w-full ">
      {/* --- Header Section --- */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto" style={{ fontFamily: "var(--font-philosopher)" }}>
        <div className=" mx-auto text-center">
          <span className="text-[#1a1a2e] text-lg md:text-xl font-bold block mb-4">Our Techniques</span>
          <h1 className="text-[#1a1a2e] text-3xl md:text-5xl font-bold leading-tight mb-10">
            Centuries-old crafts meet contemporary innovation
          </h1>
          
          <div className="mx-auto space-y-6">
            <h2 className="text-[#1a1a2e] text-xl md:text-2xl font-bold">
              The techniques we practice at Bhayeli represent both heritage and evolution
            </h2>
            <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed">
              While we honor traditional methods like block printing, Dabu, and Chikankari that connect us to centuries of Indian textile artistry, we also embrace contemporary technologies like digital printing and continually refine handwork techniques such as appliqué.
            </p>
            <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed">
              Each method requires specialized knowledge, dedicated practice, and deep understanding of materials. Together, they form a comprehensive toolkit that allows us to bring any creative vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* --- Techniques Grid --- */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
          {techniquesData.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${item.reverse ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text Content */}
              <div className="w-full md:w-1/2 space-y-6" style={{ fontFamily: "var(--font-philosopher)" }}>
                <h3 className="text-[#1a1a2e] text-xl md:text-2xl font-bold">{item.title}</h3>
                <h4 className="text-[#1a1a2e] text-2xl md:text-4xl font-bold leading-tight">
                  {item.subtitle}
                </h4>
                <p className="text-[14.5px] md:text-[18px] text-[#0E0E0E] leading-relaxed">
                  {item.description}
                </p>
                <button className="mt-4 px-8 py-3 bg-[#051124] text-white rounded-full flex items-center gap-2 hover:bg-[#0a1d3a] transition-all text-sm md:text-base">
                  {item.buttonText} <span>→</span>
                </button>
              </div>

              {/* Image Content */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decorative Divider */}
     
      <LookingForward />
    </main>

  );
}