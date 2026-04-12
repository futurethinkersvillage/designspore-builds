import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Businesses from "@/components/Businesses";
import ThisWeek from "@/components/ThisWeek";
import Projects from "@/components/Projects";
import Vlogs from "@/components/Vlogs";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl">
      <Hero />
      <Bio />
      <Businesses />
      <ThisWeek />
      <Projects />
      <Vlogs />
      <Contact />
    </main>
  );
}
