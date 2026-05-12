
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink, buildEmailLink } from "@/lib/inquiry-link.js";
import AudioPreview from "../audio/AudioPreview";
import { Music2, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function BeatCard({ beat }) {
  const whatsappLink = buildWhatsAppLink(beat.title, "beat");
  const emailLink = buildEmailLink(beat.title, "beat");

  const priceDisplay = beat.price_from_ngn
    ? `From ₦${beat.price_from_ngn.toLocaleString()}`
    : beat.price_from_usd
    ? `From $${beat.price_from_usd}`
    : "Inquire";

  return (
    <div className="group bg-[#0a0a0a] border border-white/5 hover:border-primary/30 rounded-2xl overflow-hidden transition-colors flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        {beat.artworkUrl ? (
          <Image
            src={beat.artworkUrl}
            alt={`${beat.title} artwork`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-midnight-card to-[#0a0a0a]">
            <Music2 size={48} className="text-white/10" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {beat.genre && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
            {beat.genre}
          </span>
        )}

        {beat.audioUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <AudioPreview trackId={beat.id} audioUrl={beat.audioUrl} />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-tight">
            {beat.title}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 text-xs font-mono">
        <div className="flex items-center gap-2">
          {beat.bpm && (
            <span className="text-gray-400">
              <span className="text-gray-600">BPM</span>{" "}
              <span className="text-white font-bold">{beat.bpm}</span>
            </span>
          )}
          {beat.bpm && beat.musical_key && (
            <span className="text-gray-700">·</span>
          )}
          {beat.musical_key && (
            <span className="text-gray-400">
              <span className="text-gray-600">KEY</span>{" "}
              <span className="text-white font-bold">{beat.musical_key}</span>
            </span>
          )}
        </div>
        <span className="text-gray-400 text-[11px] whitespace-nowrap">
          {priceDisplay}
        </span>
      </div>

      <div className="grid grid-cols-2 border-t border-white/5">
        <Link
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3.5 text-xs font-black uppercase tracking-wider text-white bg-white/[0.02] hover:bg-primary transition-colors border-r border-white/5"
        >
          <FaWhatsapp size={14} />
          WhatsApp
        </Link>
        <Link
          href={emailLink}
          className="flex items-center justify-center gap-2 py-3.5 text-xs font-black uppercase tracking-wider text-white bg-white/[0.02] hover:bg-primary transition-colors"
        >
          <Mail size={14} />
          Email
        </Link>
      </div>
    </div>
  );
}