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
      document.title = "Likwit Developers | High-Performance Websites & UI";
      if (metaDesc)
        metaDesc.setAttribute(
          "content",
          "Likwit Developers builds blazing-fast, modern websites with clean UI, SEO optimization, and mobile-first design."
        );
      if (canonicalLink)
        canonicalLink.setAttribute("href", "https://www.likwitdevs.com/");
    };
  }, [title, description, canonical]);
}
