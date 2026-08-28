import { Backdrop } from "@/components/Backdrop";
import { BreakScreen } from "@/components/BreakScreen";
import { Closing } from "@/components/Closing";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { deployedUrl, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "macOS 26",
  description: site.tagline,
  url: deployedUrl,
  downloadUrl: site.download,
  softwareVersion: site.version,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Backdrop />

      <div id="top" className="relative z-[8]">
        <main id="main">
          <Hero />
          <BreakScreen />
          <Features />
          <Closing />
        </main>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
