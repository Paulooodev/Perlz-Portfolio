"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, EyeOff, Star, AlertCircle } from "lucide-react";
import { deleteBeat, togglePublish } from "../actions";
import React from 'react'

const BeatRow = ({
    beat, 
    publicUrl
    }) => {
        const [confirmingDelete, setConfirmingDelete] = useState(false);
        const [error, setError] = useState("");
        const [isPending, startTransition] = useTransition();
        
       // Toggle publish status 
       const handleTogglePublish = () => {
        setError("");
        startTransition(async () => {
            const result = await togglePublish(beat.id, beat.is_published);
            if (result?.error) setError(result.error);
        });
       };
       
        // Delete with two-click confirmation
        // First click: show "Are you sure?" state
        // Second click: actually delete
        const handleDelete = () => {
            if (!confirmingDelete) {
            setConfirmingDelete(true);
            // Auto-cancel confirmation after 5 seconds if they don't click again
            setTimeout(() => setConfirmingDelete(false), 5000);
            return;
            }
            setError("");
            startTransition(async () => {
                const result = await deleteBeat(beat.id);
                if (result?.error) setError(result.error);
            });
        };

        // Format the price display
        const priceDisplay = beat.price_from_ngn
            ? `From ₦${beat.price_from_ngn.toLocaleString()}`
            : beat.price_from_usd
            ? `From $${beat.price_from_usd}`
            : "-"
        return (
        <div
            className={`
            group flex items-center gap-4 p-4 bg-[#0a0a0a] border rounded-xl
            transition-colors
            ${beat.is_published ? "border-white/5" : "border-white/5 opacity-60"}
        `}
        >
            {/* Thumbnail (or placeholder if no artwork) */}
            <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-[#111]">
                {publicUrl ? (
                    <Image
                      src={publicUrl}
                      alt={beat.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">
                        No img
                    </div> 
                )}

                {/* Featured star badge */}
                {beat.is_featured && (
                    <div className="absolute top-1 right-1 size-5 rounded-full bg-primary flex items-center justify-center">
                    <Star size={10} className="text-white fill-white" />
                    </div>
                )}
            </div>

            {/* Title + metadata */}
            <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate">{beat.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                   <span>{beat.genre}</span>
                    {beat.bpm && (
                        <>
                          <span>·</span>
                          <span className="font-mono">{beat.bpm} BPM</span>
                        </>
                    )}
                    {beat.musical_key && (
                        <>
                        <span>·</span>
                        <span className="font-mono">{beat.musical_key}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="hidden md:block text-sm text-gray-400 font-mono whitespace-nowrap">
                {priceDisplay}
            </div>

           {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Publish toggle */}
            <button
                type="button"
                onClick={handleTogglePublish}
                disabled={isPending}
                title={beat.is_published ? "Unpublish" : "Publish"}
                className="size-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
                {beat.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            {/* Edit */}
            <Link
                href={`/admin/beats/${beat.id}/edit`}
                title="Edit"
                className="size-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                <Pencil size={16} />
            </Link>

            {/* Delete (with confirmation) */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                title={confirmingDelete ? "Click again to confirm" : "Delete"}
                className={`
                    size-9 flex items-center justify-center rounded-lg disabled:opacity-50 transition-colors
                    ${
                        confirmingDelete
                            ? "bg-red-500 text-white animate-pulse"
                            : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    }
                    `}
            >
                <Trash2 size={16} />
            </button>
          </div> 

        {/* Error tooltip */}
        {error && (
        <div className="absolute right-4 -top-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded">
            <AlertCircle size={10} />
            {error}
        </div>
        )}      
        </div>
    )
}

export default BeatRow