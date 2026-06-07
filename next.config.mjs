import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */

// Branche le multilingue (next-intl). Pointe vers la config serveur i18n.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// En-têtes de sécurité appliqués à toutes les routes.
// CSP volontairement laissée de côté ici (étape ultérieure : nonce/middleware).
const isDev = process.env.NODE_ENV !== "production";

// Origine Supabase autorisée dans connect-src pour l'authentification côté
// navigateur (signInWithOtp). Calculée depuis l'env ; vide tant que non
// configurée — la CSP reste donc stricte par défaut.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseConnect = "";
try {
  if (supabaseUrl) {
    const u = new URL(supabaseUrl);
    supabaseConnect = ` ${u.origin} wss://${u.host}`;
  }
} catch {
  // URL invalide : on n'ouvre rien.
}

// CSP — quasi statique, aucun script tiers (Stripe = redirection, pas de JS). Sans nonce, les scripts inline
// de Next imposent 'unsafe-inline' (acceptable ici : aucun vecteur d'injection,
// tout le contenu vient du build, React échappe les sorties). On verrouille tout
// le reste. Dev : 'unsafe-eval' + ws/wss pour le HMR, et on n'impose ni
// frame-ancestors (laisse l'aperçu fonctionner) ni upgrade-insecure-requests (http local).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${supabaseConnect}${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'none'",
  // Le paiement : un form POST /api/checkout répond par une redirection 303 vers
  // Stripe — certains navigateurs vérifient form-action sur la cible de redirection.
  "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
  "frame-src 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["frame-ancestors 'none'", "upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  // Ne pas divulguer le framework
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
