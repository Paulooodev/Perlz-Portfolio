"use client";
import { useState } from "react";
import Link from "next/link";
import { Equal, Icon, Mail, MessageCircle } from "lucide-react";
import {
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaSpotify,
  FaTiktok
} from "react-icons/fa6";
import Logo from "@/app/Assets/logo2.png";
import Image from "next/image";
import React from 'react';

// --- Contact details — swap these ---
const EMAIL = "perlzbeats@GMAIL.COM";
const WHATSAPP = "+2349020700078";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Beats", href: "#beats" },
  { label: "Packs", href: "#packs" },
];

const SOCIALS = [
    { label: "Instagram", href: "https://www.instagram.com/p3rlz__", Icon: FaInstagram },
    { label: "x / Twitter", href: "https://x.com/p3rlz__", Icon: FaXTwitter },
    { label: "YouTube", href: "https://www.youtube.com/@p3rlzz", Icon: FaYoutube },
    { label: "TikTok", href: "https://www.tiktok.com/@p3rlz_", Icon: FaTiktok },
    { label: "Spotify", href: "https://open.spotify.com/artist/5Pc7rfy9aQZ0x0bNDVRveQ?si=1Zniu0dMQ_G0qy9k8c4LWA&nd=1&dlsi=7cea4e5817e04d23", Icon: FaSpotify },
]

const Footer = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const year = new Date().getFullYear();
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-white/5 bg-[#080808] pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">

        {/* Top: 2-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 pb-12">


            {/* Brand + socials */}
            <div className="md:col-span-5 flex flex-col gap-5">
                    <div className="relative size-50">
                        <Image
                            src={Logo}
                            alt="Logo"
                            className="object-contain"
                            fill
                            placeholder="blur"
                        />
                    </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                    Crafting the future of sound from Lagos to London. Afrobeats,
                    UK tunes, and Hip-Hop produced for artists who want to compete.
                </p>

                {/* Socials */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {SOCIALS.map(({ label, href, Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-colors"
                    >
                        <Icon size={16} />
                    </Link>
                    ))}
                </div>
            </div>

        {/* Nav + direct contact */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
                {NAV_LINKS.map(({ label, href }) => (
                <Link
                    key={label}
                    href={href}
                    className="text-gray-400 hover:text-white text-sm transition-colors w-fit"
                >
                    {label}
                </Link>
                ))}
            </nav>

            <div className="h-px bg-white/5 my-2" />

            <h4 className="text-white font-bold text-sm uppercase tracking-widest">
              Contact
            </h4>

            <div className="flex flex-col gap-3">
                <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors w-fit"
                >
                    <Mail size={14} className="text-primary" />
                    {EMAIL}
                </a>
                <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors w-fit"
                >
                    <MessageCircle size={14} className="text-primary" />
                    WhatsApp
                </a>
            </div>
          </div>
        </div>

         {/* Legal row */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                <p>© {year} Perlz. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/terms" className="hover:text-gray-400 transition-colors">
                        Terms
                    </Link>
                    <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                        Privacy
                    </Link>
                    <Link href="/licensing" className="hover:text-gray-400 transition-colors">
                        Licensing
                    </Link>
                </div>
            </div>   
        </div>
    </footer>
  )
};

export default Footer;