/** Everything copy- or link-shaped, in one place. */
export const site = {
  name: "TouchGrass",
  tagline: "A break reminder for macOS that gives your eyes a moment to relax and refocus.",
  url: "https://grass.mohammadabbas.com",
  email: "",
  github: "https://github.com/AbbasPlusPlus/touchgrass",
  /** GitHub's `latest/download` alias always serves the newest release's asset, so this
   *  link stays correct across releases without touching the site. */
  download: "https://github.com/AbbasPlusPlus/touchgrass-releases/releases/latest/download/TouchGrass.zip",
  version: "v1.0.0",
  requirements: ["macOS 26+", "Apple silicon", "Free while in beta"],
} as const;

/**
 * Where the site is actually served from. Vercel sets `VERCEL_PROJECT_PRODUCTION_URL`
 * to the project's production domain at build time, so absolute URLs (og:image,
 * canonical, JSON-LD) point at somewhere that resolves. It flips to `touchgrass.app`
 * on its own once that domain is attached to the project.
 */
export const deployedUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : site.url;

export const features = [
  {
    icon: "hourglass",
    title: "It waits for a good moment",
    body: "Camera on, film playing, or deep in something — it holds the break and comes back when you're actually free.",
  },
  {
    icon: "eye",
    title: "Short rests, at your rhythm",
    body: "A brief glance away through the day, a longer break now and then, and a nudge to blink when you've been staring. All on timings you set.",
  },
  {
    icon: "menubar",
    title: "Nothing to manage",
    body: "No streaks, no accounts, not even a permission prompt. It looks after your eyes from the menu bar.",
  },
] as const;
