/* TouchGrass — procedural canvas meadow.
   Blades grow in, sway on a gusting wind,
   part around the cursor like you're walking through them, and sprout where you click.

   Everything is disposable (React can unmount it),
   all layers share one rAF ticker instead of four, and the loop parks itself when the
   tab is hidden or the user asks for reduced motion. */

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export type LayerSpec = {
  n: number;
  h: [number, number];
  w: [number, number];
  colors: string[];
  y: number;
  flex: number;
  alpha: number;
};

type SeedHead = { chance: number; color: string };

type LawnOptions = {
  layers: LayerSpec[];
  seedHead?: SeedHead;
  dprCap?: number;
  reach?: number;
  density?: number;
  scale?: number;
  /** Px the canvas overhangs the viewport on the sides and bottom. Blades are
      still anchored to the un-bled height, so the composition doesn't move. */
  bleed?: number;
};

type Blade = {
  layer: number;
  x: number;
  base: number;
  h: number;
  w: number;
  lean: number;
  curl: number;
  flex: number;
  phase: number;
  speed: number;
  color: string;
  alpha: number;
  seed: boolean;
  push: number;
  delay: number;
  grow: number;
  bornAt?: number;
};

// ---------------------------------------------------------------------------
// Shared ticker — one rAF for every canvas on the page, parked when hidden.
// ---------------------------------------------------------------------------

type Tickable = (t: number) => void;
const tickers = new Set<Tickable>();
let rafId = 0;
let clock = 0;

function pump(now: number) {
  rafId = requestAnimationFrame(pump);
  clock = now / 1000;
  for (const tick of tickers) tick(clock);
}

function subscribe(tick: Tickable) {
  tickers.add(tick);
  if (!rafId) rafId = requestAnimationFrame(pump);
  return () => {
    tickers.delete(tick);
    if (!tickers.size && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!document.hidden && !rafId && tickers.size) {
      rafId = requestAnimationFrame(pump);
    }
  });
}

// ---------------------------------------------------------------------------
// Pointer — tracked once, shared by every lawn. All lawns are viewport-fixed,
// so client coordinates are canvas coordinates.
// ---------------------------------------------------------------------------

const pointer = { x: -9999, y: -9999, active: false };

function trackPointer() {
  const move = (e: MouseEvent | TouchEvent) => {
    const p = "touches" in e ? e.touches[0] : e;
    if (!p) return;
    pointer.x = p.clientX;
    pointer.y = p.clientY;
    pointer.active = true;
  };
  const leave = () => {
    pointer.active = false;
  };
  window.addEventListener("mousemove", move, { passive: true });
  window.addEventListener("touchmove", move, { passive: true });
  document.addEventListener("mouseleave", leave);
  return () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("touchmove", move);
    document.removeEventListener("mouseleave", leave);
  };
}

// ---------------------------------------------------------------------------
// Lawn
// ---------------------------------------------------------------------------

class Lawn {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: LayerSpec[];
  private seedHead: SeedHead;
  private dprCap: number;
  private reach: number;
  private density: number;
  private scale: number;
  private bleed: number;
  private reduced: boolean;

  private blades: Blade[] = [];
  private capacity = 0;
  private w = 0;
  private h = 0;
  private t = 0;
  private born = 0;
  private disposers: Array<() => void> = [];

  constructor(canvas: HTMLCanvasElement, opts: LawnOptions) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");

    this.canvas = canvas;
    this.ctx = ctx;
    this.layers = opts.layers;
    this.seedHead = opts.seedHead ?? { chance: 0, color: "#fff" };
    this.dprCap = opts.dprCap ?? 2;
    this.reach = opts.reach ?? 130;
    this.density = opts.density ?? 1;
    this.scale = opts.scale ?? 1;
    this.bleed = opts.bleed ?? 0;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.born = performance.now();

    this.resize();

    const onResize = () => this.resize();
    window.addEventListener("resize", onResize, { passive: true });
    this.disposers.push(() => window.removeEventListener("resize", onResize));

