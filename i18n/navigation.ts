import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Versions « localisées » des API de navigation Next.
 *
 * - `Link` : ajoute automatiquement le préfixe de langue (`/en/...`, `/pt/...`)
 *   quand il le faut. À utiliser à la place de `next/link` pour les liens INTERNES.
 * - `usePathname` : renvoie le chemin SANS le préfixe de langue (`/app`, jamais
 *   `/en/app`) → pratique pour les états actifs et les tests de route.
 * - `useRouter` / `redirect` / `getPathname` : équivalents locale-aware.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
