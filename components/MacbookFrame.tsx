import type { ReactNode } from "react";

/**
 * A MacBook to sit the break screen inside.
 *
 * The chassis geometry is the SVG supplied for this task, split at the hinge (y ≈ 362.5 in
 * its 650×400 coordinate space) into two pieces: the lid, which can tilt, and the base,
 * which can't. One SVG rotated as a whole would swing the keyboard deck through the floor.
 *
 * The screen is not an <image> — the live break-screen DOM is positioned over the display
 * cutout, so the countdown keeps running inside the laptop.
 */

/** The display cutout, as a share of the lid box. Derived from the chassis coordinates:
 *  x 74.52, y 21.32, w 501.22, h 323.85 within a lid viewBox of `0 13 650 350`. */
const SCREEN = {
  left: `${((74.52 / 650) * 100).toFixed(3)}%`,
  top: `${(((21.32 - 13) / 350) * 100).toFixed(3)}%`,
  width: `${((501.22 / 650) * 100).toFixed(3)}%`,
  height: `${((323.85 / 350) * 100).toFixed(3)}%`,
};

/** The notch, as a share of the display cutout. From the chassis's camera housing:
 *  54.07 wide of a 501.22 panel, 9.02 tall of 323.85. */
const NOTCH = {
  width: `${((54.07 / 501.22) * 100).toFixed(3)}%`,
  height: `${((9.02 / 323.85) * 100).toFixed(3)}%`,
};

export function MacbookFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mb-stage relative mx-auto w-full">
      {/* lid — hinges up from the join with the base */}
      <div className="mb-lid pointer-events-none relative z-10">
        <svg viewBox="0 13 650 350" className="block w-full" aria-hidden="true">
          <path
            fill="#a4a5a7"
            d="M79.56,13.18h491.32c7.23,0,13.1,5.87,13.1,13.1v336.61H66.46V26.28c0-7.23,5.87-13.1,13.1-13.1Z"
          />
          <path
            fill="#222"
            d="M79.96,14.24h490.45c6.83,0,12.37,5.54,12.37,12.37v336.28H67.59V26.6c0-6.83,5.54-12.37,12.37-12.37Z"
          />
          <path
            fill="#000"
            d="M570.25,15.74H80.34c-6.12,0-11.08,4.96-11.08,11.08v336.07h512.08V26.82c0-6.12-4.96-11.08-11.08-11.08ZM575.74,345.17H74.52V27.31c0-3.31,2.68-5.99,5.99-5.99h489.24c3.31,0,5.99,2.68,5.99,5.99v317.86Z"
          />
          {/* the panel itself; the live screen sits on top of this */}
          <rect fill="#11150f" x="74.52" y="21.32" width="501.22" height="323.85" rx="5" ry="5" />
          <rect fill="#1d1d1d" x="69.09" y="350.51" width="512.11" height="12.48" />
        </svg>

        {/* the display cutout */}
        <div className="absolute overflow-hidden rounded-[6px]" style={SCREEN}>
          {children}

          {/* the notch — a cutout in the panel, so it paints over the screen contents */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[5px] bg-black"
            style={{ width: NOTCH.width, height: NOTCH.height }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* base — the keyboard deck, which never moves and carries the layout height */}
      <svg viewBox="0 362.5 650 24.5" className="relative -mt-px block w-full" aria-hidden="true">
        <path
          fill="#acadaf"
          d="M19.04,362.77h611.92v10.39c0,5.95-4.83,10.79-10.79,10.79H29.83c-5.95,0-10.79-4.83-10.79-10.79v-10.39h0Z"
        />
        <path
          fill="#8f9091"
          d="M278.11,362.6h94.05c0,3.63-2.95,6.58-6.58,6.58h-80.89c-3.63,0-6.58-2.95-6.58-6.58h0Z"
        />
        <polygon fill="#b9b9bb" points="600.06 385.39 567.29 385.39 565.84 383.95 601.82 383.95 600.06 385.39" />
        <polygon fill="#292929" points="598.73 386.82 568.64 386.82 567.32 385.39 600.35 385.39 598.73 386.82" />
        <polygon fill="#b9b9bb" points="82.64 385.39 49.87 385.39 48.43 383.95 84.41 383.95 82.64 385.39" />
        <polygon fill="#292929" points="81.31 386.82 51.23 386.82 49.9 385.39 82.93 385.39 81.31 386.82" />
      </svg>
    </div>
  );
}
