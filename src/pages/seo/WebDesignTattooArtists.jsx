import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Portfolio-first design — your work is the hero of every page",
  "Style filtering so clients find the exact aesthetic they're looking for",
  "Online booking integration (Vagaro, Booksy, Square, or a custom inquiry form)",
  "Mobile-first layout — because clients are browsing on their phones",
  "About section to tell your story and build client trust",
  "Flash available / waitlist section to capture interest between bookings",
  "Guest spot or travel schedule section",
  "Local SEO so clients searching your style find you first",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "A Gallery That Does Your Work Justice",
    desc: "Fast, clean portfolio layouts that show your pieces the way they deserve — not compressed into an Instagram grid on a small screen.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: "Your Brand, Your Identity",
    desc: "A site that matches the energy and aesthetic of your work — not a generic template. Clients feel your style before they even reach out.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Bookings While You're Tattooing",
    desc: "Inquiry forms and booking integrations handle incoming requests while you're working — so you never miss a potential client because you were too busy to reply.",
  },
];

const artistTypes = [
  {
    label: "Independent Artists",
    desc: "Artists working solo out of a private studio or renting a chair who want a professional presence that's fully their own.",
  },
  {
    label: "Apprentices Building a Portfolio",
    desc: "Early-career artists who want to document their growth, attract the right early clients, and look credible from the start.",
  },
  {
    label: "Established Artists Seeking Better Clients",
    desc: "Artists with strong work who are tired of vague inquiries and want a site that pre-qualifies clients by showing exactly what they do.",
  },
  {
    label: "Instagram-Heavy Artists Without a Website",
    desc: "Artists whose entire presence lives on Instagram — and who want something they actually own that shows up in Google search results.",
  },
];

const faqs = [
  {
    q: "Is a website better than just using Instagram?",
    a: "Instagram is great for discovery, but a website you own is more credible, shows up on Google, and doesn't disappear if your account gets flagged. It's also where serious clients go to decide whether to book — and a well-built portfolio converts that interest into inquiries.",
  },
  {
    q: "Can I show different styles in separate galleries?",
    a: "Yes — we can organize your portfolio by style (e.g. traditional, blackwork, neo-trad, fine line) so clients quickly find examples that match what they want.",
  },
  {
    q: "What if I travel or do guest spots?",
    a: "We can add a guest spot or travel schedule section so clients in other cities know when you'll be nearby — and can book ahead.",
  },
  {
    q: "How do I handle flash availability or waitlists?",
    a: "We can add a flash available section with images you swap out, or a simple waitlist form for clients to drop their email and get notified when you open bookings.",
  },
  {
    q: "How does a portfolio website help me attract better clients?",
    a: "When your site is organized by style, tells your story, and shows healed work alongside fresh pieces, clients self-select before they reach out. You get fewer 'how much for a sleeve' messages and more people who already know your work, trust your process, and are ready to commit.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-tattoo-shops", label: "Tattoo Shops & Studios" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/small-business-website-design", label: "Small Business" },
];

export default function WebDesignTattooArtists() {
  useSEO({
    title: "Portfolio Websites for Tattoo Artists | Likwit Devs",
    description:
      "Portfolio websites for independent tattoo artists. Showcase your style, attract better clients, and take bookings — without relying on Instagram alone.",
    canonical: "https://www.likwitdevs.com/website-design-for-tattoo-artists",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Portfolio Websites for Tattoo Artists — Attract Better Clients, Book More Work
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            Your art deserves a home that's more than a grid of Instagram screenshots.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            We build portfolio sites for independent tattoo artists that present your work with real
            context, tell your story as an artist, and give serious clients a reason to reach out —
            not just scroll past. A site you own, that works around the clock, and that shows up
            on Google when the right people are looking.
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
            This page is specifically for individual tattoo artists — not shops or studios. If you're
            running a multi-artist operation,{" "}
            <Link to="/web-design-for-tattoo-shops" className="text-white/80 underline underline-offset-2 hover:text-white transition">
              see our Tattoo Shop page instead
            </Link>
            .
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {artistTypes.map(({ label, desc }) => (
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
          <h2 className="text-2xl font-bold mb-2">Ready to build a portfolio that books better clients?</h2>
          <p className="text-white/75 mb-6">
            Get a free review of your current online presence — or let's talk about building a site
            that represents your work the way it deserves.
          </p>
          <Link to="/free-review" className="btn">Get a Free Website Review</Link>
        </Reveal>

      </div>
    </section>
  );
}
