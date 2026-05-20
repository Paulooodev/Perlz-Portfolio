import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { Play, Youtube, Clock } from "lucide-react";

const BreakdownsShowcase = ({ breakdown }) => {
    // YouTube hqdefault is 480x360 — good balance of quality and load speed
  const thumbnailUrl = `https://img.youtube.com/vi/${breakdown.youtube_video_id}/hqdefault.jpg`;
  return (
    <Link
      href={breakdown.youtube_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[#0a0a0a] border border-white/5 hover:border-primary/30 rounded-2xl overflow-hidden transition-colors"
    >
      {/* Thumbnail with play overlay */}
      <div className="relative aspect-video overflow-hidden bg-[#111]">
        <Image
          src={thumbnailUrl}
          alt={breakdown.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play button — red like YouTube */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play size={22} className="text-white fill-white ml-1" />
            </div>
        </div>

        {/* Duration badge, bottom-right */}
        {breakdown.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-bold text-white font-mono flex items-center gap-1">
               <Clock size={10} />
               {breakdown.duration}
            </div>
        )}
      </div>

     {/* Title + description + CTA */}
     <div className="p-5">
        <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight leading-tight mb-2 line-clamp-2">
          {breakdown.title}
        </h3>
        {breakdown.description && (
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
            {breakdown.description}
          </p>
        )} 

      <div className="flex items-center gap-2 text-xs font-bold text-red-500 group-hover:text-red-400 transition-colors">
         <Youtube size={14} />
            Watch on YouTube
      </div>    
    </div> 
    </Link>
  )
}

export default BreakdownsShowcase