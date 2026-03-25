import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const bullets = [
  "Mobile-first design that showcases your work beautifully",
  "Online booking integration (Vagaro, Booksy, Square Appointments, and more)",
  "Service menu with pricing — easy to update",
  "Gallery or portfolio section for before/afters",
  "Click-to-call and contact form for new clients",
  "Google Business Profile-ready SEO setup",
  "2 rounds of revisions before launch",
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Booking Ready",
    desc: "Connect your existing booking platform or we'll help you set one up — clients book directly from your site.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Portfolio Gallery",
    desc: "Show off your best work with a clean, fast-loading gallery that makes clients want to book before they even call.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Google-Friendly",
    desc: "Proper titles, meta descriptions, and local SEO signals so new clients in Portland find you first.",
  },
];

const faqs = [
  {
    q: "Can you integrate online booking?",
    a: "Absolutely. We can connect your site to tools like Vagaro, Booksy, Square Appointments, or any booking platform you already use.",
  },
  {
    q: "I only have Instagram right now — is that enough?",
    a: "Instagram is a great start, but a website you own is more credible and shows up on Google. We can pull your Instagram aesthetic into your site design so it feels consistent.",
  },
  {
    q: "How do I update my services or prices on the site?",
    a: "With our Care Plan, just message us and we handle it. Or we can set up a simple system so you can edit it yourself — whatever works better for you.",
  },
  {
    q: "How soon can my site be live?",
    a: "Most salon sites are live in 2–3 weeks. The process is simple — share your services, some photos, and we handle the rest.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-restaurants", label: "Restaurants & Food" },
  { to: "/website-design-for-tattoo-artists", label: "Tattoo Artist Portfolios" },
  { to: "/small-business-website-design", label: "Small Business" },
  { to: "/", label: "← Homepage" },
];

export default function WebDesignSalons() {
  useSEO({
    title: "Your Salon Deserves a Full Book Every Week",
    description:
      "If your website makes booking feel like work, clients go somewhere easier. We build salon sites that turn first-time visitors into loyal, recurring appointments.",
    canonical: "https://www.likwitdevs.com/web-design-for-salons",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Website Design for Salons & Beauty Businesses</h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            Turn Instagram followers into booked appointments.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            We've built websites for nail salons, lash techs, and beauty studios. We know what your
            clients are looking for — a clean portfolio, easy booking, and a site that works on their
            phone. We handle the tech so you can focus on your clients.
          </p>
          <p className="mt-3 text-white/50 text-sm max-w-2xl">
            Part of our{" "}
            <Link to="/web-design-portland" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for Portland salons and service businesses
            </Link>
            . Also see:{" "}
            <Link to="/web-design-for-restaurants" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              restaurant website design
            </Link>
            {" "}and{" "}
            <Link to="/website-design-for-tattoo-artists" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              tattoo artist portfolios
            </Link>
            .
          </p>
          <p className="mt-4 text-white/50 text-sm">
            Trusted by: <span className="text-white/70">Elegance By Elysia</span> &amp;{" "}
            <span className="text-white/70">Blessed N Polished</span>
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
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-white/75 mb-6">Get a free review of your current site — or let's talk about building something new.</p>
            <Link to="/free-review" className="btn">Get a Free Website Review</Link>
        </Reveal>

      </div>
    </section>
  );
}
