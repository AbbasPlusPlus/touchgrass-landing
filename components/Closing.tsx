import { GitHubMark } from "@/components/icons";
import { InstallCommand } from "@/components/InstallCommand";
import { site } from "@/lib/site";

export function Closing() {
  return (
    <section id="install" className="px-5 pt-24 pb-24 text-center sm:px-7 sm:pt-[130px] sm:pb-32">
      {/* Three words, so it can carry a size the two-line version couldn't. */}
      <h2 className="font-display text-[clamp(32px,5vw,56px)] font-[420] tracking-[-0.02em] text-ink">
        Look up, touch grass.
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-sm opacity-70">
        Install from Terminal — either line puts the latest version in Applications.
        The app updates itself after that.
      </p>
      <InstallCommand />

      <p className="mx-auto mt-8 max-w-xl text-sm opacity-60">
        Prefer a plain download?{" "}
        <a className="underline underline-offset-2" href={site.download} download>
          Grab the zip
        </a>
        {" "}— macOS will warn that it can&apos;t verify the app (it&apos;s independently
        built, not notarized by Apple). Allow it under System Settings → Privacy &amp;
        Security → &quot;Open Anyway&quot;.
      </p>

      <a
        className="mx-auto mt-14 inline-flex items-center gap-2 text-sm opacity-60 transition hover:opacity-90"
        href={site.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubMark /> Free &amp; open source on GitHub
      </a>
    </section>
  );
}
