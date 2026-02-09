"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, PlusCircle, ShoppingBag } from "lucide-react";

const filters = ["All Packs", "Drums", "Loops", "Vocals", "FX", "One-Shots"];

const samplePacks = [
  {
    title: "Neon Drums Vol.1",
    sounds: "150+",
    type: "Drum Kit",
    price: "19.99",
    cover: "https://images.stockcake.com/public/7/6/1/7615b745-7720-48a7-b548-e7c0ed0d20d4/holographic-rhythm-machine-stockcake.jpg",
  },
  {
    title: "Cyberwave Loops",
    sounds: "80+",
    type: "Melody Loops",
    price: "24.99",
    cover: "https://images.stockcake.com/public/8/7/0/870df616-9503-475b-a143-311e335ad7d5/neon-drum-waves-stockcake.jpg",
  },
  {
    title: "Vocal Chops Pro",
    sounds: "120+",
    type: "Vocal Pack",
    price: "29.99",
    cover: "https://blog.landr.com/wp-content/uploads/2021/02/Elemental-Sound-Synthwave-Drums-1.jpg",
  },
  {
    title: "Holographic FX",
    sounds: "200+",
    type: "Sound Effects",
    price: "14.99",
    cover: "https://thumbs.dreamstime.com/z/surreal-d-music-background-featuring-floating-neon-drum-set-abstract-sound-waves-rippling-outward-each-hit-dynamic-364232300.jpg",
  },
  // Add more — or replace with Supabase fetch later
];

const  SamplePacksSection = () => {
  return (
    <section className="py-24 relative" id="samples">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header + Filters (Mobile-optimized from previous fix) */}
        <div className="flex flex-col items-center md:items-end md:flex-row justify-center md:justify-between mb-12 gap-8">
          <div className="text-center md:text-left max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Sample Packs
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              Premium royalty-free sounds, loops, and one-shots. Instant download for your next hit.
            </p>
          </div>

          <div className="w-full md:w-auto flex overflow-x-auto gap-2 pb-2 scrollbar-hide justify-center md:justify-end">
            {filters.map((filter, i) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-midnight-card border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {samplePacks.map((pack, index) => (
            <motion.div
              key={pack.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-midnight-card rounded-lg p-4 border border-white/5 hover:border-primary/50 transition-all group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="relative aspect-square rounded overflow-hidden mb-4">
                <Image
                  src={pack.cover}
                  alt={`${pack.title} cover art`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary border border-primary/20">
                  ${pack.price}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play size={28} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg leading-tight truncate">{pack.title}</h3>
                <button className="text-gray-500 hover:text-primary transition-colors">
                  <PlusCircle size={24} />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  {pack.sounds} Sounds
                </span>
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  {pack.type}
                </span>
              </div>

              <button className="w-full py-2 bg-white/5 hover:bg-primary text-white text-sm font-bold rounded transition-colors flex items-center justify-center gap-2 group-hover:bg-primary">
                <ShoppingBag size={18} />
                Buy Pack
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="px-8 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all">
            View All Packs
          </button>
        </div>
      </div>
    </section>
  );
}

export default SamplePacksSection