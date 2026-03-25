import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Portfolio gallery showcasing each artist's work by style",
  "Artist roster page — individual bios, styles, and booking links",
  "Online booking integration (Vagaro, Square, Booksy, or custom)",
  "Mobile-first design — clients browse portfolios on their phones",
  "Click-to-call and contact form for walk-in and appointment inquiries",
  "Local SEO setup so nearby clients find your shop on Google",
  "Google reviews embed to build trust before they book",
  "Flash sheet or limited availability section",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Showcase Every Artist",
    desc: "Each artist gets their own gallery section — styles, flash sheets, and healed work displayed cleanly so clients find the right person before they even reach out.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Fill Your Calendar",
    desc: "Clients book directly from the site through your existing platform — Vagaro, Square, Booksy, or a custom flow. Fewer DMs, more confirmed appointments.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Get Found Locally",
    desc: "Local SEO built in from day one — so when someone searches for a tattoo shop near them, your name comes up before the competition.",
  },
];

const businessTypes = [
  {
    label: "Tattoo Shops",
    desc: "Multi-artist shops that need a professional home base to showcase the whole team, handle bookings, and rank locally.",
  },
  {
    label: "Private Studios",
    desc: "By-appointment-only studios that want a polished, minimal presence that communicates exclusivity and quality.",
  },
  {
    label: "Solo Artists Operating Independently",
    desc: "Artists running their own space who need a site that handles their bookings and portfolio without a shop behind them.",
  },
  {
    label: "Instagram-Only Businesses",
    desc: "Shops and artists whose only web presence is an Instagram page — and who are losing clients to competitors with real websites.",
  },
];

const faqs = [
  {
    q: "Can each artist have their own portfolio section?",
    a: "Yes — we can build individual gallery sections or pages for each artist, organized by style, so clients find the right person before they even reach out.",
  },
  {
    q: "Can we integrate our booking system?",
    a: "We connect your existing platform (Vagaro, Square Appointments, Booksy, or others) directly to the site. Or we can help you pick one if you're starting fresh.",
  },
  {
    q: "What about flash sales or limited availability?",
    a: "We can add a section for flash sheets, available designs, or limited appointment slots — updated as often as you need.",
  },
  {
    q: "Can I update the site myself after launch?",
    a: "With our Care Plan, just send us the new images or info and we handle it. Or we can set up a simple CMS so you can make edits yourself — whatever fits your workflow.",
  },
  {
    q: "Why isn't Instagram enough for my tattoo business?",
    a: "Instagram is great for discovery, but it doesn't show up in Google searches, it can get flagged or restricted, and it doesn't let clients book directly or read reviews. A website gives you a credible home base that works around the clock — even when you're not posting.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/website-design-for-tattoo-artists", label: "Tattoo Artist Portfolios" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/small-business-website-design", label: "Small Business" },
  { to: "/", label: "← Homepage" },
];

export default function WebDesignTattooShops() {
  useSEO({
    title: "Empty Chairs Cost More Than a Website",
    description:
      "If clients can't find your shop or can't book online easily, they're going somewhere else tonight. We build tattoo shop websites that keep your artists busy and your chairs full.",
    canonical: "https://www.likwitdevs.com/web-design-for-tattoo-shops",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Tattoo Websites That Fill Calendars and Build Your Brand
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            For tattoo shops, private studios, and solo artists who need more than an Instagram page.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Clients look you up before they walk in — and they're judging your work on a phone screen.
            We build tattoo industry websites that showcase every artist's portfolio, make booking
            frictionless, and show up on Google when someone nearby is ready to get tattooed.
          </p>
          <p className="mt-3 text-white/50 text-sm max-w-2xl">
            Part of our{" "}
            <Link to="/web-design-portland" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for Portland businesses
            </Link>
            . Individual artist?{" "}
            <Link to="/website-design-for-tattoo-artists" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              See our tattoo artist portfolio sites
            </Link>
            .
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
            We build for all corners of the tattoo industry — from busy multi-artist shops to solo artists
            working by appointment only.
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

        {/* Individual artist callout */}
        <Reveal y={24} once className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-8 text-white">
          <h2 className="text-lg font-semibold mb-1">Are you an individual tattoo artist?</h2>
          <p className="text-white/75 text-sm mb-4 max-w-2xl">
            If you're a solo artist focused on personal branding, portfolio presentation, and attracting
            better-fit clients — we have a dedicated page built specifically for you.
          </p>
          <Link
            to="/website-design-for-tattoo-artists"
            className="self-start text-sm text-white/80 hover:text-white transition underline underline-offset-4"
          >
            See Tattoo Artist Portfolio Sites →
          </Link>
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
          <h2 className="text-2xl font-bold mb-2">Ready to stop losing clients to a better website?</h2>
          <p className="text-white/75 mb-6">
            Get a free review of your current site — or let's talk about building something that books for you around the clock.
          </p>
          <Link to="/free-review" className="btn">Get a Free Website Review</Link>
        </Reveal>

      </div>
    </section>
  );
}
