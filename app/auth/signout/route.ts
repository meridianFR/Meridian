import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSameOrigin } from "@/lib/security";
import { SITE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Déconnexion (POST même-origine uniquement). */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origine invalide." }, { status: 403 });
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", SITE_URL), 303);
}
