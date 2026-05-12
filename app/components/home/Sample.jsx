import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildWhatsAppLink, buildEmailLink } from "@/lib/inquiry-link";
import AudioPreview from "../audio/AudioPreview";
import { FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import { Package, Mail, ArrowUpRight, Download, HardDrive } from "lucide-react";

// const filters = ["All Beats", "Afrobeat", "Afro-fusion", "R&B", "Amapiano"];
const HOMEPAGE_LIMIT = 4;

export default async function SamplePacks() {
    const supabase = await createClient();

    const { data: packsRaw, error } = await supabase
        .from("packs")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(HOMEPAGE_LIMIT);

        // Generate public URLs for both artwork and audio preview
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

       if (!packs.length) return null; 
    return (
        <section className="scroll-mt-24 py-24 relative bg-midnight overflow-hidden" id="packs">
            <div className="absolute inset-0 -z-10 pointer-events-none">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
            </div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center md:items-end md:flex-row justify-center md:justify-between mb-12 gap-8">
                    {/* Header + Filters */}
                    <div className="text-center md:text-left">
                        <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
                            Producer Kits
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white tracking-tight">Sample Packs</h2>
                        <p className="text-gray-400 max-w-wl">
                          Royalty-free drum kits, melody loops, and production tools.
                        </p>
                    </div>
                    <Link
                        href="/packs"
                        className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-colors w-fit mx-auto md:mx-0"
                    >
                        View All Packs
                        <ArrowUpRight size={16} />
                    </Link>
             </div>

            {/* Packs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {packs.map((pack) => (
                    <PackCard key={pack.id} pack={pack} />
                ))}
            </div>

            {error && (
                <p className="mt-8 text-center text-red-400 text-sm">
                    Couldn't load packs right now. Try again later.
                </p>
                )}
            </div>
        </section>
    );
}


export function PackCard({ pack }){
    const whatsappLink = buildWhatsAppLink(pack.title, "pack");
    const emailLink = buildEmailLink(pack.title, "pack");

    const priceDisplay = pack.price_from_ngn
        ? `From ₦${pack.price_from_ngn.toLocaleString()}`
        : pack.price_from_usd
        ? `From $${pack.price_from_usd}`
        : "Inquire";

        return (
              <div className="group relative">
                {pack.is_featured && (
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-primary to-blue-600 rounded-2xl opacity-30 group-hover:opacity-60 blur-sm transition-opacity duration-500 pointer-events-none" />
                )}

                <div
                  className={`
                      relative h-full flex flex-col sm:flex-row bg-[#0a0a0a] rounded-2xl border overflow-hidden transition-colors
                      ${
                        pack.is_featured
                          ? "border-primary/30"
                          : "border-white/5 hover:border-orinary/30"
                      }
                    `}
                >
                  {pack.is_featured && (
                    <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-primary text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
                      Featured
                    </div>
                  )}

                  {/* Artwork with play button overlay */}
                  <div className="relative aspect-square sm:aspect-auto sm:w-44 sm:shrink-0 overflow-hidden bg-black">
                    {pack.artworkUrl ? (
                      <Image
                          src={pack.artworkUrl}
                          alt={`${pack.title} artwork`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-midnight-card to-[#0a0a0a]">
                          <Package size={40} className="text-white/10" />
                      </div>        
                    )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Audio preview play button — centered over artwork */}
                  {pack.audioUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <AudioPreview
                          trackId={pack.id}
                          audioUrl={pack.audioUrl}
                          />
                      </div>
                  )}   
                </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-5 sm:p-6">
                  <div className="mb-3">
                      {pack.subtitle && (
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                          {pack.subtitle}
                        </p>
                      )}
                      <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-tight">
                        {pack.title}
                      </h3>
                  </div>

                  {pack.description && (
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                      {pack.description}
                    </p>
                  )}

                {(pack.sample_count || pack.file_size) && (
                  <div className="flex flex-wrap gap-3 mb-3 text-xs font-mono">
                    {pack.sample_count && (
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Download size={11} className="text-primary" />
                        <span className="text-white font-bold">
                          {pack.sample_count}
                        </span>
                        <span className="text-gray-600">samples</span>
                      </span>
                    )}
                    {pack.file_size && (
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <HardDrive size={11} className="text-primary" />
                        <span className="text-white font-bold">{pack.file_size}</span>
                      </span>
                    )}
                  </div>
                )}

                {pack.tags && pack.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 5 mb-4">
                    {pack.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-gray-300 uppercase tracking-wider"
                      >
                      {tag}
                    </span>
                    ))}
                  </div>
                )}

                  <div className="flex-1" />

                  <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {priceDisplay}
                    </div>
                  <div className="flex gap-1.5">
                    <Link
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Inquire about ${pack.title} on WhatsApp`}
                        className="flex items-center justify-center gap-2 py-3.5 text-xs font-black uppercase tracking-wider text-white bg-white/[0.02] hover:bg-primary transition-colors border-r border-white/5"
                    >
                      <FaWhatsapp size={16} /> 
                    </Link>
                    <Link
                        href={emailLink}
                        aria-label={`Inquire about ${pack.title} via email`}
                        className="flex items-center justify-center gap-2 py-3.5 text-xs font-black uppercase tracking-wider text-white bg-white/[0.02] hover:bg-primary transition-colors"
                    >
                      <Mail size={16} />
                    </Link>   
                  </div> 
                </div>
               </div>
              </div>
            </div>
        )
}