import React from 'react'
import Link from "next/link"
import { Plus, Package } from 'lucide-react';
import { createClient } from "@/lib/supabase/server";
import PackRow from './_components/PackRow';

export const metadata = {
  title: "Packs — Admin",
  robots: { index: false, follow: false },
};

export default async function PacksListPage()  {
    const supabase = await createClient();
    
    const { data: packs, error } = await supabase
        .from("packs")
        .select("*")
        .order("created_at", { ascending: false });
        
     // Generate public URLs for artwork
     const packsWithUrls = (packs || []).map((pack) => {
        let publicUrl = null;
        if(pack.artwork_path){
            const { data } = supabase.storage
                .from("packs-media")
                .getPublicUrl(pack.artwork_path);
            publicUrl = data.publicUrl;
        }
        return { ...pack, publicUrl}
     });   
  return (
    <div className='max-w-5xl'>
       <div className="flex items-center justify-between mb-10">
        <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Packs
          </h1>
          <p className="text-gray-400">
            {packsWithUrls.length}{" "}
            {packsWithUrls.length === 1 ? "pack" : "packs"} total
          </p>
        </div>

        <Link
            href="/admin/packs/new" 
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
        >
          <Plus size={16} />
          Upload Pack        
        </Link>
        </div> 

        {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-6">
          Failed to load packs: {error.message}
        </div>
      )}

      {packsWithUrls.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center">
           <div className="size-14 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <Package size={22} className="text-gray-400" />
            </div> 
            <h3 className="text-white font-bold mb-2">No packs yet</h3>
            <p className="text-gray-500 text-sm mb-6">
                Upload your first sample pack to get started.
            </p>
            <Link
                href="/admin/packs/new"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
            >
              <Plus size={16} />
                Upload Your First Pack
            </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
            {packsWithUrls.map((pack) => (
                <PackRow key={pack.id} pack={pack} publicUrl={pack.publicUrl}/>
            ))}
        </div>
      )}
    </div>
  )
}