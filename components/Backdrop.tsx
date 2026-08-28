"use client";

import { useEffect, useRef } from "react";
import { createField, createMotes } from "@/lib/grass";

/**
 * The whole dusk scene, mounted once behind (and, for the near band, in front of)
 * the page. Everything here is decorative — screen readers see nothing.
 */
export function Backdrop() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const motesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const front = frontRef.current;
    const motes = motesRef.current;
    if (!field || !motes) return;

    // A denser field costs more per frame; ease off on small screens.
    const density = window.innerWidth < 700 ? 0.6 : 1;

    const disposeField = createField({ container: field, nearContainer: front, density });
    const disposeMotes = createMotes(motes, {
      count: window.innerWidth < 700 ? 18 : 32,
      color: "rgba(255,222,146,.95)",
      glow: true,
      yFrom: 0.34,
    });

    return () => {
      disposeField();
      disposeMotes();
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="tg-layer tg-sky" />
      <div className="tg-glow" />
      <div ref={fieldRef} className="tg-layer tg-field" />
      <div className="tg-layer tg-vignette" />
      <canvas ref={motesRef} className="tg-layer tg-motes" />
      <div ref={frontRef} className="tg-layer tg-front" />
      <div className="tg-layer tg-grain" />
    </div>
  );
}
