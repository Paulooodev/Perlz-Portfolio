"use client";
import { createClient } from "@/lib/supabase/client";

// Generate a safe, unique filename (same logic as the old server-side version)
function makeStoragePath(folder, originalFilename) {
  const ext = originalFilename.split(".").pop().toLowerCase();
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${folder}/${uniqueId}.${ext}`;
}

/**
 * Upload a file directly to a Supabase Storage bucket from the browser.
 *
 * @param {Object} opts
 * @param {File} opts.file - the File object from the input
 * @param {string} opts.bucket - "beats-media" or "packs-media"
 * @param {string} opts.folder - "artwork" or "audio"
 * @param {function} [opts.onProgress] - optional callback (0-100) for progress
 * @returns {Promise<string>} the storage path (e.g. "audio/123-abc.mp3")
 */
export async function uploadToStorage({ file, bucket, folder, onProgress }) {
  if (!file || file.size === 0) return null;

  const supabase = createClient();
  const path = makeStoragePath(folder, file.name);

  // Supabase JS v2 doesn't expose granular upload progress, so we fake a
  // simple "started → done" signal.
  if (onProgress) onProgress(10);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  if (onProgress) onProgress(100);
  return path;
}

/**
 * Delete a file from storage (used when replacing during edit).
 */
export async function deleteFromStorage({ bucket, path }) {
  if (!path) return;
  const supabase = createClient();
  await supabase.storage.from(bucket).remove([path]);
}