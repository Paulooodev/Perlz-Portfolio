// ============================================================================
// Admin Dashboard (home page of /admin)
// Server component — fetches counts on the server, no useEffect.
// ============================================================================

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Music2, Package, Plus, EyeOff } from "lucide-react";

const AdminDashboard = async () => {
  const supabase = await createClient();

  // Fetch beat + pack counts in parallel (faster than sequential awaits)
  const [beatsResult, packsResult] = await Promise.all([
    supabase.from("beats").select("id, is_published", { count: "exact" }),
    supabase.from("packs").select("id, is_published", { count: "exact" }),
  ]);

  const beats = beatsResult.data ?? [];
  const packs = packsResult.data ?? [];

  const stats = [
    {
      label: "Beats Published",
      value: beats.filter((b) => b.is_published).length,
      total: beats.length,
      icon: Music2,
      href: "/admin/beats",
    },
    {
      label: "Packs Published",
      value: packs.filter((p) => p.is_published).length,
      total: packs.length,
      icon: Package,
      href: "/admin/packs",
    },
  ];

  return (
    // max-w-5xl caps the width on huge desktops.
    // No horizontal padding here — it's handled by AdminShell's <main>
    <div className="max-w-5xl">
      {/* ============ HEADER ============ */}
      {/* text-2xl base for mobile */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Manage your catalog. All changes go live immediately.
        </p>
      </div>

      {/* ============ STATS CARDS ============ */}
      {/* Single column on mobile, two on sm+. Smaller padding on mobile. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const hidden = stat.total - stat.value;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group bg-[#0a0a0a] border border-white/5 hover:border-primary/30 rounded-2xl p-5 sm:p-6 transition-colors"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="size-9 sm:size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon size={16} className="text-primary sm:hidden" />
                  <Icon size={18} className="text-primary hidden sm:block" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                  Manage →
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                {stat.label}
              </p>
              {/* text-3xl on mobile (was text-4xl, too big) */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-3xl sm:text-4xl font-black text-white">
                  {stat.value}
                </p>
                {hidden > 0 && (
                  <p className="text-[10px] sm:text-xs text-gray-500 font-mono">
                    +{hidden} hidden
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============ QUICK ACTIONS ============ */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">
          Quick Actions
        </h2>
        {/* Stack vertically on mobile (full-width buttons) — flex row at sm+ */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
          <Link
            href="/admin/beats/new"
            className="inline-flex items-center justify-center sm:justify-start gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
          >
            <Plus size={16} />
            Upload New Beat
          </Link>
          <Link
            href="/admin/packs/new"
            className="inline-flex items-center justify-center sm:justify-start gap-2 h-11 px-5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-colors"
          >
            <Plus size={16} />
            Upload New Pack
          </Link>
        </div>
      </div>

      {/* ============ TIPS ============ */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 sm:p-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <EyeOff size={14} className="text-primary" />
          Quick tips
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
          <li>
            Upload{" "}
            <span className="text-white font-bold">
              tagged preview clips only
            </span>{" "}
            (30–60s MP3). Never upload the full WAV.
          </li>
          <li>
            Artwork should be{" "}
            <span className="text-white font-bold">
              square, at least 1000×1000px
            </span>
            .
          </li>
          <li>
            Unpublish items instead of deleting if you want to hide them
            temporarily.
          </li>
          <li>
            Mark your best 3–6 beats as{" "}
            <span className="text-white font-bold">Featured</span> to appear at
            the top of the public showcase.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;