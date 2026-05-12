
import { createClient } from "@/lib/supabase/server";
import { PackCard } from "../../components/home/Sample";

export const metadata = {
  title: "Sample Packs — Perlz",
  description:
    "Royalty-free drum kits, melody loops, and producer tools by Perlz.",
};

export default async function PacksCatalogPage() {
  const supabase = await createClient();

  const { data: packsRaw } = await supabase
    .from("packs")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const packs = (packsRaw || []).map((pack) => {
    let artworkUrl = null;
    let audioUrl = null;

    if (pack.artwork_path) {
      const { data } = supabase.storage
        .from("packs-media")
        .getPublicUrl(pack.artwork_path);
      artworkUrl = data.publicUrl;
    }
    if (pack.preview_audio_path) {
      const { data } = supabase.storage
        .from("packs-media")
        .getPublicUrl(pack.preview_audio_path);
      audioUrl = data.publicUrl;
    }

    return { ...pack, artworkUrl, audioUrl };
  });

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            Producer Kits
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            All Sample Packs
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl">
            {packs.length} {packs.length === 1 ? "pack" : "packs"} available.
            Royalty-free, license to your name.
          </p>
        </div>

        {packs.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-16 text-center">
            <p className="text-gray-400">
              No packs published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}