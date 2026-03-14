import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Portfolio gallery showcasing each artist's work",
  "Artist roster page — individual bios, styles, and booking links",
  "Online booking integration (Vagaro, Square, or your existing system)",
  "Mobile-first design — clients browse portfolios on their phones",
  "Click-to-call and contact form for walk-in inquiries",
  "Local SEO setup so Portland clients find your shop first",
  "Google reviews embed to build trust before they book",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Artist Portfolio",
    desc: "Each artist gets their own gallery section — styles, flash sheets, and healed work displayed cleanly.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Booking Ready",
    desc: "Clients book directly from the site — whether you're on Vagaro, Square, or a custom booking flow.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Found on Google",
    desc: "Local SEO built in so when someone searches 'tattoo shop Portland' — your shop shows up.",
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
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/website-design-for-tattoo-artists", label: "Tattoo Artists" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/small-business-website-design", label: "Small Business" },
];

export default function WebDesignTattooShops() {
  useSEO({
    title: "Website Design for Tattoo Shops | Likwit Devs",
    description:
      "Web design for tattoo shops in Portland, OR. Artist portfolios, online booking, and local SEO — built to fill your calendar.",
    canonical: "https://www.likwitdevs.com/web-design-for-tattoo-shops",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Website Design for Tattoo Shops</h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            Fill your calendar. Showcase your artists. Own your brand online.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Clients look up your shop before they walk in — and they're judging your work on a phone screen.
            We build tattoo shop websites that show off each artist's portfolio, make booking easy, and rank
            on Google when someone searches for a shop in Portland.
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
