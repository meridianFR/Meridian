import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/seo";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools" });
  return {
    alternates: alternatesFor(locale, "/outils"),
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type Tool = {
  num: string;
  name: string;
  category: string;
  desc: string;
  href: string;
  status: "live" | "soon" | "paid";
  statusLabel: string;
  statusClass: string;
  features: string[];
};

export default async function Page() {
  const t = await getTranslations("Tools");

  const freeTools: Tool[] = [
    {
      num: "01",
      name: t("calcName"),
      category: t("calcCategory"),
      desc: t("calcDesc"),
      href: "/outils/calculateur-position",
      status: "live",
      statusLabel: t("statusLive"),
      statusClass: "pill-green",
      features: t.raw("calcFeatures") as string[],
    },
  ];

  const paidTool: Tool = {
    num: "02",
    name: t("journalName"),
    category: t("journalCategory"),
    desc: t("journalDesc"),
    href: "/journal",
    status: "paid",
    statusLabel: t("statusPaid"),
    statusClass: "pill-white",
    features: t.raw("journalFeatures") as string[],
  };

  return (
    <main className="relative">
      <div className="radial-glow absolute inset-x-0 top-0 h-[560px] pointer-events-none" />

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <span className="h-eyebrow">{t("eyebrow")}</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="h-title text-[44px] sm:text-[64px] lg:text-[80px] mt-4 max-w-4xl text-white">
              {t("title1")}
              <br />
              <span className="shimmer">{t("title2")}</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-7 max-w-2xl text-[17px] text-ink-mute leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <span className="h-eyebrow">{t("freeSection")}</span>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {t("oneTool")}
              </span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {freeTools.map((tool, i) => (
              <Reveal key={tool.href} delay={i * 100}>
                <ToolCard tool={tool} useLabel={t("useTool")} learnLabel={t("learnMore")} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 lg:pb-28">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <span className="h-eyebrow">{t("paidSection")}</span>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {t("oneTool")}
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href={paidTool.href}
              className="card rounded-2xl p-7 lg:p-10 block group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
                      {paidTool.num}
                    </span>
                    <span className={`pill ${paidTool.statusClass}`}>{paidTool.statusLabel}</span>
                    <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {paidTool.category}
                    </span>
                  </div>
                  <h2 className="text-[28px] lg:text-[36px] text-white font-semibold tracking-tight">
                    {paidTool.name}
                  </h2>
                  <p className="mt-4 text-[15px] lg:text-[16px] text-ink-mute leading-relaxed max-w-2xl">
                    {paidTool.desc}
                  </p>
                </div>
                <div className="lg:col-span-4">
                  <ul className="space-y-2">
                    {paidTool.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-[13px] text-ink-mute"
                      >
                        <span className="mono text-ink-faint">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-white/80 group-hover:text-white transition-colors">
                    {t("discover")}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative py-16 lg:py-20 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="h-eyebrow">{t("ruleEyebrow")}</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[28px] lg:text-[36px] mt-4 text-white">
                  {t("ruleTitle1")}
                  <br />
                  <span className="shimmer">{t("ruleTitle2")}</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={160}>
                <p className="text-[15px] lg:text-[16px] text-ink-mute leading-relaxed">
                  {t("ruleText")}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  tool,
  useLabel,
  learnLabel,
}: {
  tool: Tool;
  useLabel: string;
  learnLabel: string;
}) {
  const isLive = tool.status === "live";

  return (
    <Link
      href={tool.href}
      className="pillar-card bg-black p-7 lg:p-10 block group hover:bg-[#070707] h-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              {tool.num}
            </span>
            <span className={`pill ${tool.statusClass}`}>{tool.statusLabel}</span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {tool.category}
            </span>
          </div>

          <h3 className="text-[28px] lg:text-[36px] text-white font-semibold tracking-tight">
            {tool.name}
          </h3>

          <p className="mt-4 text-[15px] lg:text-[16px] text-ink-mute leading-relaxed max-w-2xl">
            {tool.desc}
          </p>
        </div>

        <div className="lg:col-span-4">
          <ul className="space-y-2">
            {tool.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-[13px] text-ink-mute"
              >
                <span className="mono text-ink-faint">·</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <span
            className={`mt-6 inline-flex items-center gap-1.5 text-[13px] transition-colors ${
              isLive ? "text-white/90 group-hover:text-white" : "text-ink-mute group-hover:text-white"
            }`}
          >
            {isLive ? useLabel : learnLabel}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
