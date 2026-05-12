"use client";
// TagsInput — chip-based input for tag arrays
// User types a tag, presses Enter (or comma), it becomes a removable chip.
import { useState, useRef } from "react";
import { X, Tag } from "lucide-react";


const TagInput = ({
    name = "tags",
    defaultValue = [],
    placeholder = "Type a tag and press Enter…",
    // The hard limit to prevent users from adding 100 tags and breaking the UI
    maxTags = 10,
}) => {
    // The finalized, confirmed list of tags (an array of strings)
    const [tags, setTags] = useState(defaultValue);

    // The text the user is currently typing (before they hit Enter)
    const [draft, setDraft] = useState("");

    const inputRef = useRef(null);

    // Add a tag (called on Enter, comma, or blur)
    const addTag = (raw) => {
        // Clean up the text by removing accidental spaces at the start or end
        const trimmed = raw.trim();
        if(!trimmed) return;
        // If the tag already exists in the list (no duplicates), stop here.
        if(tags.includes(trimmed)) return;
        if(tags.length >= maxTags) return;
        // Copy all old tags (...tags), add the new one to the end, and save it
        setTags([...tags, trimmed]);
        // Wipe the typing box clean so they can immediately type the next tag
        setDraft("");
    };

  // Remove a tag (called when X is clicked or Backspace on empty input)
  const removeTag = (index) => {
    // Keep every tag EXCEPT the one whose position (index) matches the one being deleted
    setTags(tags.filter((_, i) => i !== index));

    // Force the browser to put the blinking cursor back into the typing box
    inputRef.current?.focus();
  };

  // Keyboard handling: Enter and comma both add, Backspace removes last
  const handleKeyDown = (e) => {
    if(e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        // Try to turn whatever they typed into a tag
        addTag(draft);
    } 
    // If a user clicks backspace, and the type box is empty, and there's at least 1 tag
    // Delete the very last tag in the list 
    else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
        removeTag(tags.length - 1);
    }
  }  

    // This runs if the user clicks somewhere else on the page
   const handleBlur = () => {
    // If they typed something but forgot to hit Enter, automatically turn it into a tag for them
    if (draft.trim()) addTag(draft);
  };

  return (
    <div>
        {/* Hidden input that the form submits — comma-joined string */}
        <input type="hidden" name={name} value={tags.join(",")} />

        {/* The visible chip area, looks like a single input */}
        <div
            onClick={() => inputRef.current?.focus()}
            className="flex flex-wrap gap-2 items-center bg-[#111] border border-white/10 rounded-lg p-2 min-h-[44px] cursor-text focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors"
        >
            {/* Render existing tags as chips */}
            {tags.map((tag, i) => {
                <span
                    key={`${tag}-${i}`} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-md text-xs font-bold text-white"
                >
                  <Tag size={10} className="text-primary" />
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeTag(i);
                    }} 
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={12} />
                    </button>  
                </span>
            })}
            {/* Live text input for typing the next tag */}
            <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 px-1"
            />
            </div>   
             {/* Helpful hint */}
            <p className="text-xs text-gray-500 mt-2">
                Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">Enter</kbd> or{" "}
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">,</kbd> to add.{" "}
                {tags.length}/{maxTags} tags.
            </p>     
       </div>
  )
}

export default TagInput