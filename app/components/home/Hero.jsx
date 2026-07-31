"use client";
import { React, useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle } from "lucide-react";
import StudioBG from "@/app/Assets/Perlz.jpg";
import trackImg1 from "@/app/Assets/suleja.jpg";
import trackImg2 from "@/app/Assets/buju.jpg";
import trackImg3 from "@/app/Assets/eternity.jpg";
import trackImg4 from "@/app/Assets/santa-maria.jpg";
import trackImg5 from "@/app/Assets/money.jpg";
import trackImg6 from "@/app/Assets/Motherland.jpeg";
import trackImg7 from "@/app/Assets/Blessings.jpeg";
import trackImg8 from "@/app/Assets/slt.jpg";
import { FaSpotify, FaSoundcloud, FaApple, FaDeezer } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";


const TRACKS = [
  {
    id: 1,
    title: "Suleja",
    artist: 'Tiimie',
    work: 'Production',
    img: trackImg1,
    spotifyUrl: "https://open.spotify.com/track/0MH18AYk87AIA7sJfOVoxY?si=3f30e450cc2e4d52",
  },
  {
    id: 2,
    title: "For here",
    artist: 'Bnxn',
    work: 'Production',
    img: trackImg2, 
    spotifyUrl: "https://open.spotify.com/track/5v1hQbjdXOgTIepMZ6c43g",
  },
  {
    id: 3,
    title: "Eternity",
    artist: 'Tiimie',
    work: 'Production',
    img: trackImg3, 
    spotifyUrl: "https://open.spotify.com/track/1M1r3ZTiSCsTo51g9mcHEm?si=80056b69661147a0",
  },
  {
    id: 4,
    title: "Santa Maria",
    artist: 'Tiimie',
    work: 'Mixing and Mastering',
    img: trackImg4, 
    spotifyUrl: "https://open.spotify.com/track/3jR9aQfVp1IAunp7yZ5Be9?si=35c3f41950494220",
  },
  {
    id: 5,
    title: "Money Convo",
    artist: 'Perlz & Hamydgrey',
    work: 'Production',
    img: trackImg5, 
    spotifyUrl: "https://open.spotify.com/album/1kLvhiKe0mcJnvumnE8VXC?si=M7VsJA8VR_SxaiRD9Yd-tg",
  },
  {
    id: 6,
    title: "Motherland Deep",
    artist: 'Tiimie',
    work: 'Production',
    img: trackImg6, 
    spotifyUrl: "https://open.spotify.com/track/5PXJVPczlfRH5k4u4lzlM0?si=fb1efe14ac264824",
  },
  {
    id: 7,
    title: "Blessings",
    artist: 'Poppill, Perlz & Hydiz',
    work: 'Production',
    img: trackImg7, 
    spotifyUrl: "https://open.spotify.com/track/36ESaPADvOcNypQMONsQEI?si=a1d988943b404d89",
  },
  {
    id: 8,
    title: "Sounds Like Tiimie",
    artist: 'Tiimie',
    work: 'Production (Track 1, 2, 3, 6, 7, & 8)',
    img: trackImg8, 
    spotifyUrl: "https://open.spotify.com/album/4Fkkz6CN0R6TcPiRHVpGmj?si=epUR-Q0eSFOOjrR8v2pLtA",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const barHeights = [4, 8, 6, 10, 5, 12, 8, 4, 6, 3, 7, 10, 5, 2];

  const nextTrack = () => setIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const currentTrack = TRACKS[index];
  useEffect(() => {
    const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % TRACKS.length);
    }, 5000)
    return () => clearInterval(timer);
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={StudioBG}
          alt="Studio Background"
          className="object-cover object-center"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/40 to-midnight" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-transparent to-transparent" />
      </div>

            <div className="relative z-10 max-w-7xl px-6 mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Content: Text and CTAs */}
                    <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1"
                    >

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                        CRAFTING <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary-dark">
                        THE FUTURE
                        </span>{" "}
                        <br className="hidden md:block" />
                        OF SOUND.
                    </h1>
                    <p className="text-gray-100 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                        Immersive soundscapes and chart-ready beats by Perlz. Elevate your sound with industry-standard production and mixing.
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                        <Link 
                            rel="noopener noreferrer" 
                            href="https://paa.ge/p3rlz/en?utm_source=ig&utm_m" 
                            target="_blank"
                        >
                        <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-16 px-8 rounded-2xl bg-primary text-white font-black flex items-center gap-3 shadow-[0_0_30px_rgba(13,89,242,0.3)] transition-shadow hover:shadow-[0_0_50px_rgba(13,89,242,0.5)]"
                        >
                        <FaSpotify size={20} />
                        <FaApple size={20} />
                        <FaSoundcloud size={20} />
                        <FaDeezer size={20} />
                        VIEW MY DSPs
                        </motion.button>
                        </Link>
                    </div>
                    </motion.div>

                {/* Right Content: Popular Carousel Track Card */}
                <div className="relative group w-full max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none"  />

                    <AnimatePresence mode="wait">
                        <motion.div
                        key={currentTrack.id}
                        initial={{ opacity: 0, x: 50, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -50, rotateY: -10 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset }) => {
                            if (offset.x > 100) prevTrack();
                            else if (offset.x < -100) nextTrack();
                        }}
                        className="relative cursor-grab active:cursor-grabbing bg-midnight-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >

                        {/* Main Card */}
                        {/* Fake Slider Header */}
                            <div className="px-6 py-4 border-b border-white/10 flex justify-between bg-white/5 items-center">
                                {/* Indicators */}
                                <h3 className="text-gray-400 text-sm tracking-widest uppercase">
                                    Popular Tracks
                                </h3>
                                <div className="flex gap-2">
                                    {TRACKS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`size-2 rounded-full transition-all duration-300 ${
                                        index === i ? "bg-primary" : "bg-white/20"
                                        }`}
                                    />
                                    ))}
                                </div>
                            </div>
                            {/* Image Wrapper */}
                            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
                                <div className="relative w-full lg:w-1/2 sm:w-1/2 aspect-square max-w-[240px] lg:max-w-none rounded-2xl overflow-hidden group/image shrink-0 shadow-lg">
                                    <Image
                                    src={currentTrack.img}
                                    alt={currentTrack.title}
                                    fill
                                    className="object-cover transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <PlayCircle className="text-white size-16 scale-75 group-hover/image:scale-100 transition-transform duration-300" />
                                    </div>
                                </div>

                            {/* Track Info */}
                            <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-left">
                                <h3 className="text-4xl font-black text-white mb-1 leading-tight uppercase tracking-tighter">
                                {currentTrack.title}
                                </h3>
                                <p className="text-gray-400 font-medium mb-8">
                                {currentTrack.artist} • {currentTrack.work}
                                </p>

                                {/* Animated Visualizer */}
                                <div className="flex items-end justify-center gap-1.5 h-12 mb-8 opacity-80">
                                {barHeights.map((h, i) => (
                                    <motion.div
                                    key={`${currentTrack.id}-${i}`}
                                    animate={{ height: [`${h * 2}px`, `${h * 4}px`, `${h * 2}px`] }}
                                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.07 }}
                                    className="w-1.5 bg-primary rounded-full"
                                    />
                                ))}
                                </div>

                                <Link 
                                href={currentTrack.spotifyUrl}
                                target="_blank"
                                className="w-full lg:w-auto flex h-14 px-8 items-center justify-center gap-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all uppercase text-sm tracking-wider"
                                >
                                <FaSpotify size={20} /> Listen Now
                                </Link>
                            </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                </div>

            </div>

    </section>

  );
};

export default Hero;