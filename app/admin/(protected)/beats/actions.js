"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Admin client for deleting old files during edit (service role bypasses RLS)
import { createClient as createAdminClient } from "@/lib/supabase/admin";

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
        artwork_path: String(formData.get("artwork_path") || "").trim() || null,
        preview_audio_path: String(formData.get("preview_audio_path") || "").trim() || null,
    }
}

// Creation of beats 
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


    const { error } = await supabase.from("beats").insert(fields);
    if (error) return { error: error.message };

    // Refreshing the page to show new beats added instead of cached pages
    revalidatePath("/admin/beats");
    revalidatePath("/", "layout");
    
    redirect("/admin/beats");
}

// Update 
export async function updateBeat(formData) {
    const supabase = await createClient();

    // check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return { error: "User is not authenticated" };

    const id = formData.get("id");
    if (!id) return { error: "Missing beat ID." };

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

    // If a new path came in and ot differs from the old one, delete the old file
    const admin = createAdminClient();
    if(existing){
        if (fields.artwork_path && existing.artwork_path && fields.artwork_path !== existing.artwork_path) {
         await admin.storage.from("beats-media").remove([existing.artwork_path]);
        }
        if (fields.preview_audio_path && existing.preview_audio_path && fields.preview_audio_path !== existing.preview_audio_path) {
         await admin.storage.from("beats-media").remove([existing.preview_audio_path]);
        }  
    }
    const { error } = await supabase.from("beats").update(fields).eq("id", id);
    if (error) return { error: error.message };   

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
        const admin = createAdminClient();
        const toDelete = [existing.artwork_path, existing.preview_audio_path].filter(Boolean);
        if (toDelete.length) await admin.storage.from("beats-media").remove(toDelete);
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
