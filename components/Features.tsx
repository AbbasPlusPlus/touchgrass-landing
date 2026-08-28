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
      className="paper-card mx-auto mt-20 grid max-w-[1000px] scroll-mt-20 grid-cols-1 gap-8 rounded-[26px] px-6 py-8 sm:mt-[110px] sm:px-[34px] sm:py-[38px] md:grid-cols-3"
    >
      {features.map((f) => {
        const Glyph = GLYPHS[f.icon];
        return (
        <div key={f.title}>
          <Glyph className="mb-3.5 h-[26px] w-[26px] text-matcha" />
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
