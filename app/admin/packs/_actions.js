"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// HELPERS 
function makeStoragePath(folder, originalFilename) {
    const ext = originalFilename.split(".").pop().toLowerCase();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return `${folder}/${uniqueId}.${ext}`;
}

async function uploadFile(supabase, file, folder) {
    if (!file || file.size === 0) return null;
    const path = makeStoragePath(folder, file.name);

  const { error } = await supabase.storage
    .from("packs-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    }); 

    if (error) throw new Error(`File upload failed: ${error.message}`);
    return path;
}

async function deleteFile(supabase, path) {
  if (!path) return;
  await supabase.storage.from("packs-media").remove([path]);
}

function parsePackFormData(formData) {
   const tagsRaw = String(formData.get("tags") || "");
   const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
    
    return {
        title: String(formData.get("title") || "").trim(),
        subtitle: String(formData.get("subtitle") || "").trim() || null,
        sample_count: String(formData.get("sample_count") || "").trim() || null,
        file_size: String(formData.get("file_size") || "").trim() || null,
        format: String(formData.get("format") || "").trim() || null,
        tags, // To be stored as Postgres text []
        price_ngn: formData.get("price_ngn")
            ? Number(formData.get("price_ngn"))
            : null,
        price_usd: formData.get("price_usd")
            ? Number(formData.get("price_usd"))
            : null,
        is_featured: formData.get("is_featured") === "on",
        is_published: formData.get("is_published") === "on",
    }
}

// CREATE
export async function createPack(formData) {
    const supabase = await createClient();

    // check if user is authenticated ?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." }; 
  
  const fields = parsePackFormData(formData);
  if (!fields.title) return { error: "Title is required." };

  const artworkFile = formData.get("artwork");
  const audioFile = formData.get("preview_audio");

  let artwork_path = null;
  let preview_audio_path = null;
  
  try {
    artwork_path = await uploadFile(supabase, artworkFile, "artwork");
   // Audio is optional for packs — only upload if provided
    preview_audio_path = await uploadFile(supabase, audioFile, "audio");
  } catch (err) {
    if (artwork_path) await deleteFile(supabase, artwork_path);
    if (preview_audio_path) await deleteFile(supabase, preview_audio_path);
    return { error: err.message}
  }

  const { error: insertError } = await supabase.from("packs").insert({
    ...fields,
    artwork_path,
    preview_audio_path,
  })

  if (insertError) {
    if (artwork_path) await deleteFile(supabase, artwork_path);
    if (preview_audio_path) await deleteFile(supabase, preview_audio_path);
    return { error: insertError.message };
  }

  revalidatePath("/admin/packs");
  revalidatePath("/", "layout");

  redirect("/admin/packs");  
}

// UPDATE

export async function updatePack(formData) {
    const supabase = await createClient();

// check if user is authenticated ?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." }; 
  
  const id = formData.get("id");
  if (!id) return { error: "Missing pack ID." };

  const fields = parsePackFormData(formData);
  if (!fields.title) return { error: "Title is required." };

    const { data: existing, error: fetchError } = await supabase
    .from("packs-media")
    .select("artwork_path, preview_audio_path")
    .eq("id", id)
    .single();

  if (fetchError) return { error: "Pack not found." };

  const artworkFile = formData.get("artwork");
  const audioFile = formData.get("preview_audio");

  let artwork_path = existing.artwork_path;
  let preview_audio_path = existing.preview_audio_path;
  
  try {
    if (artworkFile && artworkFile.size > 0) {
      const newPath = await uploadFile(supabase, artworkFile, "artwork");
      await deleteFile(supabase, existing.artwork_path);
      artwork_path = newPath;
    }
    if (audioFile && audioFile.size > 0) {
      const newPath = await uploadFile(supabase, audioFile, "audio");
      await deleteFile(supabase, existing.preview_audio_path);
      preview_audio_path = newPath;
    }
  } catch (err) {
    return { error: err.message}
  }

  const { error: updateError } = await supabase
    .from("packs")
    .update({ ...fields, artwork_path, preview_audio_path })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/admin/packs");
  revalidatePath(`/admin/packs/${id}/edit`);
  revalidatePath("/", "layout");

  redirect("/admin/packs");  
}

// DELETE
export async function deletePack(id) {
  const supabase = await createClient();
  
// check if user is authenticated ?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." }; 
  
  const { data: existing } = await supabase
    .from("packs")
    .select("artwork_path, preview_audio_path")
    .eq("id", id)
    .single();
    
   const { error } = await supabase.from("packs").delete().eq("id", id);
     if (error) return { error: error.message };

     if(existing){
        await deleteFile(supabase, existing.artwork_path);
        await deleteFile(supabase, existing.preview_audio_path);
     }


    revalidatePath("/admin/packs");
    revalidatePath("/", "layout");

    return { success: true };     
}

// TOGGLE PUBLISH
export async function togglePublish(id, currentValue) {
  const supabase = await createClient();

  // check if user is authenticated ?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." }; 

    const { error } = await supabase
    .from("packs")
    .update({ is_published: !currentValue })
    .eq("id", id);

    if(error) return { error: error.message };

    revalidatePath("/admin/packs");
    revalidatePath("/", "layout");
    
  return { success: true };    
}