"use client";
import React from 'react'
import { useState, useMemo } from 'react';
import BeatCard from '../../../components/cards/BeatCard';
const BeatsCatalogue = ({beats, genres}) => {
    const [activeGenre, setActiveGenre] = useState("All");

    // Filter beats based on active genre.
    // Memorize so we don't re-filter on every re-render unless beats or activeGenre actually changed.
    const filteredBeats = useMemo(() => {
        if(activeGenre === "All") return beats;
        return beats.filter((b) => b.genre === activeGenre)
    }, [beats, activeGenre]);

  return (
    <>
    <div className="flex flex-wrap gap-2 mb-8 md:mb-10"> 
        <FilterChip
            label="All"
            isActive={activeGenre === "All" }
            onClick={() => setActiveGenre("All")}
            count={beats.length}
        />
        {genres.map((genre) => {
            const count = beats.filter((b) => b.genre === genre).length;
            return (
                <FilterChip
                    key={genre}
                    label={genre}
                    isActive={activeGenre === genre }
                    onClick={() => setActiveGenre(genre)}
                    count={count}
                />
            )
        })}
    </div>

    {/* Filtered grid */}
    {filteredBeats.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">
            No {activeGenre.toLowerCase()} beats yet.
        </div>
    ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {filteredBeats.map((beat) => (
           <BeatCard key={beat.id} beat={beat} /> 
        ))}
       </div> 
    )}
    </>
  )
}

export default BeatsCatalogue

// FilterChip - reusable filter button

function FilterChip({ label, isActive, onClick, count}) {
    return (
        <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors
        ${
          isActive
            ? "bg-primary text-white border border-primary"
            : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
        }
      `}
    >
        {label}
     <span
        className={`
          text-[10px] font-mono px-1.5 py-0.5 rounded
          ${isActive ? "bg-white/20" : "bg-white/5"}
        `}
      >
        {count}
    </span>   
    </button>
    )
}