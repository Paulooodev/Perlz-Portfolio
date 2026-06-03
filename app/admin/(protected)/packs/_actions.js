"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/server";

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
        artwork_path: String(formData.get("artwork_path") || "").trim() || null,
        preview_audio_path: String(formData.get("preview_audio_path") || "").trim() || null,
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

  const { error } = await supabase.from("packs").insert(fields);
  if (error) return { error: error.message };

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
    .from("packs")
    .select("artwork_path, preview_audio_path")
    .eq("id", id)
    .single();

  if (fetchError) return { error: "Pack not found." };

  const admin = createAdminClient();
    if (existing) {
      if(fields.artwork_path && existing.artwork_path && fields.artwork_path !== existing.artwork_path){
        await admin.storage.from("packs-media").remove([existing.artwork_path]);
      }
      if(fields.preview_audio_path && existing.preview_audio_path && fields.preview_audio_path !== existing.preview_audio_path){
        await admin.storage.from("packs-media").remove([existing.preview_audio_path]);
      }
    }
    


  const { error } = await supabase
    .from("packs")
    .update(fields)
    .eq("id", id);

  if (error) return { error: error.message };

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
      const admin = createAdminClient();
        const toDelete = [existing.artwork_path, existing.preview_audio_path].filter(Boolean);
        if (toDelete.length) await admin.storage.from("packs-media").remove(toDelete);
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