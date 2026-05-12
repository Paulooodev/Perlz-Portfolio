"use client"
import { createClient } from "@supabase/supabase-js";
import { useTransition } from "react";
import { signOut } from "../../login/actions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
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