import { createClient } from "@/lib/supabase/server";
import BreakdownCard from '../cards/BreakdownCard'

const HOMEPAGE_LIMIT = 6;

export default async function BreakdownsShowcase() {
  const supabase = await createClient();

  const { data: breakdowns } = await supabase
    .from("breakdowns")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(HOMEPAGE_LIMIT);

  const items = breakdowns || [];

  // Hide the section if there are no videos
  if (!items.length) return null;

  return (
    <section
      id="breakdowns"
      className="scroll-mt-24 relative py-24 md:py-32 bg-[#080808] overflow-hidden"
    >
      {/* Background accent — red tint to match YouTube branding subtly */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
        {/* Header */}
        <div className="text-center md:text-left mb-12 md:mb-16">
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            Behind The Sound
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-white">
            Beat Breakdowns
          </h2>
          <p className="text-gray-400 max-w-xl">
            Watch the production process. From first idea to final mix.
          </p>
        </div>

        {/* Grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((breakdown) => (
            <BreakdownCard key={breakdown.id} breakdown={breakdown} />
          ))}
        </div>
      </div>
    </section>
  );
}