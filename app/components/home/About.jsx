"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Globe2 } from "lucide-react";
import PerlzPortrait from "../../Assets/Perlz3.jpg";
import Link from "next/link";
import React from 'react'

const GENRES = ["Afrobeats", "Drill", "Hip-Hop", "RNB"];

const About = () => {
  return (
    <section id="about" className="scroll-mt-24 relative py-24 md:py-32 overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                 {/* LEFT: Portrait */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative group"
                >
                {/* Glow behind image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/40 to-blue-600/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />

                {/* Image frame */}
                <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                    {PerlzPortrait ? (
                        <Image
                            src={PerlzPortrait}
                            alt="Perlz"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 90vw, 450px"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-midnight-card to-[#0a0a0a] flex items-center justify-center">
                            <span className="text-8xl font-black text-white/5">P</span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent pointer-events-none" /> */}

                {/* Bottom-left credential chip */}
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
                        <Globe2 size={14} className="text-primary" />
                        <span className="text-xs text-white font-bold tracking-wider uppercase">
                            Based in Lagos
                        </span>
                    </div>    
                </div>
                </motion.div>

            {/* RIGHT: Bio */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className="flex flex-col"
            >
            {/* Eyebrow */}
            <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4">
              About Perlz
            </span>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-8 text-white">
              HIT-MAKING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary-dark">
                FROM LAGOS
              </span>
            </h2>

            {/* Bio copy */}
            <div className="space-y-5 text-gray-300 text-base md:text-lg leading-relaxed mb-8">
              <p>
                <span className="text-white font-bold">Perlz</span>, real name{" "}
                <span className="text-white font-bold">Oluwapelumi Oloyede</span>, is a Nigerian
                music producer and hit-maker crafting sounds that move between continents.
              </p>
              <p>
                Known for his signature blend of Afrobeats, UK tunes, and Hip-Hop vibes,
                he builds tracks that feel at home on Lagos speakers and London radio alike.
              </p>
            </div>

          {/* Genre pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {GENRES.map((genre) => (
                <span
                  key={genre}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white tracking-wide hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>  

            {/* Management credential callout */}
            <div className="flex items-center gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl mb-10">
                <div className="shrink-0 size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Sparkles size={22} className="text-primary" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Currently Managed By
                    </p>
                    <p className="text-white font-black text-lg leading-tight">
                        YHL Media Limited · UK
                    </p>
                </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4">
                <Link
                    href="#services"
                    className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-600 transition-colors"
                >
                    Work With Me
                </Link>
                <Link
                    href="#beats"
                    className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-white/5 text-white font-bold text-sm uppercase tracking-wider border border-white/10 hover:bg-white/10 transition-colors"
                >
                    Hear the Sound
                </Link>
            </div>
            </motion.div>
        </div>
        </div>
    </section>
  );
};

export default About