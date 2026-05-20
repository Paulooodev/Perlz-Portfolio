

import Link from "next/link";
import { Plus, Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BreakdownRow from "./components/BreakdownRow";

export const metadata = {
  title: "Breakdowns — Admin",
  robots: { index: false, follow: false },
};

export default async function BreakdownsListPage() {
    const supabase = await createClient();
    
    const { data: breakdowns, error } = await supabase
        .from("breakdowns")
        .select("*")
        .order("created_at", { ascending: false });
        
    const items = breakdowns || [];

    return (
        <div className="max-w-5xl">
           <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                    Breakdowns
                    </h1>
                    <p className="text-gray-400">
                        {items.length}{" "}
                        {items.length === 1 ? "video" : "videos"} total
                    </p>
                </div>

           <Link
               href="/admin/breakdowns/new"
               className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
            >
          <Plus size={16} />
          Add Video
            </Link>
            </div> 
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-6">
                Failed to load breakdowns: {error.message}
                </div>
            )}


            {items.length === 0 ? (
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center">
                <div className="size-14 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                    <Youtube size={22} className="text-gray-400" />
                </div>
                    <h3 className="text-white font-bold mb-2">No breakdowns yet</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Add your first breakdown video to get started.
                    </p>
                    <Link
                        href="/admin/breakdowns/new"
                        className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
                    >
                        <Plus size={16} />
                        Add Your First Video
                    </Link>
              </div>  
            ) : (
                <div className="flex flex-col gap-3">
                  {items.map((breakdown) => (
                    <BreakdownRow key={breakdown.id} breakdown={breakdown} />
                ))}  
                </div>
            )}
        </div>
    )
}