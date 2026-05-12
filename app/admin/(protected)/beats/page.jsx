import Link from "next/link";
import { Plus, Music2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BeatRow from "./_components/BeatRow";

export const metadata = {
  title: "Beats — Admin",
  robots: { index: false, follow: false },
};

export default async function BeatsListPage() {
    const supabase = await createClient();

    // Fetch all beats (admin sees published AND unpublished)
    const { data: beats, error } = await supabase
        .from("beats")
        .select("*")
        .order("created_at", { ascending: false }); 
        
    // Generate public URLs for the artwork files. 
    // We use supabase helper to build urls such as
    // "https://...supabase.co/storage/v1/object/public/beats-media/artwork/abc123.jpg"   
    const beatsWithUrls = (beats || []).map((beat) => {
        let publicUrl = null;
        if(beat.artwork_path){
           const { data } = supabase.storage
            .from("beats-media")
            .getPublicUrl(beat.artwork_path); 
            publicUrl = data.publicUrl;
        }
        return { ...beat, publicUrl}
    });

    return (
        <div className="max-w-5xl">
           {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                    Beats
                </h1>
                <p className="text-gray-400">
                    {beatsWithUrls.length}{" "}
                    {beatsWithUrls.length === 1 ? "beat" : "beats"} total
                </p>
                </div>

                <Link
                href="/admin/beats/new"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
                >
                <Plus size={16} />
                Upload Beat
                </Link>
            </div>

            {/* Error state */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-6">
                Failed to load beats: {error.message}
                </div>
            )}

            {/* Empty state */}
             {beatsWithUrls.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center">
                <div className="size-14 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                    <Music2 size={22} className="text-gray-400" />
                </div>
                <h3 className="text-white font-bold mb-2">No beats yet</h3>
                <p className="text-gray-500 text-sm mb-6">
                    Upload your first beat to get started.
                </p>
                <Link
                    href="/admin/beats/new"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
                >
                    <Plus size={16} />
                    Upload Your First Beat
                </Link>
                </div>
            ) : (
                // List of beats
                <div className="flex flex-col gap-3">
                {beatsWithUrls.map((beat) => (
                    <BeatRow key={beat.id} beat={beat} publicUrl={beat.publicUrl} />
                ))}
                </div>
            )}
        </div>
    )
}