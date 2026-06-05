"use client";

import { useEffect } from "react";

export function CursorGlow() {
  useEffect(() => {
    let raf = 0;
    let lastEvent: MouseEvent | null = null;

    // Le travail (closest + getBoundingClientRect = lecture de layout) est
    // regroupé dans une seule frame rAF max, pas à chaque mousemove.
    const process = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".pillar-card, .card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);
    };

    const handler = (e: MouseEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(process);
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
