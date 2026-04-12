import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Businesses from "@/components/Businesses";
import Speaking from "@/components/Speaking";
import ThisWeek from "@/components/ThisWeek";
import Projects from "@/components/Projects";
import Vlogs from "@/components/Vlogs";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-6xl">
        <Hero />
        <Bio />
        <Businesses />
      </div>
      <Speaking />
      <div className="mx-auto max-w-6xl">
        <ThisWeek />
        <Projects />
        <Vlogs />
        <Contact />
      </div>
    </main>
  );
}
