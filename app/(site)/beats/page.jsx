
import { createClient } from "@/lib/supabase/server";
import BeatsCatalogue from "./components/BeatsCatalogue";

export const metadata = {
  title: "Beats — Perlz",
  description:
    "Browse the full catalog of beats by Perlz. Afrobeats, UK Drill, Hip-Hop and more.",
};

export default async function BeatsCatalogPage() {
    const supabase = await createClient()

    const { data: beatsRaw }= await supabase
        .from("beats")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

     // Generate URLs for all beats
  const beats = (beatsRaw || []).map((beat) => {
    let artworkUrl = null;
    let audioUrl = null;

    if (beat.artwork_path) {
      const { data } = supabase.storage
        .from("beats-media")
        .getPublicUrl(beat.artwork_path);
      artworkUrl = data.publicUrl;
    }
    if (beat.preview_audio_path) {
      const { data } = supabase.storage
        .from("beats-media")
        .getPublicUrl(beat.preview_audio_path);
      audioUrl = data.publicUrl;
    }

    return { ...beat, artworkUrl, audioUrl };
  });

    // Build the unique genre list from the actual data — only show filter chips
    // for genres that have at least one beat. 
    const genres = Array.from(
        new Set(beats.map((b) => b.genre).filter(Boolean))
    ).sort();

    return (
        <main className="min-h-screen pt-32 pb-24 bg-midnight">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
                {/* Page header */}
                <div className="mb-12 md:mb-16 text-center md:text-left">
                  <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
                    The Catalog
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
                    All Beats
                </h1>
                <p className="text-gray-400 text-base md:text-lg max-w-xl">
                    {beats.length} {beats.length === 1 ? "beat" : "beats"} available.
                    Tap play to preview, then reach out to license.
                </p>  
                </div>
                {/* Empty state */}
                {beats.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-16 text-center">
                    <p className="text-gray-400">
                    No beats published yet. Check back soon.
                    </p>
                </div>
                ) : (
                <BeatsCatalogue beats={beats} genres={genres} />
                )}
            </div>
        </main>
    )
}