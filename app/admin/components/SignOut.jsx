"use client"
import React from 'react';
import { useTransition } from "react";
import { signOut } from '../login/actions';
import { LogOut } from "lucide-react";

export default function SignOut() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
          await supabase.auth.signOut();
          router.push("/admin/login");
          router.refresh();
      };

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-400 disabled:opacity-50 transition-colors w-fit"
    >
      <LogOut size={12} />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}