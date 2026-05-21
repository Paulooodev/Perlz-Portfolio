"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  AlertCircle,
  Play,
} from "lucide-react";
import { deleteBreakdown, togglePublish } from "../actions";

const BreakdownRow = ({ breakdown }) => {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleTogglePublish = () => {
        setError("");
        startTransition(async () => {
            const result = await togglePublish(breakdown.id, breakdown.is_published);
            if (result?.error) setError(result.error);
        })
    }

    const handleDelete = () => {
        if (!confirmingDelete) {
          setConfirmingDelete(true);
          setTimeout(() => setConfirmingDelete(false), 5000);
          return;
        }
    
        setError("");
        startTransition(async () => {
          const result = await deleteBreakdown(breakdown.id);
          if (result?.error) setError(result.error);
        });
      };

      const thumbnailUrl = `https://img.youtube.com/vi/${breakdown.youtube_video_id}/mqdefault.jpg`;
  return (
    <div
      className={`
        group flex items-center gap-4 p-4 bg-[#0a0a0a] border rounded-xl transition-colors
        ${breakdown.is_published ? "border-white/5" : "border-white/5 opacity-60"}
      `}
    >
       {/* Thumbnail with play icon overlay */}
       <div className="relative w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-[#111]">
           <Image
            src={thumbnailUrl}
            alt={breakdown.title}
            className="w-full h-full object-cover"
            fill
            unoptimized
            />
             <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play size={18} className="text-white fill-white ml-0.5" />
             </div>
            {breakdown.is_featured && (
                <div className="absolute top-1 right-1 size-5 rounded-full bg-primary flex items-center justify-center">
                <Star size={10} className="text-white fill-white" />
                </div>
            )} 
        </div>

         {/* Title + metadata */}
         <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold truncate">{breakdown.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
               {breakdown.duration && (
                    <span className="font-mono">{breakdown.duration}</span>
                )}
                {breakdown.duration && breakdown.description && <span>·</span>}
                {breakdown.description && (
                    <span className="truncate">{breakdown.description}</span>
                )}
            </div>
         </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={handleTogglePublish}
                disabled={isPending}
                title={breakdown.is_published ? "Unpublish" : "Publish"}
                className="size-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
                {breakdown.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            <Link
               href={`/admin/breakdowns/${breakdown.id}/edit`}
               title="Edit"
               className="size-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Pencil size={16} />
            </Link>

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

       {error && (
            <div className="absolute right-4 -top-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded">
            <AlertCircle size={10} />
            {error}
            </div>
        )}  
    </div>
  )
}

export default BreakdownRow