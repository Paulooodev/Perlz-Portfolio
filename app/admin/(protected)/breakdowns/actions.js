"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function extractYouTubeVideoId(url){
    if(!url || typeof url !== "string") return null;

    // Regex patterns that matches "v=", "youtu.be/", 'embed/', or "shorts/"
    const patterns = [
        /(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }

    return null;
}

// Parse all the text fields from FormData

function parseBreakdownFormData(formData){
    return {
        title: String(formData.get("title") || "").trim(),
        description: String(formData.get("description") || "").trim() || null,
        youtube_url: String(formData.get("youtube_url") || "").trim(),
        duration: String(formData.get("duration") || "").trim() || null,
        is_featured: formData.get("is_featured") === "on",
        is_published: formData.get("is_published") === "on",        
    }
}

// CREATE
export async function createBreakdown(formData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated." };

    const fields = parseBreakdownFormData(formData);

    if (!fields.title) return { error: "Title is required." };
    if (!fields.youtube_url) return { error: "YouTube URL is required." }; 

    // Extract the video ID from the URL. If we can't, the URL is invalid.
    const youtube_video_id = extractYouTubeVideoId(fields.youtube_url);
    if (!youtube_video_id) {
    return {
      error:
        "Couldn't recognize that as a YouTube URL. Paste a full URL like https://youtube.com/watch?v=...",
    };
  }

  const { error: insertError } = await supabase.from("breakdowns").insert({
    ...fields,
    youtube_video_id,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/breakdowns");
  revalidatePath("/", "layout");

  redirect("/admin/breakdowns");
}

// UPDATE
export async function updateBreakdown(formData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated." };

    const id = formData.get("id");
    if (!id) return { error: "Missing breakdown ID." };

    const fields = parseBreakdownFormData(formData);

    if (!fields.title) return { error: "Title is required." };
    if (!fields.youtube_url) return { error: "YouTube URL is required." };

     const youtube_video_id = extractYouTubeVideoId(fields.youtube_url);
        if (!youtube_video_id) {
            return {
            error:
                "Couldn't recognize that as a YouTube URL. Paste a full URL like https://youtube.com/watch?v=...",
            };
        }

  const { error: updateError } = await supabase
    .from("breakdowns")
    .update({ ...fields, youtube_video_id })
    .eq("id", id);
    
    if (updateError) return { error: updateError.message };

    revalidatePath("/admin/breakdowns");
    revalidatePath(`/admin/breakdowns/${id}/edit`);
    revalidatePath("/", "layout");

    redirect("/admin/breakdowns");
}

// DELETE
export async function deleteBreakdown(id) {
     const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "User not authenticated." };

  const { error } = await supabase
    .from("breakdowns")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/breakdowns");
  revalidatePath("/", "layout");

  return { success: true };
}

// TOGGLE PUBLISH
export async function togglePublish(id, currentValue){
    const supabase = await createClient();

     const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated." };

  const { error } = await supabase
    .from("breakdowns")
    .update({ is_published: !currentValue })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/breakdowns");
  revalidatePath("/", "layout");

  return { success: true };
}