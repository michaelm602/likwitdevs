import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Mobile-first design that looks professional on every screen",
  "Fast load times — Core Web Vitals optimised from the start",
  "Clean layout with clear calls-to-action",
  "Contact form, booking, or payment integration",
  "Google Analytics setup included",
  "On-page SEO — title tags, meta descriptions, heading structure",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    ),
    title: "Custom-Coded",
    desc: "No page builders, no templates. A site built for your business that you own outright — not locked to a platform.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Found on Google",
    desc: "SEO built into every page — so when someone searches for what you do in Portland, you show up.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Built to Convert",
    desc: "Clear CTAs, fast load times, and a layout designed to turn visitors into leads — not just visitors.",
  },
];

const faqs = [
  {
    q: "I already have a website. Can you redesign it?",
    a: "Yes — redesigns are one of our most common projects. We'll assess what's working, keep what matters, and rebuild the rest with a clean, fast, modern stack.",
  },
  {
    q: "Do I need to know anything technical?",
    a: "Not at all. We handle design, development, hosting, and launch. You review and approve the work at each step — that's it.",
  },
  {
    q: "What happens after the site launches?",
    a: "We offer optional maintenance plans starting at $49/mo that cover hosting, updates, and content edits. Or you can take it fully self-managed — your call.",
  },
  {
    q: "How is Likwit Devs different from Squarespace or Wix?",
    a: "We build custom-coded sites that are faster, more flexible, and not locked to any platform. You own your site completely — no monthly subscription just to keep it live.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/web-design-for-restaurants", label: "Restaurants & Food" },
  { to: "/web-design-for-home-services", label: "Home Services" },
];

export default function SmallBusinessWebDesign() {
  useSEO({
    title: "Small Business Website Design | Likwit Devs",
    description:
      "Affordable small business website design. Fast, mobile-first sites that help customers find you and take action.",
    canonical: "https://www.likwitdevs.com/small-business-website-design",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Small Business Website Design</h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            A site that works as hard as you do.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            We build websites for small businesses that need to look professional, load fast, and show
            up on Google. No bloated page builders, no monthly subscriptions for a template. Just a
            clean site that actually brings in customers.
          </p>
          <Link to="/free-review" className="btn mt-6 inline-block">Get a Free Website Review</Link>
        </Reveal>

        {/* Feature cards */}
        <Reveal y={24} once>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/5 border border-white/10 p-5 text-white">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3 text-white/80">
                  {f.icon}
                </div>
                <p className="font-semibold mb-1">{f.title}</p>
                <p className="text-white/60 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* What's included */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-black/20 backdrop-blur-md p-6 md:p-10 text-white">
            <h2 className="text-xl font-semibold mb-6">What's Included</h2>
            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <Reveal key={b} y={8} delay={80 + i * 40}>
                  <li className="flex gap-2 text-white/75">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
        </Reveal>

        {/* FAQ */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-black/20 backdrop-blur-md p-6 md:p-10 text-white">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map(({ q, a }) => (
                <div key={q}>
                  <p className="font-medium text-white">{q}</p>
                  <p className="mt-1 text-white/60 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
        </Reveal>

        {/* Internal links */}
        <Reveal y={16} once>
          <p className="text-white/40 text-xs uppercase tracking-wide mb-3">Also serving Portland businesses in:</p>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/60 hover:text-white/90 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-black/20 backdrop-blur-md p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-white/60 mb-6">Get a free review of your current site — or let's talk about building something new.</p>
            <Link to="/free-review" className="btn">Get a Free Website Review</Link>
        </Reveal>

      </div>
    </section>
  );
}
