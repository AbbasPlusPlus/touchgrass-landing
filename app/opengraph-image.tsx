import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — a break reminder for macOS`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = ["You haven\u2019t blinked in a while"];

/**
 * Fraunces, for the share card only. Google serves TrueType when the request
 * carries no modern-browser UA, which is what satori can parse. If the build
 * has no network the card just falls back to the built-in sans.
 */
async function frauncesTTF(text: string) {
  try {
    const api = `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400&text=${encodeURIComponent(text)}`;
    const css = await fetch(api).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const mark = readFileSync(join(process.cwd(), "public", "mark.svg"), "utf8");
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;

  const data = await frauncesTTF(HEADLINE.join(""));
  const display = data ? "Fraunces" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg,#131a1c 0%,#1b2420 18%,#2b3324 38%,#4a4a29 60%,#7a5f30 78%,#3a3520 100%)",
          color: "#f2eeda",
          textAlign: "center",
          padding: "0 90px",
        }}
      >
        <img src={markSrc} width={112} height={112} alt="" style={{ marginBottom: 42 }} />
        {HEADLINE.map((line) => (
          <div
            key={line}
            style={{ display: "flex", fontFamily: display, fontSize: 66, lineHeight: 1.16, letterSpacing: "-0.02em" }}
          >
            {line}
          </div>
        ))}
        <div style={{ display: "flex", marginTop: 36, fontSize: 26, color: "#bdbfa8" }}>
          {site.name} · {site.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: data ? [{ name: "Fraunces", data, style: "normal", weight: 400 }] : undefined,
    },
  );
}
