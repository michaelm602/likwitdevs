import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Mobile-first design — looks sharp on every phone and screen size",
  "Prominent quote request form above the fold so leads don't slip away",
  "Click-to-call button that works instantly on mobile",
  "Service area map or city/neighborhood list to clarify your coverage",
  "Google reviews embed to build trust before they ever call",
  "Local SEO setup — title tags, meta descriptions, and LocalBusiness schema",
  "Services page structure optimized for what you do and where you do it",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "More Calls, More Quote Requests",
    desc: "A prominent phone number, click-to-call button, and quote form placed where homeowners look — so anyone ready to hire has no reason not to reach out.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: "Build Trust Before They Call",
    desc: "Google reviews front and center, a professional layout, and clear service descriptions — so homeowners feel confident hiring you before they even pick up the phone.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Show Up in Local Search",
    desc: "Local SEO built in from day one — so when someone nearby searches for your trade, your site shows up and your competitors' doesn't.",
  },
];

const businessTypes = [
  {
    label: "General Contractors & Remodelers",
    desc: "Contractors who need a site that communicates professionalism, shows past work, and drives quote requests from homeowners planning projects.",
  },
  {
    label: "Landscapers & Lawn Care",
    desc: "Landscaping businesses that need local visibility, a clear service list, and an easy way for customers to request a seasonal estimate.",
  },
  {
    label: "Painters & Exterior Services",
    desc: "Painters, pressure washers, and exterior service pros who rely on local search and word-of-mouth — and need a site that backs up their reputation.",
  },
  {
    label: "Plumbers, Electricians & Roofers",
    desc: "Trade businesses where trust and speed matter most. A site that loads fast, shows reviews, and makes it effortless to call or request service.",
  },
];

const faqs = [
  {
    q: "Why does a home service business need a strong website?",
    a: "Most homeowners search online before they call anyone — and if your site looks outdated, loads slowly, or buries your phone number, they move on to the next result. A well-built site acts as your best salesperson: it answers their questions, shows your reviews, and makes it easy to contact you before a competitor even gets a look.",
  },
  {
    q: "Does local SEO actually help contractors get more jobs?",
    a: "Yes — local SEO means showing up when someone nearby searches 'roofer near me' or 'Portland electrician'. We build proper LocalBusiness schema, optimize your title tags, and structure your pages around the services and locations you want to rank for. Combined with a Google Business Profile, it's the most reliable way to generate consistent inbound leads.",
  },
  {
    q: "Can the site show my service area?",
    a: "Yes — we can include a service area map, a list of neighborhoods or cities you cover, or both. This also helps with local SEO for each area you serve.",
  },
  {
    q: "What if I'm not tech-savvy?",
    a: "That's exactly who we build for. We handle everything and explain it in plain language. You just need to approve the design — no technical knowledge required.",
  },
  {
    q: "How do I get more quote requests from the site?",
    a: "We design specifically for this — a prominent quote form near the top of the page, a visible phone number on every screen, fast mobile load times, and clear service descriptions that confirm you cover the customer's area. The goal is to remove every reason someone might leave without reaching out.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-contractors", label: "Contractors" },
  { to: "/web-design-for-painters", label: "Painters" },
  { to: "/small-business-website-design", label: "Small Business" },
  { to: "/", label: "← Homepage" },
];

export default function WebDesignHomeServices() {
  useSEO({
    title: "Home Service Website Design Portland (More Calls, Less Guesswork)",
    description:
      "If your phone isn't ringing, your site isn't working. We build home service websites that rank locally and drive real leads.",
    canonical: "https://www.likwitdevs.com/web-design-for-home-services",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Websites for Contractors & Home Service Businesses That Generate Real Leads
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            More calls. More quote requests. More jobs booked — without chasing leads.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Homeowners Google contractors before they call anyone. If your site is slow, hard to navigate,
            or buried on page two, they hire someone else. We build fast, professional websites for home
            service businesses that rank locally, build trust immediately, and make it effortless for
            customers to reach you the moment they decide they need help.
          </p>
          <p className="mt-3 text-white/50 text-sm max-w-2xl">
            Part of our{" "}
            <Link to="/web-design-portland" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for Portland businesses
            </Link>
            {" "}— covering contractors, trades, and all local service industries. Looking for more
            specific help? See our pages for{" "}
            <Link to="/web-design-for-contractors" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for contractors in Portland
            </Link>
            {" "}and{" "}
            <Link to="/web-design-for-painters" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              painter websites
            </Link>
            .
          </p>
          <Link to="/free-review" className="btn mt-6 inline-block">Find Out What Your Website Is Costing You →</Link>
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
            We build for home service businesses that depend on inbound calls, local search, and
            a professional reputation. If your phone needs to ring more, this is for you.
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
          <p className="text-white/80 text-xs uppercase tracking-wider mb-3">Related services:</p>
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
          <h2 className="text-2xl font-bold mb-2">Ready to get more calls and fill your schedule?</h2>
          <p className="text-white/75 mb-6">
            Get a free review of your current site — or let's build something that works as hard as you do
            and brings in leads while you're on the job.
          </p>
          <Link to="/free-review" className="btn">Find Out What Your Website Is Costing You →</Link>
        </Reveal>

      </div>
    </section>
  );
}
