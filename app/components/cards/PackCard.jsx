
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink, buildEmailLink } from "@/lib/inquiry-link.js";
import AudioPreview from "../audio/AudioPreview";
import { Package, Mail, Download, HardDrive } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function PackCard({ pack }) {
  const whatsappLink = buildWhatsAppLink(pack.title, "pack");
  const emailLink = buildEmailLink(pack.title, "pack");

  const priceDisplay = pack.price_ngn
    ? `₦${pack.price_ngn.toLocaleString()}`
    : pack.price_usd
    ? `$${pack.price_usd}`
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
              : "border-white/5 hover:border-primary/30"
          }
        `}
      >
        {pack.is_featured && (
          <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-primary text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
            Featured
          </div>
        )}

        <div className="relative aspect-square sm:aspect-auto sm:w-44 sm:shrink-0 overflow-hidden bg-black">
          {pack.artworkUrl ? (
            <Image
              src={pack.artworkUrl}
              alt={`${pack.title} artwork`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 200px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-midnight-card to-[#0a0a0a]">
              <Package size={40} className="text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />

          {pack.audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <AudioPreview trackId={pack.id} audioUrl={pack.audioUrl} />
            </div>
          )}
        </div>

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
            <div className="flex flex-wrap gap-1.5 mb-4">
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
                className="size-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white transition-colors"
                aria-label={`Inquire about ${pack.title} on WhatsApp`}
              >
                <FaWhatsapp size={16} />
              </Link>
              <Link
                href={emailLink}
                className="size-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white transition-colors"
                aria-label={`Inquire about ${pack.title} via email`}
              >
                <Mail size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}