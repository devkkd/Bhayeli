import Hero from "./components/Hero";
import Heritage from "./components/Heritage";
import Purpose from "./components/Purpose";
import WhyChoose from "./components/WhyChoose";
import Categories from "./components/Categories";
import OurProducts from "./components/OurProducts";
import OurProcess from "./components/OurProcess";
import InstagramFeed from "./components/InstagramFeed";
import LookingForward from "./components/LookingForward";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 bg-[#f5f0e8]">
      <Hero />
      <Heritage />
      <Purpose />
      <WhyChoose />
      <Categories />
      <OurProducts />
      <OurProcess />
      <InstagramFeed />
      <LookingForward />
    </main>
  );
}
