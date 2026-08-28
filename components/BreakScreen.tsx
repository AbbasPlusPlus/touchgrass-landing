"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight2, LockGlyph } from "@/components/icons";
import { MacbookFrame } from "@/components/MacbookFrame";

/**
 * The app's break screen, at 1:1 with the real thing.
 *
 * Composition, sizes and colours are lifted from
 * ../touchgrass/Sources/TGOverlay/{BreakView,OverlayType,BreakTone}.swift — clock at the top,
 * title / subtitle / hairline / countdown in the middle, controls at the bottom far from the
 * numerals. The default backdrop is `.screenBlur`, whose tone follows the system, so this is
 * the dark-appearance rendering of it.
 *
 * Everything is sized in `cqw` against the screen's own width, the way a screenshot scales.
 * The reference width is 1080pt rather than a real 1512pt display, so the smallest chrome
 * stays readable on the page; the proportions between elements are the app's.
 */

const REF = 1080;
/** A point of the app's type scale, as a share of the mock's width. */
const pt = (v: number) => `${((v / REF) * 100).toFixed(3)}cqw`;
/** …with a floor and a ceiling, so the mock survives a phone and a 4K monitor. */
const ptc = (v: number, min: number, max: number) => `clamp(${min}px,${pt(v)},${max}px)`;

const START = 27;

