# Paiement & accès abonné — guide d'installation

Ce document explique comment activer le paiement Stripe et l'accès gaté au Journal.
Le **code est déjà en place** ; il reste à créer les comptes externes (Supabase +
Stripe) et à renseigner les clés dans `.env.local`.

---

## 1. Architecture en bref

```
/journal (#tarifs) → clic offre → /abonnement?plan=…
   → (connexion magic link si besoin)
   → bouton « Payer » (form POST) → /api/checkout
   → Stripe Checkout (page hébergée Stripe)
   → succès → /app          (zone abonné, gatée)
   Stripe → /api/stripe/webhook → met à jour la table `subscriptions` (Supabase)
```

- **Identité** : Supabase Auth (lien magique, sans mot de passe).
- **Source de vérité de l'abonnement** : Stripe → synchronisé dans Supabase par le webhook.
- **Barrière d'accès** : `middleware.ts` + `app/app/layout.tsx` (double contrôle serveur,
  « fail closed » : tout doute = accès refusé).
- **Stripe Checkout hébergé** : aucune donnée de carte ne transite par notre site.

Tant que les clés ne sont pas renseignées, tout le site marketing fonctionne
normalement et `/app` redirige vers `/connexion` (barrière active par défaut).

---

## 2. Étape A — Supabase

1. Crée un projet sur https://supabase.com → **région UE** (ex. Frankfurt), cohérent
   avec la promesse « hébergement UE ».
2. **SQL Editor** → New query → exécute **les deux** fichiers (l'un après l'autre) :
   - [`supabase/schema.sql`](../supabase/schema.sql) → tables `profiles` / `subscriptions`, RLS, trigger d'inscription (paiement).
   - [`supabase/journal-schema.sql`](../supabase/journal-schema.sql) → tables `accounts` / `trades` / `setups` / `weekly_reviews` + RLS (le journal lui-même).
3. **Project Settings → API** → récupère :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - clé `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - clé `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`
4. **Authentication → URL Configuration** :
   - *Site URL* : `http://localhost:3000` (puis l'URL de prod plus tard).
   - *Redirect URLs* : ajoute `http://localhost:3000/auth/callback`
     (et `https://meridiandata.fr/auth/callback` pour la prod).
5. (Optionnel) **Authentication → Email Templates** : personnalise le mail de lien magique.

> En dev, Supabase peut limiter l'envoi d'emails. Pour tester sans email, tu peux
> activer un fournisseur SMTP, ou utiliser les liens de connexion depuis
> **Authentication → Users**.

---

## 3. Étape B — Stripe

1. Crée un compte sur https://stripe.com. Reste en **mode Test** (interrupteur en haut).
2. **Products** → *Add product* (à faire deux fois) :
   - **Meridian Journal — Mensuel** : prix **19 €**, récurrent **mensuel**.
   - **Meridian Journal — Annuel** : prix **190 €**, récurrent **annuel**.
   - Pour chaque produit, copie l'**ID de prix** (`price_…`, dans la section Pricing) :
     - mensuel → `STRIPE_PRICE_MONTHLY`
     - annuel → `STRIPE_PRICE_ANNUAL`
