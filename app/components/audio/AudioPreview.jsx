"use client";

import { Play, Pause, Loader2 } from "lucide-react";
import { useAudioPlayer } from "./AudioPlayerProvider";

import React, { useEffect, useRef, useState} from 'react'

const AudioPreview = ({
    trackId,        // unique id (the beat/pack uuid)
    audioUrl,       // public URL of the preview MP3
    className = "", // optional extra classes for the wrapper
}) => {
    // Ref to the actual <audio> element so we can call .play() / .pause()
    const audioRef = useRef(null);

    // Loading = audio metadata is being fetched (before we know duration etc)
    const [isLoading, setIsLoading] = useState(false);

    // Local "is this track currently playing" state
    const [isPlaying, setIsPlaying] = useState(false);

    // Current playback position in seconds (for the progress bar)
    const [progress, setProgress] = useState(0);

    // Total duration in seconds (used to calculate progress %)
    const [duration, setDuration] = useState(0);

    const { activeId, requestPlay, notifyStop } = useAudioPlayer();

    useEffect(() => {
        if(activeId !== trackId && audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
        }
    }, [activeId, trackId]);

   // PLAY / PAUSE TOGGLE
   const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation(); 

        if (!audioRef.current) return;

        if(audioRef.current.paused){
            // Tell the coordinator we want to start playing.
            // It will pause whatever else was playing.
            requestPlay(trackId, audioRef.current); 

            try {
               setIsLoading(true);
               await audioRef.current.play(); 
            } catch (err) {
                // Browser blocked autoplay or some other issue — silently ignore
                console.warn("Audio playback failed:", err);                
            } finally {
                setIsLoading(false);
            }
        } else {
           audioRef.current.pause(); 
        }
   };

    // SCRUB BAR — click to jump to a position
    const handleScrubClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!audioRef.current || !duration) return

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const fraction = clickX / rect.width;

        // Jump to that position
        audioRef.current.currentTime = duration * fraction;
    };

    // No audio? Render nothing.
    if (!audioUrl) return null;
      // Calculate progress bar fill (0-100%)
      const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className={className}>
    {/* The actual <audio> element — invisible, controlled programmatically */}
        <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => {
                setIsPlaying(false);
                notifyStop(trackId);
                }}   
            onEnded={() => {
                setIsPlaying(false);
                notifyStop(trackId);
                setProgress(0);
                }}
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}   
        />

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="size-14 rounded-full bg-primary hover:bg-blue-600 flex items-center justify-center shadow-2xl transition-all hover:scale-105"
          aria-label={isPlaying ? "Pause" : "Play"}  
        >
            {isLoading ? (
                <Loader2 size={20} className="text-white animate-spin" />
            ) : isPlaying ? (
                <Pause size={20} className="text-white fill-white" />
            ) : (
                <Play size={20} className="text-white fill-white ml-1" />
            )}
        </button>

        {/* Progress bar — only show when something is playing or paused mid-track */}
        {(isPlaying || progress > 0) && duration > 0 && (
            <div
               onClick={handleScrubClick} 
               className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
               role="progressbar"
               aria-valuenow={progressPercent}
               aria-valuemin={0}
               aria-valuemax={100}
            >
                <div
                  className="h-full bg-primary transition-[width] duration-100"
                  style={{ width: `${progressPercent}%` }}  
                />
            </div>
        )}
    </div>
  )
}

export default AudioPreview