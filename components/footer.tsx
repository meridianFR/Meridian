import Link from "next/link";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Produit",
    links: [
      { href: "/strategies", label: "Stratégies" },
      { href: "/outils", label: "Outils" },
      { href: "/journal", label: "Journal" },
      { href: "/formation", label: "Formation" },
    ],
  },
  {
    title: "Marque",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/a-propos", label: "À propos" },
      { href: "/ecosysteme", label: "Écosystème" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgv", label: "CGV" },
      { href: "/disclaimer-financier", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-40 border-t border-border bg-black z-10 overflow-hidden">
      {/* liseré lumineux sur l'arête supérieure */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-2 to-transparent" />
      {/* halo discret */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,255,255,0.035), transparent 70%)",
        }}
      />

      <div className="max-w-wrap mx-auto px-6 sm:px-10 pt-20 pb-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="group text-[15px] font-semibold tracking-[-0.02em] text-white"
            >
              Meridian
              <span className="text-ink-muted ml-0.5 inline-block transition-transform duration-500 group-hover:rotate-180">
                °
              </span>
            </Link>
            <p className="text-ink-mute text-sm mt-4 max-w-xs leading-relaxed">
              Outils et stratégies pour traders qui veulent durer, pas exploser.
            </p>
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mt-7">
              ° Outils &amp; stratégies · v0.1
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-5">
                  {col.title}
                </div>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="link-underline inline-block py-1 text-sm text-ink-mute"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* wordmark fantôme — signature éditoriale, bord bas effleuré */}
        <div
          aria-hidden
          className="select-none pointer-events-none font-extrabold tracking-tightest leading-[0.8] text-white/[0.04] text-[clamp(72px,15vw,220px)] -mb-4 md:-mb-8"
        >
          Meridian°
        </div>

        <div className="pt-8 border-t border-border">
          <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink-faint leading-relaxed max-w-3xl">
            Meridian ne fournit aucun conseil en investissement. Contenu pédagogique uniquement.
            Le trading comporte un risque de perte en capital. Les performances passées ne préjugent
            pas des performances futures.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-4 mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
          <span>© 2026 Meridian °</span>
          <Link href="/legal" className="link-underline">
            Mentions · CGV · Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
