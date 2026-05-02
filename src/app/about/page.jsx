import ImageSliderStrip from "../components/ImageSliderStrip";
import TurningPoint from "../components/TurningPoint";
import OurPhilosophy from "../components/OurPhilosophy";

export default function AboutPage() {
  return (
    <main className="flex-grow bg-white px-6 py-12 md:py-20" style={{ fontFamily: "var(--font-philosopher)" }}>
      {/* Section: Hero Title */}
      <section className="max-w-7xl mx-auto text-center mb-24">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-800 mb-6" >
          About Bhayeli
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight ">
          Where tradition meets intention,
          Where luxury meets purpose
        </h1>
      </section>

      {/* Section: Our Story */}
      <section className="max-w-4xl mx-auto text-center space-y-12">
        <div>
          <h3 className="font-philosopher font-bold text-3xl  text-gray-800 mb-6">
            Our Story
          </h3>
          <h2 className="font-philosopher text-4xl md:text-5xl font-bold text-black mb-10">
            Born from Rural Rajasthan
          </h2>
        </div>

        {/* Content Paragraphs */}
        <div className="font-sans text-gray-700 text-lg leading-relaxed space-y-8 px-4">
          <p>
            We were born in rural Rajasthan—a land of heritage, craftsmanship, and resilience, 
            yet one where opportunity remains limited.
          </p>
          
          <p>
            For generations, work has drawn people away from their homes. Men travel to nearby 
            towns and cities, often living alone in rented rooms or commuting long hours each day. 
            Families remain divided, not by choice, but by necessity. Yet the most profound 
            burden is carried by women.
          </p>

          <p>
            Single mothers, in particular, face an impossible equation. Leaving their children 
            behind is not an option. Relocating to cities is financially unsustainable. 
            Education, housing, and the rising demands of urban life remain out of reach—despite 
            their capability, discipline, and will to work. This reality was not something we studied.
          </p>

          <p className="font-bold text-black text-xl pt-4">
            It was something we lived.
          </p>
        </div>
      </section>

      {/* Image Slider Strip */}
      <ImageSliderStrip />

      {/* Turning Point */}
      <TurningPoint />

      {/* Our Philosophy */}
      <OurPhilosophy />

    </main>
  );
}