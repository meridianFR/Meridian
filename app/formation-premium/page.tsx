import Link from "next/link";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { Reveal } from "@/components/reveal";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";

export const metadata = {
  title: "Formation — direction premium (test)",
  description:
    "Page test : exploration d'une direction design « formation premium » dans le branding Meridian.",
};

/* ------------------------------------------------------------------ data */

const MODULES = [
  {
    n: "01",
    title: "Fondamentaux de marché",
    meta: "6 leçons · 1h40",
    desc: "Lecture de structure, contexte, régimes. Construire une grille d'analyse stable, indépendante de l'humeur du jour.",
    lessons: ["Structure & swing points", "Régimes de marché", "Zones de liquidité", "Cartographier un graphique"],
  },
  {
    n: "02",
    title: "Stratégies & configurations",
    meta: "9 leçons · 2h55",
    desc: "Les configurations génériques, documentées : entrée, invalidation, objectif. Savoir pourquoi tu entres — et où tu sors.",
    lessons: ["Breakout de range", "Pullback de tendance", "Mean reversion", "Anatomie d'un setup"],
  },
  {
    n: "03",
    title: "Risque & taille de position",
    meta: "7 leçons · 2h10",
    desc: "Sizing, stop, drawdown, R. Ce qui sépare le trader qui dure de celui qui explose son compte sur un trade.",
    lessons: ["Penser en R", "Calibrer son lot", "Traverser un drawdown", "Risque de corrélation"],
  },
  {
    n: "04",
    title: "Exécution & psychologie",
    meta: "8 leçons · 2h30",
    desc: "Transformer un plan en gestes répétables. Identifier ses biais, neutraliser le tilt, exécuter sans bruit.",
    lessons: ["Construire un process", "FOMO, revenge, tilt", "Routine pré-marché", "Décider sous incertitude"],
  },
  {
    n: "05",
    title: "Journal & audit",
    meta: "6 leçons · 1h50",
    desc: "Mesurer ce que tu fais vraiment. Isoler ton edge, corriger tes fuites, décider sur des bases mesurables.",
    lessons: ["Un journal exploitable", "Lire ses statistiques", "Identifier son edge", "L'audit 100 trades"],
  },
  {
    n: "06",
    title: "Construire sa méthode",
    meta: "6 leçons · 2h05",
    desc: "Assembler les briques en un plan écrit. Backtester, valider sur trois régimes, et tenir dans la durée.",
    lessons: ["Écrire son plan", "Backtest manuel", "Valider une edge", "Plan de progression"],
  },
];

const OUTCOMES = [
  "Lire la structure d'un marché sans t'enterrer sous les indicateurs",
  "Calibrer ton risque au lot près, à chaque trade",
  "Documenter une configuration réellement tradable",
  "Tenir un journal qui se transforme en décisions",
  "Isoler ton edge sur un échantillon de 100 trades",
  "Backtester une stratégie manuellement, proprement",
  "Écrire un plan de trading complet, noir sur blanc",
  "Repérer et neutraliser tes biais récurrents",
];

const INCLUDED = [
  { t: "42 leçons vidéo", d: "≈ 13h, format court et dense. Pas de remplissage." },
  { t: "Supports PDF", d: "Fiches, schémas et checklists téléchargeables." },
  { t: "Accès aux outils", d: "Le Journal et le calculateur Meridian, inclus." },
  { t: "Modèles prêts", d: "Plan de trading, journal, audit 100 trades." },
  { t: "Mises à jour", d: "Le programme évolue, ton accès suit." },
  { t: "Support par email", d: "Une question sur un module ? On répond." },
];

const NOT_THIS = ["Des signaux à recopier", "Une promesse de revenus", "Une recette magique", "Un groupe Telegram surchauffé"];
const BUT_THIS = ["Une méthode structurée", "Des outils que tu mesures", "De la discipline, pas de la chance", "Des bases qui durent"];

const PRICE_INCLUDES = [
  "Les 6 modules · 42 leçons",
  "Tous les supports PDF & modèles",
  "Accès au Journal & au calculateur",
  "Mises à jour à vie",
  "Garantie 14 jours",
];

const FAQ: FaqItem[] = [
  {
    q: "Est-ce que cette formation garantit des gains ?",
    a: "Non. Aucune formation sérieuse ne peut le faire, et personne ne devrait te le promettre. Meridian t'apprend une méthode et te donne les outils pour mesurer ce que tu fais. Le résultat dépend de ton travail et de ta discipline — pas d'un raccourci.",
  },
  {
    q: "Pour quel niveau ?",
    a: "Du débutant sérieux au trader intermédiaire qui veut structurer une approche dispersée. Si tu cherches un bouton magique, ce n'est pas le bon endroit.",
  },
  {
    q: "Quels marchés, quelles plateformes ?",
    a: "La méthode est générique : indices, forex, futures. Les outils sont pensés pour MT4/MT5 et les prop firms, mais les principes s'appliquent partout.",
  },
  {
    q: "Combien de temps pour tout suivre ?",
    a: "Environ 13h de vidéo, mais ce n'est pas une course. Compte plutôt quelques semaines en appliquant chaque module sur ton propre journal.",
  },
  {
    q: "Y a-t-il une garantie ?",
    a: "Oui, 14 jours. Si le contenu ne correspond pas à ce qui est décrit ici, tu es remboursé, sans discussion.",
  },
];

