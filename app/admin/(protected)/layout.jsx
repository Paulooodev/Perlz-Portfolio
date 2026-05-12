// ============================================================================
// Admin Layout
// Desktop: persistent left sidebar
// Mobile: top bar with hamburger that opens a slide-in drawer
// ============================================================================

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: "Admin — Perlz",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // The actual UI logic (sidebar/drawer state) lives in a client component
  // because it needs useState. We pass user info as a prop.
  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}

