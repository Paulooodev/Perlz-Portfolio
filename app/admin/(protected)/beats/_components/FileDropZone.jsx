"use-client"
import { useRef, useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Music, AlertCircle } from "lucide-react";
import React from 'react'


const MAX_SIZES = {
    image: 5 * 1024 * 1024,  
    audio: 15 * 1024 * 1024,
}

function formatSize(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const FileDropZone = ({
    name,                  // form field name (e.g. "artwork", "preview_audio")
    accept,                // MIME types to accept (e.g. "image/*", "audio/*")
    label,                 // display label
    hint,                  // small helper text below
    existingUrl = null,    // if editing, the URL of the existing file to show
    type = "image",        // "image" or "audio" — affects preview rendering
}
) => {
// Stores the actual binary data (the file itself) to be sent to Supabase
const [file, setFile] = useState(null);

// Stores a URL string for the UI (either an 'https://' link from the DB or a 'blob:' link from the browser)
const [preview, setPreview] = useState(existingUrl);

// Tracks if a file is being hovered over the box (used for CSS hover effects/glows)
const [dragging, setDragging] = useState(false);

// validation error if the file is too big or wrong type
const [validationError, setValidationError] = useState("");

// A remote control for the hidden HTML file input
const inputRef = useRef(null);

useEffect(() => {
    // If no new file is selected, don't do anything
    if(!file) return;

    // Create a temporary, local URL that points to the file in the computer's memory
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // CLEANUP: When the component closes or file changes, delete the temp URL to save RAM
    return () => URL.revokeObjectURL(url);
}, [file])

// --- CORE FILE HANDLER ---
const handleFile = (selectedFile) => {
   if (!selectedFile) return;
    // Clear any previous error
    setValidationError("");

   // Check file size against the limit for this type
    const maxSize = MAX_SIZES[type] || MAX_SIZES.image;
    if (selectedFile.size > maxSize) {
      setValidationError(
        `File is ${formatSize(selectedFile.size)} — max allowed is ${formatSize(maxSize)}. Please compress or resize before uploading.`
      );
      // Reset the file input so they can re-select if needed
      if (inputRef.current) inputRef.current.value = "";
      return;
    } 

    if (type === "image" && !selectedFile.type.startsWith("image/")) {
      setValidationError("That doesn't look like an image. JPG or PNG only.");
      return;
    }
    if (type === "audio" && !selectedFile.type.startsWith("audio/")) {
      setValidationError("That doesn't look like an audio file. MP3 recommended.");
      return;
    }

    // All checks passed — accept the file
    setFile(selectedFile);
};

// --- DRAG AND DROP LOGIC ---
const handleDragOver = (e) => {
    // This is vital Browsers usually try to Open files dropped on them. 
    // We stop that behavior so we can Catch the file instead.
    e.preventDefault();         
    setDragging(true);   
}

const handleDragLeave = () => setDragging(false);

const handleDrop = (e) => {
    e.preventDefault(); // Stop the browser from opening the file
    setDragging(false);
    
    // Extract the first file from the "drop event"
    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);  
};

// When the user clicks the pretty UI box, tell the hidden ugly <input> to click itself
const handleClick = () => inputRef.current?.click();

// Standard handler for when a user picks a file via the browser window
const handleInputChange = (e) => handleFile(e.target.files?.[0]);

// --- RESET LOGIC ---
const handleClear = (e) => {
    // Prevents the Click to Browse logic from firing when you hit Delete
    e.stopPropagation();
    setFile(null);          // Remove the file data
    setPreview(existingUrl); // Revert to the original image (or null)
    setValidationError("");
    // Reset the actual HTML input so you can select the same file again if needed
    if (inputRef.current) inputRef.current.value = "";
}

// Choose the right icon to show in the center of the box based on what we are uploading
const Icon = type === "audio" ? Music : ImageIcon;
const maxSize = MAX_SIZES[type] || MAX_SIZES.image;
  return (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {label}
        </label> 

       <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed
          transition-colors overflow-hidden
          ${
            dragging
              ? "border-primary bg-primary/5"
              : validationError
              ? "border-red-500/40 bg-red-500/5"
              : "border-white/10 hover:border-white/20 bg-[#0a0a0a]"
          }
        `}
      >
        {/* Hidden native file input — triggered programmatically */}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
           {preview ? (
                // Show preview if we have one
                <div className="relative">
                {type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                    src={preview}
                    alt="Preview"
                    className="w-full aspect-square object-cover"
                    />
                ) : (
                    <div className="p-6 flex flex-col items-center gap-3">
                    <Music size={32} className="text-primary" />
                    <audio controls src={preview} className="w-full max-w-xs" />
                    {file && (
                        <p className="text-xs text-gray-500 truncate max-w-full">
                        {file.name} . {formatSize(file.size)}
                        </p>
                    )}
                    </div>
                )}

                {/* Clear button — only show if user has selected a NEW file */}
                {file && (
                    <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-2 right-2 size-8 bg-black/60 hover:bg-red-500 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-colors"
                    aria-label="Clear selection"
                    >
                    <X size={14} />
                    </button>
                )}
                </div>
            ) : (
                // Empty state — show drop zone instructions
                <div className="p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
                <div className="size-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon size={22} className="text-gray-400" />
                </div>
                <div>
                    <p className="text-white text-sm font-bold">
                    <span className="text-primary">Click to upload</span> or drag & drop
                    </p>
                    {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
                    <p className="text-gray-600 text-[10px] mt-2 font-mono">
                        Max {formatSize(maxSize)}
                    </p>
                </div>
                </div>
            )} 
        </div> 

        {/* Validation error banner — appears below the dropzone */}
              {validationError && (
                <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}
    </div>
  )
}

export default FileDropZone