    if (this.reduced) {
      this.draw();
    } else {
      this.disposers.push(subscribe((t) => this.frame(t)));
    }
  }

  destroy() {
    for (const dispose of this.disposers) dispose();
    this.disposers = [];
    this.blades = [];
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.dprCap);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
    this.seed();
    if (this.reduced) this.draw();
  }

  private seed() {
    this.blades = [];
    const widthFactor = clamp(this.w / 1440, 0.55, 1.6) * this.density;
    this.layers.forEach((L, li) => {
      const n = Math.round(L.n * widthFactor);
      for (let i = 0; i < n; i++) {
        this.blades.push(this.makeBlade(L, li, Math.random(), (i / n) * 0.55 + rnd(0, 0.25)));
      }
    });
    this.blades.sort((a, b) => a.layer - b.layer);
    this.capacity = this.blades.length * 1.5 + 40;
  }

  private makeBlade(L: LayerSpec, li: number, xNorm: number, delay: number): Blade {
    const hs = this.scale;
    return {
      layer: li,
      x: xNorm * this.w,
      base: (this.h - this.bleed) * L.y,
      h: rnd(L.h[0], L.h[1]) * hs,
      w: rnd(L.w[0], L.w[1]) * hs,
      lean: rnd(-0.42, 0.42),
      curl: rnd(0.25, 0.62),
      flex: L.flex * rnd(0.75, 1.3),
      phase: rnd(0, Math.PI * 2),
      speed: rnd(0.5, 1.15),
      color: L.colors[(Math.random() * L.colors.length) | 0],
      alpha: L.alpha,
      seed: Math.random() < this.seedHead.chance,
      push: 0,
      delay,
      grow: 0,
    };
  }

  /** Sprout a small clump at a viewport x. Ignored once the lawn is at capacity. */
  plant(clientX: number) {
    if (this.reduced) return;
    if (this.blades.length > this.capacity) return;
    const li = Math.max(0, this.layers.length - 2);
    const L = this.layers[li];
    const x = clientX / this.w;
    for (let i = 0; i < 3; i++) {
      const b = this.makeBlade(L, li, clamp(x + rnd(-0.012, 0.012), 0, 1), 0);
      b.bornAt = this.t;
      this.blades.push(b);
    }
  }

  private wind(t: number) {
    return (
      Math.sin(t * 0.55) * 0.55 +
      Math.sin(t * 0.23 + 1.3) * 0.35 +
      Math.max(0, Math.sin(t * 0.11 - 0.6)) ** 3 * 0.9 // gusts
    );
  }

  private frame(t: number) {
    this.t = t;
    this.draw();
  }

  private draw() {
    const ctx = this.ctx;
    const t = this.t;
    ctx.clearRect(0, 0, this.w, this.h);
    const gust = this.reduced ? 0.25 : this.wind(t);
    const elapsed = (performance.now() - this.born) / 1000;

    for (const b of this.blades) {
      // grow-in
      const local = b.bornAt !== undefined ? (t - b.bornAt) / 0.9 : (elapsed - b.delay) / 1.15;
      b.grow = this.reduced ? 1 : ease(clamp(local, 0, 1));
      if (b.grow <= 0.001) continue;

      // cursor parting
      if (pointer.active && !this.reduced) {
        const dx = b.x - pointer.x;
        const dy = b.base - b.h * 0.5 - pointer.y;
        const d = Math.hypot(dx, dy * 0.55);
        const R = this.reach;
        const target = d < R ? (1 - d / R) * Math.sign(dx || 1) * 1.5 : 0;
        b.push += (target - b.push) * 0.14;
      } else {
        b.push += (0 - b.push) * 0.08;
      }

      const sway = this.reduced ? 0 : Math.sin(t * b.speed + b.phase) * 0.28;
      const bend = (gust * b.flex + sway) * 0.55 + b.push * b.flex;

      const h = b.h * b.grow;
      const w = b.w * (0.7 + 0.3 * b.grow);
      const tipX = b.x + (b.lean + bend) * h * 0.62;
      const tipY = b.base - h;
      const cx = b.x + (b.lean + bend) * h * b.curl * 0.5;
      const cy = b.base - h * 0.55;

      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(b.x - w * 0.5, b.base + 4);
      ctx.quadraticCurveTo(cx - w * 0.22, cy, tipX, tipY);
      ctx.quadraticCurveTo(cx + w * 0.22, cy, b.x + w * 0.5, b.base + 4);
      ctx.closePath();
      ctx.fill();

      if (b.seed && b.grow > 0.85) {
        ctx.fillStyle = this.seedHead.color;
        ctx.globalAlpha = (b.alpha * (b.grow - 0.85)) / 0.15;
        ctx.beginPath();
        ctx.ellipse(tipX, tipY, w * 0.42, w * 1.1, (b.lean + bend) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------------------
// Field — three stacked lawns with real depth of field. The outer two get a CSS
// blur so the middle band reads as the focal plane, the way a long lens sees a field.
// ---------------------------------------------------------------------------

type BandConfig = {
  blur: number;
  /** Overhang, so the blur's edge falloff lands outside the viewport. */
  bleed: number;
  alpha: number;
  dpr: number;
  scale: number;
  fade: number;
  layers: LayerSpec[];
  seedHead?: SeedHead;
};

const DUSK: Record<"far" | "mid" | "near", BandConfig> = {
  far: {
    blur: 12,
    bleed: 40,
    alpha: 0.5,
    dpr: 1,
    scale: 0.85,
    fade: 0.55,
    layers: [
      { n: 260, h: [140, 250], w: [3.4, 5.6], colors: ["#7a8f6a", "#6b8060", "#879a74"], y: 1.02, flex: 0.4, alpha: 1 },
      { n: 210, h: [190, 330], w: [3.8, 6.4], colors: ["#586e50", "#4e6349"], y: 1.07, flex: 0.55, alpha: 1 },
    ],
    seedHead: { chance: 0.07, color: "#d8bd7c" },
  },
  mid: {
    blur: 0,
    bleed: 0,
    alpha: 1,
    dpr: 2,
    scale: 1,
    fade: 0.72,
    layers: [
      { n: 200, h: [210, 350], w: [4.0, 6.8], colors: ["#3b543c", "#334a35"], y: 1.06, flex: 0.75, alpha: 1 },
      { n: 150, h: [270, 450], w: [4.6, 8.0], colors: ["#27392a", "#1f3124"], y: 1.11, flex: 0.9, alpha: 1 },
      { n: 90, h: [330, 540], w: [5.4, 9.4], colors: ["#16241a", "#111d15"], y: 1.16, flex: 1.05, alpha: 1 },
    ],
    seedHead: { chance: 0.09, color: "#c9a95e" },
  },
  near: {
    blur: 19,
    bleed: 60,
    alpha: 0.96,
    dpr: 1,
    scale: 1.25,
    fade: 0,
    layers: [
      { n: 30, h: [260, 480], w: [16, 30], colors: ["#0d1710", "#0a130d", "#101c13"], y: 1.24, flex: 1.3, alpha: 1 },
    ],
  },
};

function bandStyle(cfg: BandConfig, z: number, interactive: boolean) {
  const b = cfg.bleed;
  // A blurred canvas fades out at its own bitmap edge, which would show as a
  // pale seam along the bottom of the screen. Hang the canvas past the viewport
  // and let the container's overflow clip the falloff away.
  const style: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "0",
    left: `${-b}px`,
    width: b ? `calc(100% + ${b * 2}px)` : "100%",
    height: b ? `calc(100% + ${b}px)` : "100%",
    display: "block",
    zIndex: String(z),
    opacity: String(cfg.alpha),
  };
  if (cfg.blur) style.filter = `blur(${cfg.blur}px)`;
  if (!interactive) style.pointerEvents = "none";
  if (cfg.fade) {
    // Stops are measured against the visible height, so the bleed doesn't drag
    // the fade down with it. The last stop extends over the overhang.
    const visible = b ? `(100% - ${b}px)` : "100%";
    const start = (1 - cfg.fade).toFixed(3);
    const solid = (1 - cfg.fade * 0.45).toFixed(3);
    const mask =
      `linear-gradient(180deg,transparent 0px,` +
      `rgba(0,0,0,.35) calc(${visible} * ${start}),` +
      `#000 calc(${visible} * ${solid}))`;
    style.maskImage = mask;
    style.webkitMaskImage = mask;
  }
  return style;
}

export type FieldOptions = {
  /** Holds the far + mid bands, behind the page content. */
  container: HTMLElement;
  /** Holds the near band, in front of the page content. Falls back to `container`. */
  nearContainer?: HTMLElement | null;
  density?: number;
  reach?: number;
};

/** Builds the dusk field. Returns a disposer that removes every canvas and listener. */
export function createField({ container, nearContainer, density = 1, reach = 190 }: FieldOptions) {
  const bands: Array<keyof typeof DUSK> = ["far", "mid", "near"];
  const lawns: Lawn[] = [];
  const canvases: HTMLCanvasElement[] = [];

  bands.forEach((key, i) => {
    const cfg = DUSK[key];
    const host = key === "near" ? nearContainer ?? container : container;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = `tg-band tg-band-${key}`;
    Object.assign(canvas.style, bandStyle(cfg, i, false));
    host.appendChild(canvas);
    canvases.push(canvas);

    try {
      lawns.push(
        new Lawn(canvas, {
          layers: cfg.layers.map((L) => ({ ...L, n: Math.round(L.n * density) })),
          seedHead: cfg.seedHead,
          scale: cfg.scale,
          dprCap: cfg.dpr,
          bleed: cfg.bleed,
          reach,
        }),
      );
    } catch {
      canvas.remove();
    }
  });

  const untrack = trackPointer();

  // Click anywhere that isn't interactive chrome to plant a clump.
  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a,button,input,textarea,select,[role='button']")) return;
    for (const lawn of lawns) lawn.plant(e.clientX);
  };
  window.addEventListener("click", onClick);

  return () => {
    window.removeEventListener("click", onClick);
    untrack();
    for (const lawn of lawns) lawn.destroy();
    for (const canvas of canvases) canvas.remove();
  };
}

// ---------------------------------------------------------------------------
// Motes — drifting fireflies.
// ---------------------------------------------------------------------------

export type MotesOptions = {
  count?: number;
  color?: string;
  glow?: boolean;
  /** Fraction of the canvas height to start seeding from (0 = top). */
  yFrom?: number;
};

type Mote = { x: number; y: number; r: number; vx: number; vy: number; ph: number; sp: number; a: number };

export function createMotes(canvas: HTMLCanvasElement, opts: MotesOptions = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const color = opts.color ?? "rgba(255,250,220,.9)";
  const count = opts.count ?? 40;
  const glow = opts.glow ?? false;
  const yFrom = opts.yFrom ?? 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0;
  let h = 0;
  let motes: Mote[] = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    motes = Array.from({ length: count }, () => ({
      x: rnd(0, w),
      y: rnd(h * yFrom, h),
      r: rnd(0.9, 3.2),
      vx: rnd(-0.16, 0.34),
      vy: rnd(-0.16, 0.05),
      ph: rnd(0, 6.28),
      sp: rnd(0.3, 1.1),
      a: rnd(0.25, 0.85),
    }));
  }

  function paint(t: number) {
    ctx!.clearRect(0, 0, w, h);
    for (const m of motes) {
      if (!reduced) {
        m.x += m.vx + Math.sin(t * m.sp + m.ph) * 0.28;
        m.y += m.vy + Math.cos(t * m.sp * 0.7 + m.ph) * 0.16;
        if (m.x > w + 12) m.x = -12;
        if (m.x < -12) m.x = w + 12;
        if (m.y < -12) m.y = h + 12;
        if (m.y > h + 12) m.y = -12;
      }
      const pulse = glow ? 0.45 + 0.55 * Math.abs(Math.sin(t * m.sp * 1.4 + m.ph)) : 1;
      ctx!.globalAlpha = m.a * pulse;
      if (glow) {
        const g = ctx!.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 6);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, m.r * 6, 0, 6.284);
        ctx!.fill();
      }
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.arc(m.x, m.y, m.r, 0, 6.284);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  resize();
  const onResize = () => {
    resize();
    if (reduced) paint(0);
  };
  window.addEventListener("resize", onResize, { passive: true });

  if (reduced) {
    paint(0);
    return () => window.removeEventListener("resize", onResize);
  }

  const unsubscribe = subscribe(paint);
  return () => {
    window.removeEventListener("resize", onResize);
    unsubscribe();
  };
}
