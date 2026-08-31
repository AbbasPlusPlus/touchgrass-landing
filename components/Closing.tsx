import { GitHubMark } from "@/components/icons";
import { InstallCommand } from "@/components/InstallCommand";
import { site } from "@/lib/site";

/** A single keycap, so the walkthrough reads like the keys look. */
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-block rounded-md border border-ink/20 bg-ink/5 px-1.5 py-0.5 font-sans text-[12px] text-ink/90">
      {children}
    </kbd>
  );
}

export function Closing() {
  return (
    <section id="install" className="px-5 pt-24 pb-24 text-center sm:px-7 sm:pt-[130px] sm:pb-32">
      {/* Three words, so it can carry a size the two-line version couldn't. */}
      <h2 className="font-display text-[clamp(32px,5vw,56px)] font-[420] tracking-[-0.02em] text-ink">
        Look up, touch grass.
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-sm text-ink/85">
        Install from Terminal — one line puts the latest version in Applications.
        The app updates itself after that.
      </p>
      <InstallCommand />

      {/* The full walkthrough for anyone who's never opened Terminal. Collapsed by
          default — native <details>, no JS — so the dev crowd skims past it and
          everyone else has every step one click away. */}
      <details className="mx-auto mt-6 max-w-xl text-left">
        <summary className="cursor-pointer list-none text-sm text-ink/75 transition hover:text-ink [&::-webkit-details-marker]:hidden">
          <span className="underline underline-offset-2">
            Never opened Terminal? Here&rsquo;s every step
          </span>
        </summary>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
          <li>
            <span className="font-semibold text-ink">1. Open Terminal.</span> Press{" "}
            <Kbd>⌘</Kbd> and <Kbd>Space</Kbd> together, type{" "}
            <em className="not-italic text-ink">Terminal</em>, and press{" "}
            <Kbd>Return</Kbd>. A small window with a blank line opens — that&rsquo;s it.
          </li>
          <li>
            <span className="font-semibold text-ink">2. Paste the line.</span> Hit{" "}
            <em className="not-italic text-ink">Copy</em> on the line above, click the
            Terminal window, paste with <Kbd>⌘</Kbd> <Kbd>V</Kbd>, and press{" "}
            <Kbd>Return</Kbd>. It works on any Mac — nothing needs to be installed first.
          </li>
          <li>
            <span className="font-semibold text-ink">3. Open the app.</span> When it
            finishes, {site.name} is in your Applications folder. Open it once and it lives
            in the menu bar from then on.
          </li>
        </ol>
      </details>

      <p className="mx-auto mt-8 max-w-xl text-sm text-ink/85">
        Prefer a plain download?{" "}
        <a className="underline underline-offset-2" href={site.download} download>
          Grab the zip
        </a>
        {" "}— macOS will warn that it can&apos;t verify the app (it&apos;s independently
        built, not notarized by Apple). Allow it under System Settings → Privacy &amp;
        Security → &quot;Open Anyway&quot;.
      </p>

      <a
        className="mx-auto mt-14 inline-flex items-center gap-2 text-sm text-ink/70 transition hover:text-ink"
        href={site.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubMark /> Free &amp; open source on GitHub
      </a>
    </section>
  );
}