3. **Developers → API keys** → copie la **Secret key** (`sk_test_…`) → `STRIPE_SECRET_KEY`.
4. **Billing → Customer portal** → active le portail (Save) pour permettre la gestion /
   résiliation en libre-service (utilisé par « Gérer l'abonnement »).
5. **Webhook** :
   - En local : voir l'étape D (Stripe CLI fournit le secret).
   - En prod : **Developers → Webhooks → Add endpoint** →
     URL `https://meridiandata.fr/api/stripe/webhook`, événements :
     `checkout.session.completed`, `customer.subscription.created`,
     `customer.subscription.updated`, `customer.subscription.deleted`.
     Copie le **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.

---

## 4. Étape C — Variables d'environnement

```bash
cp .env.example .env.local
# puis édite .env.local avec les valeurs des étapes A et B
```

Redémarre le serveur de dev après toute modification de `.env.local`.

---

## 5. Étape D — Tester en local (webhooks)

Stripe ne peut pas joindre `localhost` directement : on relaie avec la **Stripe CLI**.

```bash
# 1. Installer + se connecter (une fois)
brew install stripe/stripe-cli/stripe
stripe login

# 2. Relayer les webhooks vers l'app (laisser tourner dans un terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook
# → affiche un "webhook signing secret" whsec_… : mets-le dans STRIPE_WEBHOOK_SECRET
#   (puis redémarre `npm run dev`)

# 3. Dans un autre terminal : lancer l'app
npm run dev
```

---

## 6. Checklist de test (bout en bout)

1. Visite `/app` **non connecté** → tu es redirigé vers `/connexion`. ✅ barrière OK
2. `/journal#tarifs` → clique **« Essayer le mensuel »** → `/abonnement?plan=monthly`.
3. Pas connecté → redirigé vers `/connexion` → entre ton email → ouvre le lien magique.
4. De retour sur `/abonnement` → **« Payer »** → page Stripe Checkout.
5. Carte de test : `4242 4242 4242 4242`, date future, CVC `123`, code postal quelconque.
6. Paiement validé → retour sur **`/app`** avec accès débloqué. ✅
   - Le terminal `stripe listen` doit montrer `checkout.session.completed` → 200.
   - Dans Supabase → Table editor → `subscriptions` : une ligne `status = active`.
7. **« Gérer l'abonnement »** → portail Stripe → **Annuler** → de retour sur `/app`.
   - À la fin de période (ou immédiatement selon le réglage), `/app` redirige vers
     `/abonnement`. ✅ accès retiré
8. Cartes d'échec utiles : `4000 0000 0000 0002` (refusée),
   `4000 0025 0000 3155` (3D Secure).

---

## 7. Sécurité (déjà implémenté)

- **Double barrière serveur** : `middleware.ts` + `app/app/layout.tsx`. Le client n'est
  jamais une source de vérité.
- **Webhook signé** : signature Stripe vérifiée sur le corps brut ; rejet sinon. Traitement
  idempotent (re-synchronise l'état réel).
- **Secrets côté serveur uniquement** : `SUPABASE_SERVICE_ROLE_KEY` et clés Stripe ne sont
  jamais exposés au navigateur (`import "server-only"`).
- **RLS Postgres** : lecture limitée à ses propres lignes ; aucune écriture client sur
  `subscriptions`.
- **/api/checkout** : POST même-origine (anti-CSRF), auth requise, offre validée contre une
  allowlist (jamais de prix venant du client), client Stripe rattaché à l'utilisateur.
- **Anti open-redirect** sur le paramètre `next` (connexion / callback).
- **CSP stricte** maintenue (ajout minimal : origine Supabase en `connect-src`, domaines
  Stripe en `form-action`).
- **Cookies** httpOnly / secure / sameSite (via `@supabase/ssr`).

### Recommandé pour la prod
- **Rate-limiting** sur `/api/checkout` et l'envoi de liens magiques (ex. Upstash Ratelimit).
  Supabase limite déjà l'envoi d'emails, mais une limite applicative est conseillée.
- Surveiller les **webhooks** dans le dashboard Stripe (réessais, échecs).

---

## 8. Passage en production

1. `NEXT_PUBLIC_SITE_URL=https://meridiandata.fr`.
2. Bascule Stripe en **mode Live**, recrée les 2 prix, récupère les clés `sk_live_…`.
3. Crée l'endpoint webhook **prod** (`/api/stripe/webhook`) → `whsec_…` live.
4. Ajoute l'URL de redirection **prod** dans Supabase (`/auth/callback`).
5. Renseigne les variables d'env sur l'hébergeur (Vercel : Project → Settings → Environment
   Variables). **Ne jamais** mettre `SUPABASE_SERVICE_ROLE_KEY` / `STRIPE_SECRET_KEY` en
   `NEXT_PUBLIC_`.
