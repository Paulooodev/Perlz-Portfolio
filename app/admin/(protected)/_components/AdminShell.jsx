"use client";

// ============================================================================
// AdminShell — handles the responsive layout for admin pages.
// On desktop (lg+): persistent sidebar visible on the left
// On mobile: top bar with hamburger menu + slide-in drawer
// ============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Music2,
  Package,
  LayoutDashboard,
  ExternalLink,
  Menu,
  Youtube,
  X,
} from "lucide-react";
import SignOut from "./SignOut";
import Image from "next/image";
import Logo from "@/app/Assets/logo2.png";

export default function AdminShell({ children, userEmail }) {
  // Track whether the mobile drawer is open
  const [drawerOpen, setDrawerOpen] = useState(false);

  // pathname is used to highlight the active nav link
  const pathname = usePathname();

  // Close the drawer whenever the route changes (i.e. user clicks a nav link)
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open (prevents background scrolling)
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup in case component unmounts while drawer is open
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-midnight">
      {/* ============== MOBILE TOP BAR (visible below lg) ============== */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-[#0a0a0a] border-b border-white/5 backdrop-blur-xl">
        <Link href="/admin" className="flex items-baseline gap-2">
          <div className="relative size-30">
                <Image
                    src={Logo}
                    alt="Logo"
                    className="object-contain"
                    fill
                    placeholder="blur"
                />
            </div>
        </Link>

        <button
          onClick={() => setDrawerOpen(true)}
          className="size-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* ============== MOBILE DRAWER OVERLAY ============== */}
      {/* Dark backdrop behind the drawer */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`
          lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity
          ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      {/* The drawer itself, slides in from the right */}
      <aside
        className={`
          lg:hidden fixed top-0 right-0 z-50 h-screen w-72 bg-[#0a0a0a]
          border-l border-white/5 flex flex-col p-6
          transition-transform duration-300 ease-out
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="relative size-30">
                <Image
                    src={Logo}
                    alt="Logo"
                    className="object-contain"
                    fill
                    placeholder="blur"
                />
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="size-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <SidebarContent
          userEmail={userEmail}
          pathname={pathname}
        />
      </aside>

      {/* ============== DESKTOP SIDEBAR (visible at lg+) ============== */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-64 h-screen bg-[#0a0a0a] border-r border-white/5 flex-col p-6">
        <Link href="/admin" className="mb-10">
         <div className="relative size-30">
            <Image
                src={Logo}
                alt="Logo"
                className="object-contain"
                fill
                placeholder="blur"
            />
        </div>
        </Link>

        <SidebarContent userEmail={userEmail} pathname={pathname} />
      </aside>

      {/* ============== MAIN CONTENT ============== */}
      {/* Padding adjusted by viewport: mobile uses smaller, desktop has sidebar offset */}
      <main className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-12 py-6 lg:py-12">{children}</div>
      </main>
    </div>
  );
}


function SidebarContent({ userEmail, pathname }) {
  return (
    <>
      <nav className="flex flex-col gap-1">
        <NavLink href="/admin" icon={LayoutDashboard} pathname={pathname} exact>
          Dashboard
        </NavLink>
        <NavLink href="/admin/beats" icon={Music2} pathname={pathname}>
          Beats
        </NavLink>
        <NavLink href="/admin/packs" icon={Package} pathname={pathname}>
          Packs
        </NavLink>
        <NavLink href="/admin/breakdowns" icon={Youtube} pathname={pathname}>
          Breakdowns
        </NavLink>
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition-colors"
        >
          <ExternalLink size={12} />
          View Public Site
        </Link>
        <div className="text-xs">
          <p className="text-gray-500 mb-1">Signed in as</p>
          <p className="text-white font-bold truncate" title={userEmail}>
            {userEmail}
          </p>
        </div>
        <SignOut />
      </div>
    </>
  );
}

// ============================================================================
// NavLink — highlights when active
// `exact` prop = only match exact path (for Dashboard which is /admin)
//                vs Beats (/admin/beats AND /admin/beats/new etc)
// ============================================================================
function NavLink({ href, icon: Icon, children, pathname, exact = false }) {
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }
      `}
    >
      <Icon size={16} />
      {children}
    </Link>
  );
}