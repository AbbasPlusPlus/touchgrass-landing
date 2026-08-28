import type { SVGProps } from "react";

export function AppleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="18" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M11.6 9c0-2 1.6-2.9 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7C3.5 4.4 2.2 5.2 1.5 6.4.1 8.9 1.1 12.6 2.5 14.6c.7 1 1.5 2.1 2.5 2 1-.04 1.4-.65 2.6-.65s1.6.65 2.6.63c1.1-.02 1.8-1 2.4-2 .8-1.15 1.1-2.26 1.1-2.32-.02-.01-2.1-.81-2.1-3.26zM9.7 3.2c.5-.65.9-1.55.8-2.45-.8.03-1.75.53-2.3 1.18-.5.57-.93 1.49-.81 2.37.89.07 1.8-.45 2.31-1.1z" />
    </svg>
  );
}

/** The two faint grass strokes from the app's break screen. */
export function GrassStrokes(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 70" aria-hidden="true" {...props}>
      <g fill="none" stroke="#8ba579" strokeWidth="3" strokeLinecap="round">
        <path d="M30 70 C36 46 28 30 34 14" />
        <path d="M48 70 C44 52 54 40 51 26" opacity=".6" />
      </g>
    </svg>
  );
}

/** SF Symbol `chevron.right.2`, as drawn on the break screen's Skip segment. */
export function ChevronRight2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 3.5 7.5 8 3 12.5M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/** SF Symbol `lock`. */
export function LockGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 1a3.2 3.2 0 0 0-3.2 3.2V6H4.4A1.4 1.4 0 0 0 3 7.4v5.2A1.4 1.4 0 0 0 4.4 14h7.2a1.4 1.4 0 0 0 1.4-1.4V7.4A1.4 1.4 0 0 0 11.6 6h-.4V4.2A3.2 3.2 0 0 0 8 1Zm0 1.5a1.7 1.7 0 0 1 1.7 1.7V6H6.3V4.2A1.7 1.7 0 0 1 8 2.5Z" />
    </svg>
  );
}

/** SF Symbol `gearshape.fill`. */
export function GearGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.9.9a.7.7 0 0 0-.68.55l-.2.93a5.5 5.5 0 0 0-1.2.7l-.9-.3a.7.7 0 0 0-.82.32l-1.1 1.9a.7.7 0 0 0 .14.86l.71.63a5.6 5.6 0 0 0 0 1.4l-.71.63a.7.7 0 0 0-.14.86l1.1 1.9a.7.7 0 0 0 .82.32l.9-.3c.37.29.77.53 1.2.7l.2.93a.7.7 0 0 0 .68.55h2.2a.7.7 0 0 0 .68-.55l.2-.93c.43-.17.83-.41 1.2-.7l.9.3a.7.7 0 0 0 .82-.32l1.1-1.9a.7.7 0 0 0-.14-.86l-.71-.63a5.6 5.6 0 0 0 0-1.4l.71-.63a.7.7 0 0 0 .14-.86l-1.1-1.9a.7.7 0 0 0-.82-.32l-.9.3a5.5 5.5 0 0 0-1.2-.7l-.2-.93A.7.7 0 0 0 9.1.9H6.9ZM8 5.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z" />
    </svg>
  );
}

export function GitHubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Feature-card glyphs — Phosphor (MIT), "regular" weight, 256 grid.
   Inlined rather than pulling in @phosphor-icons/react: three icons don't
   justify a dependency on a static page.
   -------------------------------------------------------------------------- */

/** Phosphor `hourglass-medium` — it waits. */
export function HourglassGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M200,75.64V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V76a16.07,16.07,0,0,0,6.4,12.8L114.67,128,62.4,167.2A16.07,16.07,0,0,0,56,180v36a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V180.36a16.09,16.09,0,0,0-6.35-12.77L141.27,128l52.38-39.6A16.05,16.05,0,0,0,200,75.64ZM72,40H184V75.64L178.23,80H77.33L72,76Zm56,78L98.67,96h58.4Zm56,98H72V180l48-36v24a8,8,0,0,0,16,0V144.08l48,36.28Z" />
    </svg>
  );
}

/** Phosphor `eye` — the rests are for these. */
export function EyeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
    </svg>
  );
}

/** Phosphor `app-window` — a bar across the top of the screen: the menu bar. */
export function MenuBarGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM80,84A12,12,0,1,1,68,72,12,12,0,0,1,80,84Zm40,0a12,12,0,1,1-12-12A12,12,0,0,1,120,84Z" />
    </svg>
  );
}
