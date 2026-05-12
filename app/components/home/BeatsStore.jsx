
import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpRight } from "lucide-react";
import BeatCard from "../cards/BeatCard";

// const filters = ["All Beats", "Afrobeat", "Afro-fusion", "R&B", "Amapiano"];
const HOMEPAGE_LIMIT = 6;

export default async function BeatsStorefront() {
    const supabase = await createClient();

    const { data: beatsRaw, error } = await supabase
        .from("beats")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(HOMEPAGE_LIMIT);

        // Generate public URLs for both artwork and audio preview
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

       if (!beats.length) return null; 
    return (
        <section className="scroll-mt-24 py-24 relative bg-midnight overflow-hidden" id="beats">
            <div className="absolute inset-0 -z-10 pointer-events-none">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
            </div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center md:items-end md:flex-row justify-center md:justify-between mb-12 gap-8">
                    {/* Header + Filters */}
                    <div className="text-center md:text-left">
                        <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
                            License My Sound
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white tracking-tight">Featured Beats</h2>
                        <p className="text-gray-400 max-w-wl">
                        Hand-picked instrumentals. Tap play to preview, then reach out
                        to license.
                        </p>
                    </div>
                    <Link
                        href="/beats"
                        className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-colors w-fit mx-auto md:mx-0"
                    >
                        View All Beats
                        <ArrowUpRight size={16} />
                    </Link>
             </div>

            {/* Beats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {beats.map((beat) => (
                    <BeatCard key={beat.id} beat={beat} />
                ))}
            </div>

            {error && (
                <p className="mt-8 text-center text-red-400 text-sm">
                    Couldn't load beats right now. Try again later.
                </p>
                )}
            </div>
        </section>
    );
}

