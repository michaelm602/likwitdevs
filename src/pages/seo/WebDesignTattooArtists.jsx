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
  "Local SEO so Portland clients find you when searching your style",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Portfolio-First",
    desc: "Your work leads. A clean, fast gallery that looks better than a grid of Instagram screenshots on a prospective client's phone.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: "Your Brand, Your Voice",
    desc: "A site that reflects your style — not a cookie-cutter template. The design matches the energy of your work.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Book While You Ink",
    desc: "Booking requests come in while you're tattooing. A clean inquiry form or integrated booking tool handles it.",
  },
];

const faqs = [
  {
    q: "Is a website better than just using Instagram?",
    a: "Instagram is great for discovery, but a website you own is more credible, shows up on Google, and doesn't disappear if your account gets flagged. It's also where serious clients go to decide whether to reach out.",
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
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-tattoo-shops", label: "Tattoo Shops" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/small-business-website-design", label: "Small Business" },
];

export default function WebDesignTattooArtists() {
  useSEO({
    title: "Website Design for Tattoo Artists | Likwit Devs",
    description:
      "Portfolio websites for independent tattoo artists in Portland, OR. Built to showcase your style, take bookings, and rank on Google.",
    canonical: "https://www.likwitdevs.com/website-design-for-tattoo-artists",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Website Design for Tattoo Artists</h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            A portfolio that works as hard as you do — and keeps booking you even when you're off Instagram.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Your art deserves better than a grid of screenshots. We build portfolio sites for independent
            tattoo artists that show your work in its best light, make it easy for the right clients to
            book you, and give you a permanent home on the web that you actually own.
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