/* ------------------------------------------------------------------ primitives */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">{children}</div>;
}

/* ------------------------------------------------------------------ page */

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ============================================ HERO */}
      <section className="relative pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden">
        <AmbientOrbs />
        <div
          className="absolute inset-x-0 top-0 h-[620px] pointer-events-none -z-10"
          style={{ background: "radial-gradient(ellipse 55% 50% at 50% 0%, rgba(255,255,255,0.07), transparent 70%)" }}
        />

        <div className="max-w-wrap mx-auto px-6 sm:px-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-9 fade-in">
                <Eyebrow>° Formation Meridian</Eyebrow>
                <span className="pill pill-green">Programme 2026</span>
              </div>

              <h1 className="h-title text-[44px] sm:text-[60px] md:text-[76px] fade-in-up">
                Devenir un trader
                <br />
                <span className="shimmer">méthodique.</span>
              </h1>

              <p className="text-ink-mute text-base md:text-lg max-w-xl mt-9 leading-relaxed fade-in-up-2">
                Un programme complet, sans promesse de revenus ni recette magique. La méthode, les outils
                et la discipline pour comprendre ce que tu trades — et le mesurer, trade après trade.
              </p>

              <div className="flex flex-wrap gap-3 mt-11 fade-in-up-3">
                <Link href="#inscription" className="btn btn-primary">
                  Rejoindre la formation
                </Link>
                <Link href="#programme" className="btn btn-ghost">
                  Explorer le programme
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border fade-in-up-3">
                {[
                  { k: "Modules", v: "6" },
                  { k: "Leçons", v: "42" },
                  { k: "Durée", v: "≈13h" },
                  { k: "Niveau", v: "Déb.→Int." },
                ].map((s) => (
                  <div key={s.k} className="bg-black px-5 py-4">
                    <div className="mono text-[9px] uppercase tracking-[0.3em] text-ink-faint">{s.k}</div>
                    <div className="text-lg font-semibold mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte programme — objet premium */}
            <div className="lg:col-span-5 fade-in-up-2">
              <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">Le programme</span>
                  <span className="mono text-[10px] text-ink-faint">06 modules</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-border divide-y divide-border">
                  {MODULES.slice(0, 5).map((m) => (
                    <div key={m.n} className="flex items-center gap-4 px-4 py-3 bg-black/60">
                      <span className="mono text-[11px] text-ink-faint w-6 shrink-0">{m.n}</span>
                      <span className="text-[13px] text-ink flex-1 truncate">{m.title}</span>
                      <span className="mono text-[10px] text-ink-faint shrink-0">{m.meta.split(" · ")[1]}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.03]">
                    <span className="mono text-[11px] text-ink-faint w-6 shrink-0">06</span>
                    <span className="text-[13px] text-ink-mute flex-1">+ 1 module · construire sa méthode</span>
                    <span className="mono text-[10px] text-ink-faint shrink-0">2h05</span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-6 pt-5 border-t border-border">
                  <div>
                    <div className="mono text-[9px] uppercase tracking-[0.3em] text-ink-faint mb-1.5">Accès complet</div>
                    <div className="text-3xl font-semibold tracking-tight">
                      390 €<span className="text-ink-faint text-base font-normal"> </span>
                    </div>
                    <div className="mono text-[10px] text-ink-faint mt-1">paiement unique · accès à vie</div>
                  </div>
                  <span className="pill pill-white">Garantie 14j</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ PHILOSOPHIE */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 25% 40%, rgba(255,255,255,0.04), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal as="div" className="lg:col-span-5">
              <Eyebrow>° La promesse</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                Sans hype.
                <br />
                <span className="shimmer">Une discipline.</span>
              </h2>
              <p className="text-ink-mute text-sm leading-relaxed mt-6 max-w-sm">
                La plupart des formations vendent un rêve. Celle-ci vend un métier : lent, mesurable,
                répétable. C'est exactement ce qui la rend premium.
              </p>
            </Reveal>

            <Reveal as="div" className="lg:col-span-7" delay={120}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="card rounded-2xl p-7">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-risk/80 mb-5">Ce que ce n&apos;est pas</div>
                  <ul className="space-y-3.5">
                    {NOT_THIS.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm text-ink-mute">
                        <span className="text-risk mt-0.5 shrink-0">✕</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card rounded-2xl p-7">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge/80 mb-5">Ce que c&apos;est</div>
                  <ul className="space-y-3.5">
                    {BUT_THIS.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm text-ink">
                        <span className="text-edge mt-0.5 shrink-0">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================ PROGRAMME */}
      <section id="programme" className="relative py-24 md:py-36 border-t border-border scroll-mt-24 overflow-hidden">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
              <div>
                <Eyebrow>° Le programme</Eyebrow>
                <h2 className="h-title text-4xl md:text-5xl mt-5 max-w-2xl">
                  Six modules,
                  <br />
                  <span className="shimmer">une progression.</span>
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                Chaque module se suffit à lui-même mais s'emboîte dans le suivant. On part de la lecture
                de marché, on finit avec un plan écrit que tu peux trader.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5">
            {MODULES.map((m, i) => (
              <Reveal key={m.n} delay={i * 80}>
                <div className="card rounded-2xl p-7 md:p-9 group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                    <div className="md:col-span-4 flex items-start gap-5">
                      <span className="mono text-3xl md:text-4xl text-ink-faint/60 group-hover:text-ink-mute transition-colors leading-none">
                        {m.n}
                      </span>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{m.title}</h3>
                        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mt-2">{m.meta}</div>
                      </div>
                    </div>

                    <p className="md:col-span-4 text-ink-mute text-sm leading-relaxed">{m.desc}</p>

                    <div className="md:col-span-4 flex flex-wrap gap-2 md:justify-end">
                      {m.lessons.map((l) => (
                        <span key={l} className="pill">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ OUTCOMES */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 75% 40%, rgba(255,255,255,0.04), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <Eyebrow>° À la sortie</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                Ce que tu sauras
                <br />
                <span className="shimmer">faire, concrètement.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {OUTCOMES.map((o, i) => (
              <Reveal key={o} as="div" delay={(i % 2) * 80}>
                <div className="bg-black p-7 flex items-start gap-4 h-full hover:bg-[#070707] transition-colors">
                  <span className="mono text-[11px] text-ink-faint mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] leading-relaxed text-ink">{o}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ INCLUS */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <Eyebrow>° Le format</Eyebrow>
                <h2 className="h-title text-4xl md:text-5xl mt-5 max-w-2xl">
                  Tout est <span className="shimmer">inclus.</span>
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                Un accès unique, des ressources concrètes, et les outils Meridian pour appliquer
                immédiatement ce que tu apprends.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED.map((it, i) => (
              <Reveal key={it.t} delay={(i % 3) * 90}>
                <div className="card rounded-2xl p-7 h-full">
                  <span className="text-edge text-sm">✓</span>
                  <div className="text-lg font-semibold tracking-tight mt-4 mb-2">{it.t}</div>
                  <p className="text-ink-mute text-sm leading-relaxed">{it.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ INSCRIPTION / PRICING */}
      <section id="inscription" className="relative py-24 md:py-36 border-t border-border scroll-mt-24 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,255,255,0.06), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Eyebrow>° Inscription</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                Rejoindre la <span className="shimmer">formation.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="glow-border glow-border-live rounded-3xl bg-black/50 backdrop-blur-sm p-8 md:p-12 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="pill pill-white">Accès complet</span>
                  <div className="mt-6 flex items-end gap-3">
                    <span className="text-6xl font-semibold tracking-tighter">390 €</span>
                    <span className="text-ink-faint text-sm mb-2 line-through">590 €</span>
                  </div>
                  <p className="mono text-[11px] text-ink-faint mt-3">Paiement unique · accès à vie · TVA incluse</p>

                  <div className="mt-8 flex flex-col gap-3">
                    <Link href="#" className="btn btn-primary justify-center text-[15px] py-3.5">
                      Rejoindre la formation
                    </Link>
                    <p className="text-center mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      Garantie 14 jours · sans abonnement
                    </p>
                  </div>
                </div>

                <div className="md:border-l md:border-border md:pl-10">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-5">Ce qui est inclus</div>
                  <ul className="space-y-3.5">
                    {PRICE_INCLUDES.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm text-ink">
                        <span className="text-edge mt-0.5 shrink-0">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <p className="text-center text-ink-faint text-xs mt-8 max-w-xl mx-auto leading-relaxed">
            Meridian ne fournit aucun conseil en investissement. Contenu pédagogique uniquement. Le trading
            comporte un risque de perte en capital.
          </p>
        </div>
      </section>

      {/* ============================================ FAQ */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal as="div" className="lg:col-span-4">
              <Eyebrow>° FAQ</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                Questions
                <br />
                <span className="shimmer">fréquentes.</span>
              </h2>
            </Reveal>
            <Reveal as="div" className="lg:col-span-8" delay={120}>
              <FaqAccordion items={FAQ} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================ CTA FINAL */}
      <section className="relative py-28 md:py-40 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.05), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10 text-center">
          <Reveal>
            <h2 className="h-title text-4xl md:text-6xl max-w-3xl mx-auto">
              Trade ce que tu <span className="shimmer">mesures.</span>
            </h2>
            <p className="text-ink-mute max-w-xl mx-auto mt-6 leading-relaxed">
              La discipline ne s'improvise pas, elle s'apprend. Commence par les bonnes fondations.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="#inscription" className="btn btn-primary">
                Rejoindre la formation
              </Link>
              <Link href="/strategies" className="btn btn-ghost">
                Voir les stratégies
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
