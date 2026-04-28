"use client";


import { useSearchParams } from "next/navigation";
import { login } from "./actions";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import Logo from "@/app/Assets/logo2.png";
import Image from "next/image";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/admin";

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

       startTransition(async () => {
             const result = await login(formData);
             if (result?.error) {
               setError(result.error);
             }
           });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-midnight px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                     <Image
                        src={Logo}
                        alt="Logo"
                        className="object-contain"
                        fill
                        placeholder="blur"
                    />
                    <p className="text-gray-500 text-sm uppercase tracking-[0.3em] font-bold">
                        Admin Panel
                    </p>
                </div>

                {/* Card */}
                <div className="border bg-[#0a0a0a] border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-1">Sign in</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Enter your credentials to manage the catalog.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Email
                            </label>
                            <input
                                required
                                type="email"
                                name="email" 
                                className="w-full.border.border-white/10.rounded-lg.px-4py-3.text-white.text-sm.placeholder-gray-600.focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                placeholder="you@example.com"
                                disabled={isPending}
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                placeholder="••••••••"
                                disabled={isPending}
                                autoComplete="current-password"
                            />  
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending} 
                            className="mt-2 h-12 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                     Signing in…            
                                </>
                            ) :  (
                                <>
                                    <LogIn size={16} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

               <p className="mt-6 text-center text-gray-600 text-xs">
                    Forgot your password? Reset it from the Supabase dashboard.
                </p> 
            </div>
        </div>
    )
}
