"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function makeStoragePath(folder, originalFilename) {
    // Get the file extension (e.g. "jpg", "mp3")
    const ext = originalFilename.split(".").pop().toLowerCase();

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return `${folder}/${uniqueId}.${ext}`;
}

async function uploadFile(supabase, file, folder){
    // Skip if no file was provided (e.g. user didn't upload artwork)
    if (!file || file.size === 0) return null;

    const path = makeStoragePath(folder, file.name);

    // upload to the beats-media bucket
    const { error } = await supabase.storage
        .from("beats-media")
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false
        });

        if (error) throw new Error(`File upload failed: ${error.message}`);
        return path
}

// Deleting a file from the storage

async function deleteFile(supabase, path) {
    if(!path) return;
    await supabase.storage.from("beats-media").remove([path]);
}

function parseBeatFormData(formData) {
    return {
        title: String(formData.get("title") || "").trim(),
        genre: String(formData.get("genre") || "").trim(),
        mood: String(formData.get("mood") || "").trim() || null,
        bpm: formData.get("bpm") ? Number(formData.get("bpm")) : null,
        musical_key: String(formData.get("musical_key") || "").trim() || null,
        price_from_ngn: formData.get("price_from_ngn")
            ? Number(formData.get("price_from_ngn"))
            : null,
        price_from_usd: formData.get("price_from_usd")
            ? Number(formData.get("price_from_usd"))
            : null,
        is_featured: formData.get("is_featured") === "on",
        is_published: formData.get("is_published") === "on",
    }
}

// Creation/Upload of beats 
export async function createBeat(formData) {
    const supabase = await createClient();

    // check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return { error: "User is not authenticated" };

    // Parse text fields from the form
    const fields = parseBeatFormData(formData);

    // Validate the fields
    if (!fields.title) return { error: "Title is required." };
    if (!fields.genre) return { error: "Genre is required." };

    // Get the uploaded files
    const artworkFile = formData.get("artwork");
    const audioFile = formData.get("preview_audio");

    // Upload the files to storage. If either falls , abort the whole operation
    let artwork_path = null;
    let preview_audio_path = null;

    // Fail-safe mechanism. If an image uploads successfully and the audio upload fails
    // We do not want ghost images staying in the storage and taking spaces
    try {
        artwork_path = await uploadFile(supabase, artworkFile, "artwork");
        preview_audio_path = await uploadFile(supabase, audioFile, "preview_audio");
    } catch (err) {
        // if any of the uploads above fails *******
        if (artwork_path) await deleteFile(supabase, artwork_path);
        if (preview_audio_path) await deleteFile(supabase, preview_audio_path);
        return { error: err.message };
    }

    //Insertion of row in the database - To allow our website be able to find them
    const { error: insertError } = await supabase.from("beats").insert({
        ...fields,
        artwork_path,
        preview_audio_path,
    });

    if(insertError) {
        if(artwork_path) await deleteFile(supabase, artwork_path);
        if(preview_audio_path) await deleteFile(supabase, preview_audio_path);
        return { error: insertError.message };
    }
    // Refreshing the page to show new beats added instead of cached pages
    revalidatePath("/admin/beats");
    revalidatePath("/", "layout");
    
    redirect("/admin/beats");
}

// Edit an existing beat
export async function updateBeat(id, formData) {
    const supabase = await createClient();

    // check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return { error: "User is not authenticated" };

    // Parse text fields from the form
    const fields = parseBeatFormData(formData);

     // Validate the fields
    if (!fields.title) return { error: "Title is required." };
    if (!fields.genre) return { error: "Genre is required." };

    // Fetch the existing row so we know what file paths to potentially replace
    const { data: existing, error: fetchError } = await supabase
        .from("beats")
        .select("artwork_path, preview_audio_path")
        .eq("id", id)
        .single();

        if(fetchError) return { error: "beat not found." };

    // Get any new files. If the user didn't upload new ones, we keep the old paths.
    const artworkFile = formData.get("artwork");
    const audioFile = formData.get("preview_audio"); 

    // We assume the old files are being kept
    let artwork_path = existing.artwork_path;
    let preview_audio_path = existing.preview_audio_path;

    try{
      // If a new artwork was uploaded, upload it and delete the old one
      if (artworkFile && artworkFile.size > 0) {
        const newPath = await uploadFile(supabase, artworkFile, "artwork");
        await deleteFile(supabase, existing.artwork_path);
        artwork_path = newPath;
      } 
      // Same for audio
      if(audioFile && audioFile.size > 0) {
        const newPath = await uploadFile(supabase, audioFile, "audio");
        await deleteFile(supabase, existing.preview_audio_path);
        preview_audio_path = newPath;
      }
    } catch(err) {
        return { error: err.message };
    }

    // Update the row
    const { error: updateError } = await supabase
        .from("beats")
        .update({ ...fields, artwork_path, preview_audio_path })
        .eq("id", id);

    if (updateError) return { error: updateError.message };   

    revalidatePath("/admin/beats");
    revalidatePath(`/admin/beats/${id}/edit`);
    revalidatePath("/", "layout");

    redirect("/admin/beats");
}

// Delete a beat and its files
export async function deleteBeat(id) {
    const supabase = await createClient()

    // check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return { error: "User is not authenticated" };

   // Fetch first so we know what files to clean up
    const { data: existing } = await supabase
        .from("beats")
        .select("artwork_path, preview_audio_path")
        .eq("id", id)
        .single();

    // Delete the database row
    const { error } = await supabase.from("beats").delete().eq("id", id);
    if (error) return { error: error.message }; 

    // Delete the associated files from storage
    if(existing){
        await deleteFile(supabase, existing.artwork_path);
        await deleteFile(supabase, existing.preview_audio_path);
    }

    revalidatePath("/admin/beats");
    revalidatePath("/", "layout");

    return { success: true };
}

// Quickly hide/show a beat without going to the edit page
export async function togglePublish(id, currentValue) {
  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("beats")
    .update({ is_published: !currentValue })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/beats");
  revalidatePath("/", "layout");

  return { success: true };
}
