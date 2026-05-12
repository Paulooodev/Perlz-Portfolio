import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBeat } from "../../actions";
import BeatsForm from "../../_components/BeatsForm";

export const metadata = {
  title: "Edit Beat — Admin",
  robots: { index: false, follow: false },
};

export default async function EditBeatPage({ params }) {
    const { id } = await params;

    const supabase = await createClient()

    // Fetch the beat to edit
    const { data: beat, error } = await supabase
        .from("beats")
        .select("*")
        .eq("id", id)
        .single();

    // If not found, show 404
    if (error || !beat) notFound();

    // Generate public URLs for the existing media so we can show them in the form
    let existingArtworkUrl = null;
    let existingAudioUrl = null;

    if(beat.artwork_path){
       const { data } = supabase.storage
        .from("beats-media") 
        .getPublicUrl(beat.artwork_path);
        existingArtworkUrl = data.publicUrl;
    }

    if(beat.preview_audio_path){
       const { data } = supabase.storage
        .from("beats-media") 
        .getPublicUrl(beat.preview_audio_path);
        existingAudioUrl = data.publicUrl;
    }

    const updateBeatWithId = updateBeat.bind(null, id);

    return(
        <div>
           <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Edit Beat
            </h1>
            <p className="text-gray-400">
                Update metadata or replace the artwork/audio. Existing files stay if
                you don't upload new ones.
            </p>
            </div> 
           <BeatsForm
                action={updateBeatWithId}
                defaultValues={beat}
                existingArtworkUrl={existingArtworkUrl}
                existingAudioUrl={existingAudioUrl}
                submitLabel="Save Changes"
            /> 
        </div>
    )
}