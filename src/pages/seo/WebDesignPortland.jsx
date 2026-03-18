import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Mobile-first responsive design — looks right on every screen",
  "Fast load times — Core Web Vitals optimised from the start",
  "Clean, conversion-focused layout with clear CTAs",
  "Contact form, booking, or payment integration",
  "Google Analytics setup included",
  "Local SEO setup (Google Business Profile-ready)",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-6 3h.008v.008H6.75v-.008Z" />
      </svg>
    ),
    title: "Get Found on Mobile",
    desc: "Over 60% of Portland searches happen on a phone. Your site loads fast, looks sharp, and makes it dead simple for customers to call or book.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Show Up on Google",
    desc: "We build with local SEO baked in — proper structure, metadata, and Google Business Profile compatibility so Portland customers find you first.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "Turn Visitors into Leads",
    desc: "Prominent phone numbers, clear quote forms, and CTAs placed where buyers look — so every visitor has a reason to reach out.",
  },
];

const businessTypes = [
  {
    label: "Contractors & Trades",
    desc: "Roofers, plumbers, electricians, and general contractors who need calls from homeowners ready to hire.",
  },
  {
    label: "Salons & Beauty",
    desc: "Hair stylists, barbers, nail techs, and estheticians who want more bookings without relying on social media alone.",
  },
  {
    label: "Local Shops & Studios",
    desc: "Retail shops, fitness studios, and creative businesses that need a professional web presence to compete locally.",
  },
  {
    label: "Service Businesses",
    desc: "Cleaners, movers, photographers, and anyone who sells a service — and needs their website to do the selling.",
  },
];

const faqs = [
  {
    q: "Do you work with businesses outside Portland?",
    a: "We work with businesses anywhere but specialize in Portland-area companies who want a local partner who understands the market.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Most sites are ready in 2–4 weeks depending on complexity and how quickly you can provide content and feedback.",
  },
  {
    q: "What does a website cost?",
    a: "Packages start at $300 for a single-page landing site and go up to $1,000+ for e-commerce or booking systems. Check our pricing page for full details.",
  },
  {
    q: "Do you handle hosting?",
    a: "Yes — our Care Plan ($49/mo) covers hosting, updates, and basic content edits so you never have to worry about the technical side.",
  },
  {
    q: "Why does my Portland business need a modern website to get more leads?",
    a: "Most customers search online before they call — and if your site is slow, hard to navigate, or missing on mobile, they move on to a competitor. A well-built site works like a 24/7 salesperson: it earns trust, answers questions, and pushes visitors to take action before they ever pick up the phone.",
  },
];

const relatedLinks = [
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/web-design-for-restaurants", label: "Restaurants & Food" },
  { to: "/web-design-for-home-services", label: "Home Services" },
  { to: "/small-business-website-design", label: "Small Business" },
];

export default function WebDesignPortland() {
  useSEO({
    title: "Web Design in Portland, OR | Likwit Devs",
    description:
      "Affordable web design for Portland small businesses. Fast, mobile-first sites that help local customers find you.",
    canonical: "https://www.likwitdevs.com/web-design-portland",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Web Design in Portland, OR — Built to Get You More Clients
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            Fast, mobile-first websites for Portland small businesses that need more calls, bookings, and leads.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            We build clean, conversion-focused websites for contractors, shops, salons, and service businesses
            across Portland. No templates, no bloat — just sites that load fast, rank locally, and make it
            easy for the right customers to find and contact you.
          </p>
          <Link to="/free-review" className="btn mt-6 inline-block">Get a Free Website Review</Link>
        </Reveal>

        {/* Feature cards */}
        <Reveal y={24} once>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 text-white">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3 text-white/80">
                  {f.icon}
                </div>
                <p className="font-semibold mb-1">{f.title}</p>
                <p className="text-white/75 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Who This Is For */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Who This Is For</h2>
          <p className="text-white/70 mb-6 max-w-2xl">
            We work best with local Portland businesses that are serious about growing and ready to invest in a site that actually performs.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {businessTypes.map(({ label, desc }) => (
              <div key={label} className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5">
                <p className="text-white font-semibold mb-1">{label}</p>
                <p className="text-white/75 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* What's included */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
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
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map(({ q, a }) => (
                <div key={q}>
                  <p className="font-medium text-white">{q}</p>
                  <p className="mt-1 text-white/75 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
        </Reveal>

        {/* Internal links */}
        <Reveal y={16} once>
          <p className="text-white/80 text-xs uppercase tracking-wider mb-3">Also serving Portland businesses in:</p>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-sm text-white/85 hover:text-white hover:bg-black/70 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to get more clients from your website?</h2>
            <p className="text-white/75 mb-6">
              Get a free, no-pressure review of your current site — or let's talk about building something that actually works for your business.
            </p>
            <Link to="/free-review" className="btn">Get a Free Website Review</Link>
        </Reveal>

      </div>
    </section>
  );
}
