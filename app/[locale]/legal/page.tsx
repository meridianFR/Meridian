import Link from "next/link";

export const metadata = {
  title: "Légal",
  description:
    "Mentions légales, CGV et disclaimer financier de Meridian °. Contenu pédagogique uniquement.",
};

const SECTIONS = [
  {
    eyebrow: "01",
    title: "Mentions légales",
    desc: "Éditeur, hébergeur, propriété intellectuelle, contact.",
    href: "/mentions-legales",
  },
  {
    eyebrow: "02",
    title: "Conditions générales",
    desc: "Conditions d'utilisation du site et des produits Meridian.",
    href: "/cgv",
  },
  {
    eyebrow: "03",
    title: "Disclaimer financier",
    desc: "Aucun conseil en investissement. Risques liés au trading. AMF.",
    href: "/disclaimer-financier",
  },
];

export default function Page() {
  return (
    <main className="relative pt-40 pb-32">
      <div className="max-w-wrap mx-auto px-6 sm:px-10">
        <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-10">
          ° Légal
        </div>

        <h1 className="h-title text-5xl md:text-7xl max-w-3xl mb-8">
          Informations
          <br />
          <span className="shimmer">légales.</span>
        </h1>

        <p className="text-ink-mute text-lg max-w-2xl leading-relaxed mb-20">
          Meridian est un site pédagogique. Il ne propose ni conseil en investissement,
          ni gestion de portefeuille, ni service de signaux. Les documents ci-dessous
          encadrent l'usage de ce site et des produits associés.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-black p-8 md:p-10 hover:bg-[#070707] transition-colors group"
            >
              <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-5">
                {s.eyebrow}
              </div>
              <div className="text-xl font-semibold tracking-tight mb-3">{s.title}</div>
              <p className="text-ink-mute text-sm leading-relaxed mb-6">{s.desc}</p>
              <span className="text-[13px] text-white/70 group-hover:text-white transition-colors">
                Lire →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-20 border-t border-border pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint leading-relaxed max-w-3xl">
            En naviguant sur ce site, vous reconnaissez avoir pris connaissance de ces documents.
            Le trading comporte un risque de perte en capital pouvant aller jusqu'à la totalité
            des sommes engagées.
          </p>
        </div>
      </div>
    </main>
  );
}
