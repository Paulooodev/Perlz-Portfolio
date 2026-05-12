"use client";
import React from 'react';
import { useState, useTransition } from "react";
import Link from "next/link";
import { Save, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import FileDropZone from './FileDropZone';

// Common genre options — keeps spelling consistent across the catalog
const GENRES = ["Afrobeats", "UK Drill", "Hip-Hop", "R&B", "Afro Drill", "Trap", "Other"];

export default function BeatsForm ({
  // The action function (createBeat or updateBeat). Called when form submits.
  action,
  // Default values for the form fields. Empty for new beats, filled for editing.
  defaultValues = {},
  // URLs of existing media (for edit mode). null for new beats.
  existingArtworkUrl = null,
  existingAudioUrl = null,
  // Submit button label
  submitLabel = "Save Beat",
}) {
     const [error, setError] = useState("");
     const [isPending, startTransition] = useTransition();

     const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Pull all form data into a FormData object — server actions accept this directly
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await action(formData);
                // If the action redirects on success, we never reach here.
                // If it returns an error, show it.
                if (result?.error) setError(result.error);
        })
     }
  return (
    <form
        className='max-w-6xl'
        onSubmit={handleSubmit}    
    >
        {/* Top bar with back link + submit button */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/admin/beats"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to beats
                </Link>
                <button 
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold transition-colors"
                    disabled={isPending}
                    type="submit"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving…
                        </>
                    ) : (
                     <>
                        <Save size={14} />
                            {submitLabel}
                        </>   
                    )}
                </button>
            </div>

         {/* Error banner */}
            {error && (
                <div className="mb-6 flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
                </div>
            )}

        {/* Two Column Layout  */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Column */}
            <div className="flex flex-col gap-">
                <FileDropZone
                    name="artwork"
                    accept="image/*"
                    label="Artwork"
                    hint="Square image, at least 1000×1000px. JPG or PNG."
                    type="image"
                    existingUrl={existingArtworkUrl}
                />

                <FileDropZone
                    name="preview_audio"
                    accept="audio/*"
                    label="Preview Audio"
                    hint="30–60 second tagged clip only. MP3 recommended."
                    type="audio"
                    existingUrl={existingAudioUrl}
                />
            </div>

            {/* Right Column - Metadata */}
            <div className="flex flex-col gap-5">
                {/* Title */}
                <Field label="Title" required>
                    <input
                    type="text"
                    name="title"
                    required
                    defaultValue={defaultValues.title || ""}
                    placeholder="e.g. Midnight in Lagos"
                    className="form-input"
                    />
                </Field>

             {/* Genre + Mood (2-col grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Genre" required>
                    <select
                        name="genre"
                        required
                        defaultValue={defaultValues.genre || ""}
                        className="form-input"
                    >
                      <option value="">Select a genre…</option>
                        {GENRES.map((g) => (
                            <option
                                key={g}
                                value={g}
                            >
                                {g}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Mood">
                    <input
                        type="text"
                        name="mood"
                        defaultValue={defaultValues.mood || ""}
                        placeholder="e.g. Dark, Melodic"
                        className="form-input"
                    />
                </Field>                        
                </div> 

             {/* BPM + Key (2-col grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="BPM">
                    <input
                        type="number"
                        name="bpm"
                        min="40"
                        max="220"
                        defaultValue={defaultValues.bpm || ""}
                        placeholder="e.g. 102"
                        className="form-input"
                    />
                </Field>


                <Field label="Key">
                    <input
                        type="text"
                        name="musical_key"
                        defaultValue={defaultValues.musical_key || ""}
                        placeholder="e.g. F# Min"
                        className="form-input"
                    />
                </Field>                        
                </div> 

            {/* Prices (2-col grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Price (NGN)" hint="Lease starting price in Naira">
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                        ₦
                    </span>
                    <input
                        type="number"
                        name="price_from_ngn"
                        min="0"
                        defaultValue={defaultValues.price_from_ngn || ""}
                        placeholder="50000"
                        className="form-input pl-8"
                    />
                </div>
            </Field>
            <Field label="Price (USD)" hint="Lease starting price in Naira">
            <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                    $
                </span>
                <input
                    type="number"
                    name="price_from_usd"
                    min="0"
                    defaultValue={defaultValues.price_from_usd || ""}
                    placeholder="35"
                    className="form-input pl-8"
                />
            </div>
            </Field>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <Toggle
                    name="is_featured"
                    label="Featured"
                    hint="Highlight on homepage showcase"
                    defaultChecked={defaultValues.is_featured || false}
                />
                <Toggle
                    name="is_published"
                    label="Published"
                    hint="Visible on the public site"
                    defaultChecked={defaultValues.is_published ?? true}
                />
            </div>
            </div>
        </div> 

         {/* Reusable input styles via global CSS */}
         <style jsx>{
        `.form-input {
          width: 100%;
          background-color: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: rgb(13, 89, 242);
          box-shadow: 0 0 0 1px rgb(13, 89, 242);
        }
        .form-input::placeholder {
          color: rgba(156, 163, 175, 0.4);
        }`
        }   
         </style>
    </form>
  )
}


// Toggle 
function Toggle({ name, label, hint, defaultChecked }) {
    return (
        <label className="flex items-start gap-3 cursor-pointer group">
           <input
            type="checkbox"
            name={name}
            defaultChecked={defaultChecked}
            className="mt-1 size-4 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                {label}
            </span>
            {hint && <span className="text-xs text-gray-500">{hint}</span>}
          </div> 
        </label>
    )
}

// Field
function Field ({ label, required, hint, children }) {
    return (
       <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {label}
            {required && <span className="text-primary ml-1">*</span>}
        </label>
        {children}
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
       </div> 
    )
}

