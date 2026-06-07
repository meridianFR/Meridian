"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { mapTrade } from "./queries";
import { DEFAULT_SETUPS, type Account, type Direction, type Flag, type Trade, type TradeInput } from "./types";

/**
 * Server Actions du journal — toutes les mutations passent par ici.
 * Sécurité : authentification obligatoire, validation/assainissement de TOUTES
 * les entrées (le client n'est jamais cru), écritures scopées à l'utilisateur
 * (user_id) et propriété du compte vérifiée. RLS Postgres en second rempart.
 */

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

/* eslint-disable @typescript-eslint/no-explicit-any */

async function requireUser(): Promise<{ supabase: SupabaseClient; user: User } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

async function ownsAccount(supabase: SupabaseClient, userId: string, accountId: string): Promise<boolean> {
  const { data } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", accountId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

/* ------------------------------------------------------------------ validation */

const DIRECTIONS = new Set<Direction>(["long", "short"]);
const FLAGS = new Set<Flag>(["conforme", "partiel", "horsplan"]);
const AT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

function toNum(v: unknown, def = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : def;
}

function sanitizeTradeInput(raw: any): TradeInput | null {
  if (!raw || typeof raw !== "object") return null;

  let at = String(raw.at ?? "").trim();
  if (!AT_RE.test(at)) return null;
  if (at.length === 16) at += ":00";

  const instrument = String(raw.instrument ?? "").trim().toUpperCase().slice(0, 24);
  if (!instrument) return null;

  const direction = String(raw.direction ?? "");
  if (!DIRECTIONS.has(direction as Direction)) return null;

  const flag = String(raw.flag ?? "conforme");
  if (!FLAGS.has(flag as Flag)) return null;

  const emotion = Math.min(5, Math.max(1, Math.round(toNum(raw.emotion, 3))));
  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .filter((t: unknown) => typeof t === "string")
        .map((t: string) => t.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];
  const durationMin = raw.durationMin == null ? null : Math.max(0, Math.round(toNum(raw.durationMin, 0)));

  return {
    at,
    instrument,
    direction: direction as Direction,
    r: Number(toNum(raw.r, 0).toFixed(2)),
    setup: String(raw.setup ?? "").trim().slice(0, 60),
    flag: flag as Flag,
    entry: toNum(raw.entry, 0),
    exit: toNum(raw.exit, 0),
    size: Math.max(0, toNum(raw.size, 0)),
    tags,
    emotion,
    note: String(raw.note ?? "").slice(0, 1000),
    durationMin,
  };
}

function rowFrom(t: TradeInput, userId: string, accountId: string) {
  return {
    user_id: userId,
    account_id: accountId,
    traded_at: t.at,
    instrument: t.instrument,
    direction: t.direction,
    r: t.r,
    setup: t.setup,
    flag: t.flag,
    entry: t.entry,
    exit: t.exit,
    size: t.size,
    tags: t.tags,
    emotion: t.emotion,
    note: t.note,
    duration_min: t.durationMin,
    updated_at: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ comptes */

export async function createAccountAction(name: unknown): Promise<ActionResult<Account>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const clean = String(name ?? "").trim().slice(0, 60);
  if (!clean) return { ok: false, error: "Nom de compte requis." };

  const { data, error } = await ctx.supabase
    .from("accounts")
    .insert({ user_id: ctx.user.id, name: clean })
    .select("id, name, created_at")
    .single();
  if (error) return { ok: false, error: error.message };

  // Amorce les setups par défaut (ignorés si déjà présents).
  await ctx.supabase
    .from("setups")
    .upsert(
      DEFAULT_SETUPS.map((n) => ({ user_id: ctx.user.id, name: n })),
      { onConflict: "user_id,name", ignoreDuplicates: true },
    );

  revalidatePath("/app/journal");
  return { ok: true, data: { id: data.id, name: data.name, createdAt: data.created_at } };
}

/* ------------------------------------------------------------------ trades */

export async function createTradeAction(accountId: unknown, input: unknown): Promise<ActionResult<Trade>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const accId = String(accountId ?? "");
  const clean = sanitizeTradeInput(input);
  if (!clean) return { ok: false, error: "Trade invalide." };
  if (!(await ownsAccount(ctx.supabase, ctx.user.id, accId))) return { ok: false, error: "Compte introuvable." };

  const { data, error } = await ctx.supabase.from("trades").insert(rowFrom(clean, ctx.user.id, accId)).select("*").single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/app/journal");
  return { ok: true, data: mapTrade(data) };
}

export async function updateTradeAction(tradeId: unknown, input: unknown): Promise<ActionResult<Trade>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const id = String(tradeId ?? "");
  const clean = sanitizeTradeInput(input);
  if (!clean) return { ok: false, error: "Trade invalide." };

  const { user_id, account_id, ...patch } = rowFrom(clean, ctx.user.id, "");
  void user_id;
  void account_id;
  const { data, error } = await ctx.supabase
    .from("trades")
    .update(patch)
    .eq("id", id)
    .eq("user_id", ctx.user.id)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/app/journal");
  return { ok: true, data: mapTrade(data) };
}

