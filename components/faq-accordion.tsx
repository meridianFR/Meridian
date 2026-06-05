"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border hairline-top">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="bg-black">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-5 text-left px-6 py-5 hover:bg-white/[0.02] transition-colors"
              >
                <span
                  className={`text-[15px] font-medium transition-colors ${
                    isOpen ? "text-white" : "text-ink"
                  }`}
                >
                  {it.q}
                </span>
                {/* + qui se transforme en − en douceur */}
                <span className="relative w-3.5 h-3.5 shrink-0 text-ink-faint">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  />
                </span>
              </button>
            </h3>
            {/* animation de hauteur sans mesure JS via grid-template-rows */}
            <div
              className="grid transition-[grid-template-rows]"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transitionDuration: "400ms",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-ink-mute text-sm leading-relaxed max-w-2xl whitespace-pre-line">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
