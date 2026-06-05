import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, Trade } from "./types";

/**
 * Lectures du journal (côté serveur, RLS respectée : l'utilisateur ne lit que
 * ses propres lignes). On filtre quand même explicitement par user_id.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapTrade(row: any): Trade {
  return {
    id: row.id,
    accountId: row.account_id,
    at: typeof row.traded_at === "string" ? row.traded_at.replace(" ", "T") : row.traded_at,
    instrument: row.instrument,
    direction: row.direction,
    r: Number(row.r ?? 0),
    setup: row.setup ?? "",
    flag: row.flag,
    entry: Number(row.entry ?? 0),
    exit: Number(row.exit ?? 0),
    size: Number(row.size ?? 0),
    tags: Array.isArray(row.tags) ? row.tags : [],
    emotion: Number(row.emotion ?? 3),
    note: row.note ?? "",
    durationMin: row.duration_min == null ? null : Number(row.duration_min),
  };
}

export async function getAccounts(supabase: SupabaseClient, userId: string): Promise<Account[]> {
  const { data } = await supabase
    .from("accounts")
    .select("id, name, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((a: any) => ({ id: a.id, name: a.name, createdAt: a.created_at }));
}

export async function getTrades(supabase: SupabaseClient, userId: string, accountId: string): Promise<Trade[]> {
  const { data } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .eq("account_id", accountId)
    .order("traded_at", { ascending: false });
  return (data ?? []).map(mapTrade);
}

export async function getSetups(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("setups")
    .select("name")
    .eq("user_id", userId)
    .order("name", { ascending: true });
  return (data ?? []).map((s: any) => s.name as string);
}

/** Liste des semaines déjà revues (week_start au format "YYYY-MM-DD"). */
export async function getReviewedWeeks(
  supabase: SupabaseClient,
  userId: string,
  accountId: string,
): Promise<string[]> {
  const { data } = await supabase
    .from("weekly_reviews")
    .select("week_start")
    .eq("user_id", userId)
    .eq("account_id", accountId);
  return (data ?? []).map((w: any) => w.week_start as string);
}
