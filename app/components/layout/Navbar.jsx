"use client";
import React, { useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Menu, Youtube, X } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/Assets/logo2.png";
import Link from "next/link";


const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Beats", href: "#beats" },
    { name: "Sample Packs", href: "#samples" },
    { name: "Beats Breakdown", href: "#breakdowns" },
    { name: "Services", href: "#services" },
]

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all glass-nav duration-300 ${
                isScrolled
                ? "bg-midnight/80 backdrop-blur-lg h-16 border-b border-white/5"
                : "bg-transparent h-24"
            }`}>
                <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                    {/* Framer motion and perlz logo to be added */}
                    {/* <motion.div
                        whileHover={{ rotate: 180 }}
                        className="size-10 rounded-lg bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white"
                    >
                        <Music size={22} strokeWidth={2.5} />
                    </motion.div> */}
                    <div className="relative size-30">
                        <Image
                            src={Logo}
                            alt="Logo"
                            className="object-contain"
                            fill
                            placeholder="blur"
                        />
                    </div>
                        {/* <span className="font-black text-2xl tracking-tighter uppercase group-hover:text-primary transition-colors">
                            Perlz <span className="text-primary">oh!!!</span>
                        </span> */}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-2xl font-semibold text-gray-400 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                {/* <span className="absolute"></span> */}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-4">
                        {/* <button className="bg-primary hover:bg-blue-600 px-6 py-3 rounded-full text-xl font-black shadow-[0_0_20px_rgba(13,89,242,0.4)] transition-all">
                            CONTACT
                        </button> */}

                        {/* Mobile Toggle */}
                        <button 
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 bg-midnight border-b border-white/5 p-6 md:hidden flex flex-col gap-4"
                        >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-bold hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        </motion.div>
                    )}
                </AnimatePresence>
        </nav>
    )
}

export default Navbar