function mmss(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function BreakScreen() {
  const [clock, setClock] = useState("17:41");
  const [left, setLeft] = useState(START);
  const runway = useRef<HTMLElement>(null);
  // The break only starts counting once the lid is actually open on it.
  const [running, setRunning] = useState(false);

  // The lid hinges open the first time it scrolls into view. Driven by classes on the
  // element rather than React state: it's a one-way DOM effect, and it means the server
  // render (and anyone without JS) gets an already-open laptop instead of a flat one.
  useEffect(() => {
    const el = runway.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Arming is a one-way DOM effect, so it lives on the element rather than in state.
    if (!reduced) el.classList.add("is-armed");

    // The runway is 200svh, so it can never exceed 50% visible — 0.45 lands just after
    // the lid has started to lift, which is when the countdown should pick up.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!reduced) el.classList.add("is-open");
        setRunning(true);
        io.disconnect();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The visitor's own clock, like the one on the break screen. Server-rendered as the poster
  // frame so there is nothing to mismatch on hydration.
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setLeft((v) => (v <= 0 ? 30 : v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <section
      id="demo"
      aria-label="What a break looks like"
      /* A tall runway with a pinned viewport inside it. The laptop stays centred on
         screen for the whole of the open, instead of scrolling past while it unfolds. */
      className="mb-runway relative h-[200svh]"
      ref={runway}
    >
      <div className="pointer-events-none sticky top-0 flex h-svh items-center justify-center px-5 sm:px-7">
      <div className="mb-shift w-full max-w-[1080px] drop-shadow-[0_60px_80px_rgba(0,0,0,.55)]">
      <MacbookFrame>
      <div
        className="relative h-full w-full bg-[#242a20]"
        style={{ containerType: "inline-size" }}
      >
        {/* the frosted desktop behind the break screen */}
        <div
          className="absolute -inset-[20%] blur-[48px]"
          style={{
            background:
              "radial-gradient(48% 48% at 26% 24%, #3c5236 0%, transparent 62%), radial-gradient(52% 52% at 78% 78%, #2a3a26 0%, transparent 62%), linear-gradient(165deg,#2b3325 0%, #222a1e 60%, #1a2017 100%)",
          }}
        />
        {/* OverlayPalette.frostWashDark — the deep ink-green wash, 32% */}
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink-green)_32%,transparent)]" />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--grain)" }} />
        {/* BreakView.vignette — clear to black at 34% */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 50%,transparent 24%,rgba(0,0,0,.34) 100%)" }}
        />

        {/* clock — OverlayType.clock, 15pt medium, tracking 1.2 */}
        <div
          className="absolute inset-x-0 text-center font-medium text-ink-2 tabular-nums"
          // 9.02 chassis units of notch = ~19.4pt at this scale; clear it, then the app's own 24pt.
          style={{ top: `max(22px,${pt(43)})`, fontSize: ptc(15, 9.5, 13), letterSpacing: pt(1.2) }}
        >
          <time suppressHydrationWarning>{clock}</time>
        </div>

        {/* centre stack — BreakView offsets it 18pt up so it optically centres */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ paddingInline: pt(48), transform: `translateY(-${pt(18)})` }}
        >
          <h2
            className="font-display text-ink"
            style={{
              fontSize: ptc(54, 20, 46),
              fontWeight: 500,
              letterSpacing: "-0.3px",
              lineHeight: 1.08,
              opacity: 0.97,
              textShadow: `0 ${pt(4)} ${pt(16)} rgba(0,0,0,.34)`,
            }}
          >
            Relax those eyes
          </h2>

          <p
            className="text-ink-2"
            style={{ fontSize: ptc(20, 10.5, 17), marginTop: pt(16), lineHeight: 1.35, maxWidth: pt(640) }}
          >
            Find a distant spot to rest your eyes on
          </p>

          {/* hairline — 320×1, stone, faded at both ends */}
          <div
            style={{
              marginTop: pt(34),
              width: `clamp(120px,${pt(320)},320px)`,
              height: 1,
              background: "linear-gradient(90deg,transparent,var(--color-stone),transparent)",
            }}
          />

          {/* countdown — Fraunces 96 light, matchaDeep */}
          <div
            className="font-display text-matcha-deep tabular-nums"
            style={{
              fontSize: ptc(96, 34, 82),
              fontWeight: 300,
              marginTop: pt(26),
              lineHeight: 1,
              letterSpacing: pt(1.5),
              textShadow: `0 ${pt(8)} ${pt(24)} rgba(0,0,0,.34)`,
            }}
          >
            <span suppressHydrationWarning>{mmss(left)}</span>
          </div>
        </div>

        {/* controls — bottom of the screen, well clear of the numerals */}
        <div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{ bottom: pt(54), gap: pt(12) }}
          aria-hidden="true"
        >
          <div className="flex items-end" style={{ gap: pt(12) }}>
            {/* the split capsule: Skip Break, which fans out to +1m / +5m on hover */}
            <div
              className="glass inline-flex items-center rounded-full text-ink"
              style={{ fontSize: ptc(15, 9.5, 13) }}
            >
              <span className="inline-flex items-center" style={{ gap: pt(7), padding: `${pt(10)} ${pt(16)}` }}>
                <ChevronRight2 style={{ width: `max(9px,${pt(12)})`, height: `max(9px,${pt(12)})` }} />
                Skip Break
              </span>
            </div>
            <div
              className="glass inline-flex items-center rounded-full text-ink"
              style={{ fontSize: ptc(15, 9.5, 13), gap: pt(7), padding: `${pt(10)} ${pt(16)}` }}
            >
              <LockGlyph style={{ width: `max(9px,${pt(13)})`, height: `max(9px,${pt(13)})` }} />
              Lock Screen
            </div>
          </div>

          {/* "Press [Esc] twice to skip" */}
          <div
            className="flex items-center text-ink-2"
            style={{ gap: pt(5), fontSize: ptc(12.5, 9, 11), opacity: 0.85 }}
          >
            <span>Press</span>
            <span
              className="rounded-[6px] font-semibold"
              style={{
                padding: `${pt(3)} ${pt(7)}`,
                background: "color-mix(in srgb, var(--color-stone) 70%, transparent)",
              }}
            >
              Esc
            </span>
            <span>twice to skip</span>
          </div>
        </div>
      </div>
      </MacbookFrame>
      </div>
      </div>
    </section>
  );
}
