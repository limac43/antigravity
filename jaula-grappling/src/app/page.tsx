import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Modalities from "@/components/Modalities";
import Schedule from "@/components/Schedule";
import CTA from "@/components/CTA";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Modalities />
        <Schedule />
        <CTA />
        <Location />
      </main>
      <Footer />
    </>
  );
}
