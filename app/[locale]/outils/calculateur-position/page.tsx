import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Calculator } from "./Calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Calc" });
  return {
    alternates: { canonical: "/outils/calculateur-position" },
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
    },
  };
}

type Method = { num: string; title: string; body: string };
type Faq = { q: string; a: string };

export default async function Page() {
  const t = await getTranslations("Calc");
  const method = t.raw("method") as Method[];
  const faq = t.raw("faq") as Faq[];

  return (
    <main className="relative">
      <div className="radial-glow absolute inset-x-0 top-0 h-[600px] pointer-events-none" />

      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <Link
              href="/outils"
              className="mono text-[11px] uppercase tracking-[0.3em] text-ink-faint hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <span>←</span> {t("backToTools")}
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <Reveal delay={80}>
                <span className="h-eyebrow">{t("heroEyebrow")}</span>
              </Reveal>
              <Reveal delay={140}>
                <h1 className="h-title text-[44px] sm:text-[56px] lg:text-[72px] mt-4 text-white">
                  {t("heroTitle1")}
                  <br />
                  <span className="shimmer">{t("heroTitle2")}</span>
                </h1>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-6 max-w-xl text-[16px] lg:text-[17px] text-ink-mute leading-relaxed">
                  {t("heroIntro")}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={300}>
                <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
                  <Kpi label={t("kpiInstruments")} value="23" />
                  <Kpi label={t("kpiCurrencies")} value="4" />
                  <Kpi label={t("kpiSignup")} value="—" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative" aria-label={t("metaTitle")}>
        <div className="max-w-wrap mx-auto px-6 sm:px-10 pb-20">
          <Reveal>
            <Calculator />
          </Reveal>
        </div>
      </section>

      <section id="methode" className="relative py-20 lg:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="h-eyebrow">{t("methodEyebrow")}</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[32px] lg:text-[44px] mt-4 text-white">
                  {t("methodTitle1")}<span className="shimmer">{t("methodTitle2")}</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 text-[15px] text-ink-mute leading-relaxed">
                  {t("methodIntro")}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {method.map((m, i) => (
                <Reveal key={m.num} delay={i * 80}>
                  <article className="card rounded-2xl p-6 lg:p-7">
                    <div className="flex items-start gap-6">
                      <span className="mono text-[12px] uppercase tracking-[0.25em] text-ink-faint shrink-0 mt-1">
                        {m.num}
                      </span>
                      <div>
                        <h3 className="text-[18px] lg:text-[20px] text-white font-semibold tracking-tight">
                          {m.title}
                        </h3>
                        <p className="mt-3 text-[14px] lg:text-[15px] text-ink-mute leading-relaxed">
                          {m.body}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="h-eyebrow">{t("faqEyebrow")}</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[32px] lg:text-[44px] mt-4 text-white">
                  {t("faqTitle1")}<span className="shimmer">{t("faqTitle2")}</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 text-[15px] text-ink-mute leading-relaxed">
                  {t("faqIntro")}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8 space-y-2">
              {faq.map((item, i) => (
                <Reveal key={i} delay={i * 50}>
                  <details className="card rounded-2xl p-5 lg:p-6 group">
                    <summary className="cursor-pointer flex items-center justify-between gap-4 text-[15px] lg:text-[16px] text-white list-none">
                      <span className="font-medium tracking-tight">{item.q}</span>
                      <span className="mono text-[20px] text-ink-faint group-open:rotate-45 transition-transform shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-[14px] lg:text-[15px] text-ink-mute leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="h-eyebrow">{t("nextEyebrow")}</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[28px] lg:text-[36px] mt-4 text-white">
                  {t("nextTitle1")}
                  <br />
                  <span className="shimmer">{t("nextTitle2")}</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 text-[15px] text-ink-mute leading-relaxed max-w-xl">
                  {t("nextText")}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 flex lg:items-end lg:justify-end">
              <Reveal delay={220}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/journal" className="btn btn-primary">
                    {t("discoverJournal")}
                  </Link>
                  <Link href="/strategies" className="btn btn-ghost">
                    {t("seeStrategies")}
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="rounded-xl border border-border bg-panel p-5 lg:p-6">
            <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink-faint leading-relaxed">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-panel px-4 py-4 lg:px-5 lg:py-5">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </div>
      <div className="mono text-[22px] lg:text-[26px] tabular-nums tracking-tight text-white mt-1.5 leading-none">
        {value}
      </div>
    </div>
  );
}
