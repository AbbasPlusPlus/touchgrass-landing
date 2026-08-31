"use client";

import { useState } from "react";

/** The one-line installer: Terminal downloads carry no quarantine flag, so this
 *  path never hits the Gatekeeper "Apple could not verify…" dialog that the zip does. */
export const CURL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/AbbasPlusPlus/touchgrass-releases/main/install.sh | sh";

function CommandRow({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mx-auto mt-3 max-w-xl text-left">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-55">
        {label}
      </div>
      <button
        type="button"
        className="glass group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-mono text-[13px] text-ink/90 transition hover:brightness-110"
        onClick={() => {
          navigator.clipboard.writeText(command).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        }}
        aria-label={`Copy ${label} command`}
      >
        {/* Long commands still scroll, but the bar itself is hidden — Copy is the
            intended path, and a chrome scrollbar inside a glass pill looks broken. */}
        <span className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {command}
        </span>
        <span className="ml-auto shrink-0 rounded-md border border-ink/15 px-2 py-1 text-[11px] font-semibold tracking-wide opacity-70 group-hover:opacity-100">
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
}

export function InstallCommand() {
  return (
    <div className="mt-8">
      {/* One line, nothing to install first, works on any Mac. */}
      <CommandRow label="Paste this into Terminal" command={CURL_COMMAND} />
    </div>
  );
}
