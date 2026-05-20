"use client";
import { useState, useTransition } from 'react';
import Link from "next/link";
import { Save, ArrowLeft, AlertCircle, Loader2, Youtube } from "lucide-react";

const BreakdownForm = ({
  action,
  breakdownId = null,
  defaultValues = {},
  submitLabel = "Save Breakdown",
}) => {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
        const result = await action(formData);
        if (result?.error) setError(result.error);
        });
    };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
        {breakdownId && <input type="hidden" name="id" value={breakdownId} />}

        {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
            href="/admin/breakdowns"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
            <ArrowLeft size={14} />
            Back to breakdowns
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold transition-colors"
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

        {error && (
            <div className="mb-6 flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
            </div>
        )}

        {/* Form fields */}
        <div className="flex flex-col gap-5">
            <Field label="Title" required hint="The headline that appears on the card">
                <input
                    type="text"
                    name="title"
                    required
                    defaultValue={defaultValues.title || ""}
                    placeholder="e.g. Producing 'Pampay' from scratch"
                    className="form-input"
                />
            </Field>

            <Field
                label="YouTube URL"
                required
                hint="Paste the full video URL. Any format works."
            >
                <div className="relative">
                   <input
                      type="url"
                      name="youtube_url"
                      required
                      defaultValue={defaultValues.youtube_url || ""}
                      placeholder="https://youtube.com/watch?v=..."
                      className="form-input pl-9"
                    /> 
                </div>
            </Field>

            <Field label="Description" hint="Optional. 1-2 sentences shown beneath the title.">
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={defaultValues.description || ""}
                    placeholder="Walking through the drum pattern, melody, and arrangement of this Afrobeats record."
                    className="form-input resize-none"
                />
            </Field>

            <Field label="Duration" hint="Optional. e.g. '12:34' — appears on the card as a hint.">
                <input
                    type="text"
                    name="duration"
                    defaultValue={defaultValues.duration || ""}
                    placeholder="12:34"
                    className="form-input max-w-[200px]"
                />
            </Field>

            {/* Toggles */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <Toggle
                    name="is_featured"
                    label="Featured"
                    hint="Highlight at the top of the homepage section"
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

      <style jsx>{`
        .form-input {
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
        }
      `}</style>        
    </form>
  )
}

export default BreakdownForm;

function Field({ label, required, hint, children }) {
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
    );
}