export async function deleteTradeAction(tradeId: unknown): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const id = String(tradeId ?? "");
  const { error } = await ctx.supabase.from("trades").delete().eq("id", id).eq("user_id", ctx.user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/app/journal");
  return { ok: true, data: { id } };
}

const MAX_IMPORT = 5000;

export async function importTradesAction(accountId: unknown, drafts: unknown): Promise<ActionResult<{ count: number; trades: Trade[] }>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const accId = String(accountId ?? "");
  if (!Array.isArray(drafts)) return { ok: false, error: "Données d'import invalides." };
  if (drafts.length > MAX_IMPORT) return { ok: false, error: `Import limité à ${MAX_IMPORT} trades.` };
  if (!(await ownsAccount(ctx.supabase, ctx.user.id, accId))) return { ok: false, error: "Compte introuvable." };

  const rows = drafts.map((d) => sanitizeTradeInput(d)).filter((t): t is TradeInput => t !== null).map((t) => rowFrom(t, ctx.user.id, accId));
  if (!rows.length) return { ok: false, error: "Aucun trade valide à importer." };

  const { data, error } = await ctx.supabase.from("trades").insert(rows).select("*");
  if (error) return { ok: false, error: error.message };
  revalidatePath("/app/journal");
  const trades = (data ?? []).map(mapTrade);
  return { ok: true, data: { count: trades.length, trades } };
}

/* ------------------------------------------------------------------ setups */

export async function createSetupAction(name: unknown): Promise<ActionResult<{ name: string }>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const clean = String(name ?? "").trim().slice(0, 60);
  if (!clean) return { ok: false, error: "Nom de setup requis." };

  const { error } = await ctx.supabase
    .from("setups")
    .upsert({ user_id: ctx.user.id, name: clean }, { onConflict: "user_id,name", ignoreDuplicates: true });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/app/journal");
  return { ok: true, data: { name: clean } };
}

/* ------------------------------------------------------------------ revue hebdo */

export async function saveWeeklyReviewAction(
  accountId: unknown,
  weekStart: unknown,
  answers: unknown,
  disciplineScore: unknown,
): Promise<ActionResult<{ weekStart: string }>> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Non authentifié." };
  const accId = String(accountId ?? "");
  const wk = String(weekStart ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(wk)) return { ok: false, error: "Semaine invalide." };
  if (!(await ownsAccount(ctx.supabase, ctx.user.id, accId))) return { ok: false, error: "Compte introuvable." };

  const score = disciplineScore == null ? null : Math.min(10, Math.max(0, Math.round(toNum(disciplineScore, 0))));
  const safeAnswers = answers && typeof answers === "object" && !Array.isArray(answers) ? answers : {};

  const { error } = await ctx.supabase.from("weekly_reviews").upsert(
    {
      user_id: ctx.user.id,
      account_id: accId,
      week_start: wk,
      answers: safeAnswers,
      discipline_score: score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,account_id,week_start" },
  );
  if (error) return { ok: false, error: error.message };
  revalidatePath("/app/journal");
  return { ok: true, data: { weekStart: wk } };
}
