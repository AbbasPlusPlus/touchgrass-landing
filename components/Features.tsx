import { EyeGlyph, HourglassGlyph, MenuBarGlyph } from "@/components/icons";
import { features } from "@/lib/site";

const GLYPHS = {
  hourglass: HourglassGlyph,
  eye: EyeGlyph,
  menubar: MenuBarGlyph,
} as const;

export function Features() {
  return (
    <section
      id="features"
      aria-label="What it does"
      className="paper-card mx-auto mt-20 grid max-w-[1000px] scroll-mt-20 grid-cols-1 gap-8 rounded-[26px] px-6 py-8 sm:mt-[110px] sm:px-[34px] sm:py-[38px] md:grid-cols-3 md:gap-0"
    >
      {features.map((f) => {
        const Glyph = GLYPHS[f.icon];
        return (
        // Columns are split by a hairline rather than whitespace: the divider (and the
        // per-column padding it needs) only comes in at md, where the three sit side by
        // side; stacked on mobile they fall back to the grid's row gap.
        <div
          key={f.title}
          className="md:border-l md:border-ink/10 md:px-[30px] md:first:border-l-0 md:first:pl-1"
        >
          {/* Icon rides in a soft matcha chip so it reads as a deliberate badge, not a
              stray glyph floating above the text. */}
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-matcha/15">
            <Glyph className="h-[22px] w-[22px] text-matcha" />
          </span>
          {/* TGType.title sits at 17pt semibold; the serif is reserved for numerals in the
              app, but on a page a serif subhead reads as the same family. */}
          <h3 className="font-display text-[18.5px] font-medium text-ink">{f.title}</h3>
          <p className="mt-[7px] text-[14.5px] text-ink-2">{f.body}</p>
        </div>
        );
      })}
    </section>
  );
}
