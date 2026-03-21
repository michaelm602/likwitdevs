import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const problems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "Phone Isn't Ringing",
    desc: "You do great work, but homeowners searching 'contractor Portland' never find you. They find your competitors — who might not even be as good.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Losing Bids to Less Qualified Competitors",
    desc: "Homeowners can't tell the difference between you and a fly-by-night operation. A professional website changes that — before you even show up to bid.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3M6.75 12H3m3.75 3H3m3.75 3H3" />
      </svg>
    ),
    title: "Your Site Looks Like It's From 2010",
    desc: "A slow, outdated site sends one message: this contractor doesn't care about details. If your website looks unprofessional, homeowners assume your work does too.",
  },
];

const solutions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Service Area SEO",
    desc: "Pages targeting Portland plus the specific neighborhoods you actually work in — Beaverton, Lake Oswego, Gresham, Tigard. Homeowners searching your trade near them find you first.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "Quote Request Forms That Convert",
    desc: "A prominent bid request form above the fold, click-to-call on every page, and a layout designed to capture homeowners the moment they decide they need help.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: "Reviews & Trust Signals Up Front",
    desc: "Google reviews embedded where homeowners see them first. License info, insurance, and years in business displayed clearly — so you win the credibility check before anyone calls.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Project Photo Galleries",
    desc: "Before/after galleries organized by project type — remodels, additions, roofing, painting. Homeowners see your actual work, not a stock photo of a hard hat.",
  },
];

const bullets = [
  "Mobile-first design — looks sharp on every phone and screen size",
  "Bid request / quote form above the fold so leads don't slip away",
  "Click-to-call button visible on every page",
  "Service area page targeting Portland and surrounding neighborhoods",
  "Project photo gallery organized by job type",
  "Google reviews embed to build trust before they call",
  "LocalBusiness schema + title tags + meta descriptions for local SEO",
  "Google Business Profile alignment and optimization advice",
  "2 rounds of revisions before launch",
];

const serviceAreas = [
  "Portland", "Beaverton", "Gresham", "Hillsboro",
  "Lake Oswego", "Tigard", "Tualatin", "Milwaukie",
  "Clackamas", "Sherwood", "Wilsonville", "Oregon City",
];

const contractorTypes = [
  {
    label: "General Contractors & Remodelers",
    desc: "Full project sites with before/after galleries, service breakdowns, and a bid form that captures homeowners mid-planning.",
  },
  {
    label: "Painters & Exterior Services",
    desc: "Portfolio-forward sites that show color transformations, communicate professionalism, and make requesting a quote frictionless.",
  },
  {
    label: "Roofers",
    desc: "Trust-heavy layouts with reviews front and center, service area coverage, and emergency contact options for storm-damage calls.",
  },
  {
    label: "Plumbers & Electricians",
    desc: "Fast, conversion-focused sites where the phone number is impossible to miss and service descriptions build confidence before anyone calls.",
  },
  {
    label: "Landscapers & Lawn Care",
    desc: "Seasonal service pages, service area coverage maps, and photo galleries that show what your finished work actually looks like.",
  },
  {
    label: "Deck & Fence Builders",
    desc: "Project showcase sites where homeowners can browse styles and materials — then request a quote on exactly what they have in mind.",
  },
];

const faqs = [
  {
    q: "Why isn't my current site generating leads?",
    a: "Usually one of three reasons: it doesn't show up on Google for the searches that matter, it loads too slowly on mobile (most homeowners search on their phone), or it buries your contact info. We audit all three when you request a free review — and tell you exactly what's costing you jobs.",
  },
  {
    q: "How does service area SEO work for contractors?",
    a: "We build dedicated pages targeting the specific cities and neighborhoods you serve — not just 'Portland' but Beaverton, Lake Oswego, Gresham, and wherever else you work. Each page is optimized for searches like 'general contractor Beaverton OR' or 'roofer Lake Oswego'. Combined with a properly set-up Google Business Profile, this is how you start showing up in the local pack.",
  },
  {
    q: "Do I need a new site or can you fix my existing one?",
    a: "Depends on what's there. If the structure is fundamentally broken — slow load times, no mobile optimization, no SEO foundation — a rebuild is usually faster and cheaper than patching. If the bones are solid, we can often improve it without starting over. We'll tell you honestly after looking at it.",
  },
  {
    q: "How long until the site starts bringing in leads?",
    a: "The site is live in 2–3 weeks. Organic SEO typically takes 60–90 days to show meaningful movement in Google — that's true of any site, not just ours. In the meantime, your site still converts anyone who finds you through word-of-mouth, referrals, or your Google Business Profile.",
  },
  {
    q: "What makes a contractor website different from a generic business site?",
    a: "A contractor site needs to do specific things: show project photos (not stock images), make the quote request form impossible to miss, display your service area clearly, and surface reviews early. Generic templates don't prioritize any of this. We build around what homeowners actually need to see before they call.",
  },
  {
    q: "How much does it cost?",
    a: "A standard contractor site — service pages, photo gallery, quote form, local SEO setup — starts at $600. More complex builds with multiple service area pages or e-commerce start higher. We'll give you a straight number after your free review, no surprise fees.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-painters", label: "Painters" },
  { to: "/web-design-for-home-services", label: "Home Services" },
  { to: "/small-business-website-design", label: "Small Business" },
  { to: "/", label: "← Homepage" },
];

