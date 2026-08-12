import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
const homepageHtml = await readFile(indexPath, "utf8");

const pages = [
  {
    route: "services",
    title: "Web Design, Booking Systems & Custom Software Portland | Likwit Devs",
    description:
      "Portland web design studio building websites, booking systems, customer portals, intake workflows, and custom software for small businesses. Starting at $800.",
    canonical: "https://www.likwitdevs.com/services",
    heading: "Build the Systems Your Business Runs On",
  },
  {
    route: "web-design-portland",
    title: "Portland Web Design for Small Businesses | Starting at $300 | Likwit Devs",
    description:
      "Portland web design starting at $300. Mobile-first, local SEO built in, no templates. Work directly with one developer. Free site review →",
    canonical: "https://www.likwitdevs.com/web-design-portland",
    heading: "Web Design for Portland Businesses That Need More Calls",
  },
];

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Could not find ${label} in the built index.html`);
  }

  return html.replace(pattern, replacement);
}

function buildPageHtml(page) {
  let html = homepageHtml;

  html = replaceRequired(
    html,
    /<title>.*?<\/title>/s,
    `<title>${page.title}</title>`,
    "the title element"
  );
  html = replaceRequired(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${page.description}" />`,
    "the meta description"
  );
  html = replaceRequired(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${page.canonical}" />`,
    "the canonical link"
  );
  html = replaceRequired(
    html,
    /(<h1 class="sr-only" data-static-seo-heading>).*?(<\/h1>)/s,
    `$1${page.heading}$2`,
    "the static SEO heading"
  );

  return html;
}

for (const page of pages) {
  const routeDir = path.join(distDir, page.route);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), buildPageHtml(page));
}

await writeFile(path.join(distDir, "404.html"), homepageHtml);
