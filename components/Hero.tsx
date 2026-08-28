import { AppleLogo, GitHubMark } from "@/components/icons";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <header className="mx-auto flex min-h-svh max-w-[880px] flex-col items-center justify-center px-5 py-16 text-center sm:px-7">
      {/* the app icon on its paper squircle */}
      <div
        className="rise mx-auto mb-7 grid h-24 w-24 place-items-center rounded-[24px] border border-stone bg-[color-mix(in_srgb,var(--color-paper-2)_72%,transparent)] backdrop-blur-[16px]"
        style={{
          boxShadow:
            "0 1px 0 color-mix(in srgb, var(--color-ink) 10%, transparent) inset, 0 22px 44px -18px rgba(0,0,0,.85), 0 0 60px -18px color-mix(in srgb, var(--color-pollen) 35%, transparent)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark.svg" alt={`${site.name} app icon`} width={72} height={72} className="h-18 w-18" />
      </div>

      <h1
        className="rise font-display text-[clamp(32px,6.6vw,66px)] leading-[1.07] font-[420] tracking-[-0.024em] text-balance text-ink [text-shadow:0_2px_30px_rgba(0,0,0,.5)]"
        style={{ "--rise-delay": ".08s" } as React.CSSProperties}
      >
        You haven&rsquo;t <em className="not-italic" style={{ color: "color-mix(in srgb, var(--color-matcha) 62%, var(--color-matcha-deep))" }}>
          blinked
        </em> in a while
      </h1>

      <p
        className="rise mx-auto mt-5 text-[17px] text-balance text-ink-2 sm:text-[18px]"
        style={
          {
            "--rise-delay": ".16s",
            // Match the headline's measure exactly: its one line is 12.06x its own
            // font size, so the lede tracks it at every viewport and lands on two lines.
            maxWidth: "calc(clamp(32px,6.6vw,66px) * 12.06)",
          } as React.CSSProperties
        }
      >
        Screens make us stare. {site.name} is a break reminder for macOS that gives your eyes a moment to relax and
        refocus, before the strain sets in.
      </p>

      <div
        id="download"
        className="rise mt-8 flex scroll-mt-24 items-center justify-center gap-3"
        style={{ "--rise-delay": ".24s" } as React.CSSProperties}
      >
        <a className="btn btn-primary" href="#install">
          <AppleLogo /> Download
        </a>
        <a
          className="btn btn-ghost"
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubMark /> GitHub
        </a>
      </div>
    </header>
  );
}
