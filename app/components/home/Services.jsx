"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioWaveform, Piano, Mic2, Layers, Ghost, CheckCircle2 } from 'lucide-react';
import React from 'react'


const EMAIL = "perlzbeats@gmail.com";

const buildMailto = (service) => {
    const subject = encodeURIComponent(`Booking Inquiry - ${service}`);
    const body = encodeURIComponent(
        `Hi Perlz, \n\nI'd like to book  your ${service} service.
        \n\nProject details:\n- Artist / Project name:\n- Genre:\n- Number of tracks:\n\n- Reference tracks:\n\nThanks.
        `
    );
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
};

const SERVICES = [
    {
        id: "vocal-tuning",
        icon: Mic2,
        title: "VOCAL FINE-TUNING",
        tagline: "Industry-standard pitch correction and timing alignment.",
        price: { NGN: "₦35,000", USD: "$25" }, 
        priceSuffix: "/track",
        features: [
            "Natural or 'T-Pain' style tuning",
            "Manual pitch correction (Melodyne)",
            "Time alignment & pocketing",
            "Sibilance & breath control",
            "Harmonies & doubles processing",
        ],
    },
    {
        id: "full-production",
        icon: Layers,
        title: "FULL PRODUCTION",
        tagline: "Tailor-made instrumentals built from scratch",
        price: { NGN: "From ₦250,000", USD: "From $200"},
        priceSuffix: "",
        features: [
            "Custom beat from scratch",
            "1-on-1 creative session",
            "Professional mixing included",
            "Mastered & release-ready",
        ]
    },
    {
        id: "ghost-production",
        icon: Ghost,
        title: "GHOST PRODUCTION",
        tagline: "Full rights, your name. Strictly confidential.",
        price: { NGN: "From ₦300,000", USD: "From $250"},
        priceSuffix: "",
        features: [
            "Full exclusive rights transfer",
            "NDA on every project",
            "Unlimited creative revisions",
            "Delivered with full stems",
        ]
    },
]

const Services = () => {
    const [currency, setCurrency] = useState("NGN");

  return (
    <section id="services" className="py-24 md:py-32 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
            {/* Header row: title left, toggle right */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center items-center md:text-left"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
                    Studio Services
                    </h2>
                    <p className="text-gray-400">
                    Elevate your sound with professional engineering.
                    </p>
                </motion.div>

                {/* Currency toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-1 bg-[#0a0a0a] border border-white/5 rounded-lg p-1 mx-auto md:mx-0"
                    role="radiogroup"
                    aria-label="Currency"
                >
                    {["NGN", "USD"].map((c) => (
                        <button
                            key={c}
                            role="radio"
                            aria-checked={currency === c}
                            onClick={() => setCurrency(c)}
                            className={`
                                px-5 py-2 rounded-md text-sm font-bold transition-colors ${
                                    currency === c
                                        ? "bg-primary text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {c === "NGN" ? "₦ NGN" : "$ USD"}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service, i) => {
                    const Icon = service.icon;
                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="relative bg-[#0a0a0a] rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition-all group overflow-hidden flex flex-col"
                        >
                            {/* Watermark icon, top-right */}
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <Icon
                                    size={32}
                                    strokeWidth={1.5}
                                    className="text-primary/10 group-hover:text-primary/20 transition-colors"
                                />
                            </div>

                              {/* Title + tagline */}
                              <div className="mb-6 relative">
                                <h3 className="text-2xl font-black text-white mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {service.tagline}
                                </p>
                              </div>

                              {/* Features */}
                              <ul className="space-y-4 mb-8 flex-1">
                                {service.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 text-gray-300 text-sm"
                                        >
                                        <CheckCircle2
                                            size={16}
                                            className="text-primary shrink-0 mt-0.5"
                                        />
                                        <span>{feature}</span>
                                        </li>
                                ))}
                              </ul>

                              {/* Price and CTA */}
                              <div className="flex items-center justify-between mt-auto gap-3">
                                <div className="text-xl lg:text-2xl font-bold text-white font-mono leading-tight">
                                    {service.price[currency]}
                                    {service.priceSuffix && (
                                    <span className="text-sm font-normal text-gray-500">
                                        {service.priceSuffix}
                                    </span>
                                    )}
                                </div>
                                <a
                                    href={buildMailto(service.title)}
                                    className="bg-white/5 hover:bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors border border-white/10 hover:border-primary whitespace-nowrap"
                                >
                                    Book Now
                                </a>
                              </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Footnote */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 text-center text-gray-500 text-sm"
            >
                All prices are starting rates. Final quotes depend on project scope.{" "}
                <a 
                    href={buildMailto("Custom Project")}
                    className="text-primary font-bold hover:underline"
                >
                   Request a custom quote → 
                </a>
            </motion.p>
        </div>
    </section>
  )
}

export default Services;