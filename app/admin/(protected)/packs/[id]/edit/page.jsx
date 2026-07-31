import React from 'react'
import { notFound } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import PackForm from '../../_components/PackForm';
import { updatePack } from '../../_actions';

export const metadata = {
  title: "Edit Pack — Admin",
  robots: { index: false, follow: false },
};

export default async function EditPackPage({ params })  {
    const { id } = await params;
    const supabase = await createClient();

    const { data: pack, error } = await supabase
        .from("packs")
        .select("*")
        .eq("id", id)
        .single();

        if(error || !pack) notFound();

    // Generate URLS for existing media (packs-media bucket)
    let existingArtworkUrl = null;
    let existingAudioUrl = null;

    if(pack.artwork_path) {
       const { data } = supabase.storage
        .from("packs-media")
        .getPublicUrl(pack.artwork_path); 
        existingArtworkUrl = data.publicUrl;
    }

    if(pack.preview_audio_path) {
       const { data } = supabase.storage
        .from("packs-media")
        .getPublicUrl(pack.preview_audio_path); 
        existingAudioUrl = data.publicUrl;
    }
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Edit Pack
            </h1>
            <p className="text-gray-400">
                Update metadata or replace the artwork/audio. Existing files stay if
                you don't upload new ones.
            </p>
        </div>

        <PackForm
            action={updatePack}
            packId={id}
            defaultValues={pack}
            existingArtworkUrl={existingArtworkUrl}
            existingAudioUrl={existingAudioUrl}
            submitLabel='Save Changes'
        />
    </div>
  )
}

