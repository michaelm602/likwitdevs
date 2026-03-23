import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import useSEO from "../hooks/useSEO";

const webDevBullets = [
  "Mobile-first responsive design — looks right on every screen",
  "Fast load times — Core Web Vitals optimised from the start",
  "Clean, conversion-focused layout with clear CTAs",
  "Contact form, booking, or payment integration",
  "Google Analytics setup included",
  "2 rounds of revisions before launch",
];

const seoBullets = [
  "Title tags & meta descriptions for every page",
  "Heading structure (H1 / H2 / H3) optimised for topic clarity",
  "Keyword placement without stuffing",
  "Image alt text for accessibility and search crawlers",
  "Page speed improvements (compression, lazy load, caching headers)",
  "Sitemap & robots.txt correctly configured",
  "Schema markup (LocalBusiness / FAQ) where applicable",
];

function BulletList({ items }) {
  return (
    <ul className="space-y-2 text-white/75 mb-8">
      {items.map((item, i) => (
        <Reveal key={item} y={8} delay={100 + i * 40}>
          <li className="flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60 flex-shrink-0" />
            <span>{item}</span>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

export default function Services() {
  useSEO({
    title: "Web Design & SEO Services | Likwit Devs",
    description:
      "Likwit Devs offers fast web design and on-page SEO services for small businesses in Portland, OR and beyond.",
    canonical: "https://www.likwitdevs.com/services",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Page header */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Web Design & SEO Services for Small Businesses
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            We build fast, conversion-focused websites that help small businesses get found on Google,
            generate more calls, and turn visitors into paying clients. No fluff, no bloat.
          </p>
        </Reveal>

        {/* Web Design & Development */}
        <Reveal y={24} once className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/80">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Web Design & Development</h2>
            <p className="text-white/75 mb-6 max-w-2xl">
              We build mobile-first websites designed to get you more calls and bookings.
              Every layout, heading, and button is structured to push visitors toward action — not just look good.
            </p>
            <BulletList items={webDevBullets} />
            <Link to="/contact?intent=quote-webdev" className="btn">Get a Quote</Link>
        </Reveal>

        {/* On-Page SEO */}
        <Reveal y={24} once className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/80">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">On-Page SEO</h2>
            <p className="text-white/75 mb-6 max-w-2xl">
              We set up your site so Google can find it and rank it. Local search, structured data,
              and clean on-page signals that put you in front of customers already looking for what you offer.
            </p>
            <BulletList items={seoBullets} />
            <Link to="/contact?intent=quote-seo" className="btn">Get a Quote</Link>
        </Reveal>

        {/* Industry-Specific Services */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Explore Industry-Specific Services
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl">
            We specialize in a few key industries. If your business is listed below, we already know
            what your site needs to compete locally.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                heading: "Web Design in Portland, OR",
                description: "Local web design built for Portland businesses that want to show up and stand out.",
                href: "/web-design-portland",
              },
              {
                heading: "Small Business Websites",
                description: "Affordable, professional websites for small businesses that need more leads — not just a web presence.",
                href: "/small-business-website-design",
              },
              {
                heading: "Contractor & Home Service Websites",
                description: "Sites built for contractors, tradespeople, and home service pros who need calls coming in.",
                href: "/web-design-for-contractors",
              },
              {
                heading: "Tattoo Shop Websites",
                description: "Booking-ready websites for tattoo artists and studios that want to fill their calendar.",
                href: "/web-design-for-tattoo-shops",
              },
            ].map(({ heading, description, href }) => (
              <div
                key={href}
                className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 flex flex-col gap-3"
              >
                <div>
                  <h3 className="text-white font-semibold text-lg">{heading}</h3>
                  <p className="text-white/75 text-sm mt-1">{description}</p>
                </div>
                <Link to={href} className="self-start text-sm text-white/80 hover:text-white transition underline underline-offset-4">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
