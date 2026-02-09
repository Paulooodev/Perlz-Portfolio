"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, PlusCircle, ShoppingBag } from "lucide-react";

const filters = ["All Beats", "Afrobeat", "Afro-fusion", "R&B", "Amapiano"];

const beats = [
    {
    title: "Find U",
    bpm: 140,
    key: "C Min",
    price: "29.99",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqVIXlSKG7zmp28_erh5MYe69UoZymq7XA7RkxyYlynyAnHZj9MHXUs6WMj4uAujvv7vE6bApLKm-HkCLyx2Rl3X2EyVzFXOlNKxk0lWDj6OMTkt8ezAaPjIBcYeW50999qGXdRYh2thNBTyNd5sm-RXl41pmv1qYXVBK4l62lHQ06YrSyPSredopjFIgbHvfUluCYXgzGGwesHN8p5yWU1tvhapEs4HWapN6q2vn6Bv6vl2q4ofTvFHweV3iJ662M7HTdWqav6oU",
  },
  {
    title: "Humor",
    bpm: 130,
    key: "G Maj",
    price: "29.99",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6ZkqI37hK2YO73C3s5wu5wYcdBwLGIL5JF-tUHC4-VomfiZiG6oJ0e-bfCmg495Bt-XZS36lmdReD85RvegnHl6qPdzv4-o5tAzKKPjT1DPSPhDHY-lsvTToueA_lHbA5Dg2P94wnY7en9ihWmEvOBodTwvG4TjiW3FtgiNUUnmbTjY7_CcfqBHd30fTRMseNlQm4ZqqNHCzDKbxKfdKpNUd1HgFBACPX_K4BiLc0SxQX9JT3je-DkF-MqNQt7PKN4P7xIf-ATqU",
  },
  {
    title: "Lovina",
    bpm: 90,
    key: "F# Min",
    price: "29.99",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDH8Zh2MEizVQfSj8QePpBCFRDI8CzDaDVDlM2kWWppln_mBxtcAqms9wP4WNalXXN3DJmM2m2w-3JPSk0alayPMP8DRuJPkUouce6GDbIPihrTMtKZgFOkLOL42mk3iMQAf5T-XyhX7f4fbWBwqqUCg42D1KKLc15dXzsDdXpTgo8lZsBhrQMQCJlZjEONm25Uf3p2eDV8HzR1Gfuh5i4taQRN8KiQuucaBb5KXCICFiDEhAHy3V-z9TLAHaXwqO-5EemdAUpByxo",
  },
  {
    title: "Vague",
    bpm: 85,
    key: "A Maj",
    price: "29.99",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAH5JpVGxKLrbdkeJZbsXuGvDCVjFVWCTp_fm8nOTRgXRWSQYVGW4H8wWOoJMCR_ew_kTwm-fc34bgJjFX5GVAWKBvrYAs-y0Bak0X1kmmPCKEg1QajjREXXbucvVTEmFM2eyZU5EMaxkvdG3X3ReLHsFgHd3eaKffF4lPSyqKPywtUtkpZv_O8_WJDH7DD9pL87aSO3StF7ayLeG68m2YXgkt25D3-EcB5prOdIj5u-JL3YLH7rdMMGXC0zxFyhzsi1RtBxe4AJ90",
  },
]

const BeatsStorefront = () => {
    return (
        <section className="py-24 relative" id="beats">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center md:items-end md:flex-row justify-center md:justify-between mb-12 gap-8">
                {/* Header + Filters */}
                <div className="text-center md:text-left max-w-lg">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Beats</h2>
                    <p className="text-gray-400 max-w-md">
                    Browse our collection of high-quality instrumentals. Instant delivery upon purchase.
                    </p>
                </div>

                {/* Filters */}
                <div className="w-full md:w-auto flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                    {filters.map((filter, i) => (
                        <button
                            key={filter}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
            </div>

            {/* Beats Grid */}
            <div className="grid grids-col-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {beats.map((beat, index) => (
                    <motion.div
                        key={beat.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-midnight-card rounded-lg p-4 border border-white/5 hover:border-primary/50 transition-all group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    >
                        {/* Cover + Price + Play Overlay */}
                        <div className="relative aspect-square rounded overflow-hidden mb-4">
                            <Image
                                src={beat.cover}
                                alt={`${beat.title} cover art`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* price tag */}
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary border border-primary/20">
                                ${beat.price}
                            </div>
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    <Play size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Title + Wishlist */}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white text-lg leading-tight truncate">{beat.title}</h3>
                            <button className="text-gray-500 hover:text-primary transition-colors">
                                <PlusCircle size={24} />
                            </button>
                        </div>

                        {/* BPM + Key Tags */}
                        <div className="flex gap-2 mb-4">
                            <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                                {beat.bpm} BPM
                            </span>
                            <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                                {beat.key}
                            </span>
                        </div>
                        {/* Buy Button */}
                        <button className="w-full py-2 bg-white/5 hover:bg-primary text-white text-sm font-bold rounded transition-colors flex items-center justify-center gap-2 group-hover:bg-primary">
                            <ShoppingBag size={18} />
                                Buy License
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <button className="px-8 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all">
                    View Full Catalog
                </button>
            </div>
        </section>
    )
}

export default BeatsStorefront;