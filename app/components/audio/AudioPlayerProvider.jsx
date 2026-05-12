"use client";
import React, { useCallback, useState, useRef, createContext, useContext } from 'react';

const AudioPlayerContext = createContext(null);

const AudioPlayerProvider = ({ children }) => {
   // The id of the currently-playing track (or null if nothing playing).
  // Each track has a unique id from the database (UUID).
    const [activeId, setActiveId] = useState(null);

    // We also keep a ref to the currently-playing <audio> element so we can
    // pause it directly when something else takes over.
    const activeAudioRef = useRef(null)

    // Called by an AudioPreview when it starts playing.
    // Pauses whatever was playing before, then registers this one as active
    const requestPlay = useCallback((id, audioElement) => {
        // If something else was playing, pause it first 
        if(activeAudioRef.current && activeAudioRef.current !== audioElement) {
            activeAudioRef.current.pause();
        }
        activeAudioRef.current = audioElement;
        setActiveId(id);
    }, [])

    // Called when a track stops (user paused, or it ended naturally).
    // Only clear the active id if THIS track was actually the active one.

    const notifyStop = useCallback((id) => {
        setActiveId((current) => (current === id ? null : current))
    })
  return (
    <AudioPlayerContext.Provider
        value={{ activeId, requestPlay, notifyStop }}
    >
        {children}
    </AudioPlayerContext.Provider>
  )
}

export default AudioPlayerProvider

export function useAudioPlayer() {
    const ctx = useContext(AudioPlayerContext);
    if(!ctx) {
        throw new Error(
            "useAudioPlayer must be used inside AudioPlayerProvider. " +
            "Make sure (site)/layout.jsx wraps children with <AudioPlayerProvider>."
        );
    }
    return ctx;
}