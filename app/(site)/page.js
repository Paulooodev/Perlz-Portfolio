import Hero from "@/app/components/home/Hero";
import Stats from "@/app/components/home/Stats";
import About from "@/app/components/home/About";
import Services from "@/app/components/home/Services";
import Sample from "@/app/components/home/Sample";
import BreakdownsShowcase from "../components/home/BreakdownsShowcase";
import BeatsStore from "@/app/components/home/BeatsStore";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Services />
      <Sample />
      <BreakdownsShowcase />
      <BeatsStore />
    </>
  );
}