"use client";
import React from "react";
import { motion } from "framer-motion";
import { Activity, Disc3, Users, Eye } from "lucide-react";

const stats = [
    {
        icon: Activity,
        value: "Top 5%",
        label: "Streamed Producer in 2025",
    },

    {
        icon: Disc3,
        value: "17M+",
        label: "Careers Streams Generated",
    },

    {
        icon: Users,
        value: "50+",
        label: "Happy clients and artists",
    },

    {
        icon: Eye,
        value: "849k+",
        label: "Video Views",
    },
] 

const StatsSection = () => {
    return (
        <section className="mt-20 md:mt-32 border-y border-white/5 bg-midnight-card/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="flex flex-wrap justify-center md:justify-between gap-12 lg:gap-16 text-center md:text-left">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                                className="flex flex-col sm:flex-row items-center gap-6"
                            >
                                <Icon className="text-gray-600 flex-shrink-0"/>

                               <div>
                                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">
                                        {stat.label}
                                    </div>
                                </div> 
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default StatsSection