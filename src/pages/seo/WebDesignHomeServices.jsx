import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Mobile-first design built for on-the-go homeowners",
  "Prominent quote request form above the fold",
  "Service area map or list of neighborhoods/cities you cover",
  "Click-to-call button for instant contact",
  "Google reviews embed to build trust before they call",
  "Local SEO setup — title tags, meta, schema markup",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "Quote Requests",
    desc: "A prominent form and click-to-call button so customers can reach you the moment they decide they need help.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: "Reviews Front & Center",
    desc: "Embed your Google reviews so new customers see your 5-star track record before they even pick up the phone.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Service Area",
    desc: "Show exactly where you work — a map, a city list, or both — so the right customers know you'll come to them.",
  },
];

const faqs = [
  {
    q: "Can the site show my service area?",
    a: "Yes — we can include a service area map, a list of neighborhoods or cities you cover, or both. This also helps with local SEO for each area you serve.",
  },
  {
    q: "What if I'm not tech-savvy?",
    a: "That's exactly who we build for. We handle everything and explain it in plain language. You just need to approve the design — no technical knowledge required.",
  },
  {
    q: "Can I get customer reviews on my site?",
    a: "Yes — we can embed your Google reviews directly so new customers see your track record before they decide to call.",
  },
  {
    q: "How do I get more quote requests from the site?",
    a: "We design specifically for this — clear CTAs, a prominent phone number, fast mobile load times, and a quote form near the top of the page so visitors don't have to go looking.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/web-design-for-restaurants", label: "Restaurants & Food" },
  { to: "/small-business-website-design", label: "Small Business" },
];

export default function WebDesignHomeServices() {
  useSEO({
    title: "Website Design for Home Service Companies | Likwit Devs",
    description:
      "Web design for contractors, plumbers, electricians, and cleaning services. Built to rank locally and generate quote requests.",
    canonical: "https://www.likwitdevs.com/web-design-for-home-services",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Website Design for Home Service Companies</h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            More quote requests. Less chasing leads.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Homeowners Google contractors before they call. A fast, professional website with clear
            services, a contact form, and local SEO puts you at the top when someone searches for
            what you do in Portland.
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