export default function WebDesignContractors() {
  useSEO({
    title: "Contractor Website Design Portland | Likwit Devs",
    description:
      "Website design for Portland contractors. Service area SEO, quote request forms, and project galleries built to generate more calls and bids.",
    canonical: "https://www.likwitdevs.com/web-design-for-contractors",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Contractor Website Design in Portland — Built to Get You More Bids
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            Your schedule should be full. A better website is how you get there.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Portland homeowners search Google before they call anyone. If your site
            is slow, buried on page two, or makes it hard to request a quote —
            they hire someone else. We build contractor websites that rank locally,
            communicate credibility immediately, and turn visitors into calls.
          </p>
          <p className="mt-3 text-white/50 text-sm max-w-2xl">
            Part of our{" "}
            <Link to="/web-design-portland" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for Portland businesses
            </Link>
            {" "}— specializing in contractors, trades, and home service companies.
          </p>
          <Link to="/free-review" className="btn mt-6 inline-block">Get a Free Website Review</Link>
        </Reveal>

        {/* Problems */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Sound Familiar?</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            These are the three website problems that cost Portland contractors the most jobs.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {problems.map((p) => (
              <div key={p.title} className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 text-white">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3 text-white/80">
                  {p.icon}
                </div>
                <p className="font-semibold mb-1">{p.title}</p>
                <p className="text-white/75 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Solutions */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What We Build Instead</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            Every contractor site we build is designed around one outcome: getting homeowners to call you.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {solutions.map((s) => (
              <div key={s.title} className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 text-white">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3 text-white/80">
                  {s.icon}
                </div>
                <p className="font-semibold mb-1">{s.title}</p>
                <p className="text-white/75 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Service Area SEO callout */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
          <h2 className="text-xl font-semibold mb-3">Service Area SEO for Portland Contractors</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-2xl">
            Most contractor sites target "Portland" and stop there. But homeowners search for contractors
            in their specific neighborhood — Beaverton, Lake Oswego, Gresham. We build service area pages
            that target each city you work in, so you show up for the searches that actually convert.
            Combined with LocalBusiness schema and a properly structured Google Business Profile, this
            is how you get into the local pack — not just the organic results.
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm text-white/75"
              >
                {area}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Who This Is For */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Who This Is For</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            We build for contractors and trade businesses across the Portland metro. If you're
            primarily a painter, we have a dedicated page on{" "}
            <Link to="/web-design-for-painters" className="text-white/80 underline underline-offset-2 hover:text-white transition">
              painter website design in Portland
            </Link>
            .
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {contractorTypes.map(({ label, desc }) => (
              <div key={label} className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5">
                <p className="text-white font-semibold mb-1">{label}</p>
                <p className="text-white/75 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* What's Included */}
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

        {/* Mid-page CTA */}
        <Reveal y={16} once>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white font-semibold">Not sure if your site is the problem?</p>
              <p className="text-white/60 text-sm mt-1">
                Get a free audit — we'll show you exactly what's costing you leads, in plain language.
              </p>
            </div>
            <Link to="/free-review" className="btn whitespace-nowrap flex-shrink-0">
              Get a Free Review
            </Link>
          </div>
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

        {/* Final CTA */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to fill your schedule with better jobs?</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            Get a free review of your current site — or let's build something that brings in leads
            while you're on the job. No fluff, just a straight breakdown of what to fix and how.
          </p>
          <Link to="/free-review" className="btn">Get a Free Website Review</Link>
          <p className="mt-4 text-white/40 text-xs">
            Portland-based · responds within 1 business day · no obligation
          </p>
        </Reveal>

      </div>
    </section>
  );
}
