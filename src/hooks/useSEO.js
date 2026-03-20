import { useEffect } from "react";

/**
 * Sets page-level SEO meta on mount / when values change.
 * Targets tags that already exist in index.html so no extra DOM nodes are created.
 */
export default function useSEO({ title, description, canonical }) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute("href", canonical);

    // Reset to defaults on unmount so the homepage values are restored
    return () => {
      document.title = "Web Design Portland – Get More Calls & Win More Clients";
      if (metaDesc)
        metaDesc.setAttribute(
          "content",
          "We build websites for Portland contractors and local service businesses that turn traffic into calls and paying clients — and we work with clients nationwide."
        );
      if (canonicalLink)
        canonicalLink.setAttribute("href", "https://www.likwitdevs.com/");
    };
  }, [title, description, canonical]);
}
