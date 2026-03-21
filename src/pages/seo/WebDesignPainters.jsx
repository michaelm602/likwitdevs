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
    title: "Relying Entirely on Word-of-Mouth",
    desc: "Referrals dry up between seasons. When a homeowner searches 'exterior painter Portland' and you don't appear, that job goes to someone with a site — not necessarily better work.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Your Portfolio Lives in Your Phone",
    desc: "You have photos of great work — but they're buried in your camera roll or a Facebook album. Homeowners can't find them, can't browse them, and can't decide to hire you based on them.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    ),
    title: "Competing on Price Instead of Quality",
    desc: "Without a portfolio site that shows your finish quality, homeowners treat painters as interchangeable. The lowest bid wins — and that's a race no good painter can afford to run.",
  },
];

const solutions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "A Portfolio That Sells for You",
    desc: "Before/after galleries organized by project type — exterior repaints, interior color work, cabinet refinishing, commercial. Homeowners see exactly what you're capable of before they ever call.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Local SEO for Painting Services",
    desc: "Pages targeting Portland plus every neighborhood you actually work in. When someone searches 'exterior painter Beaverton' or 'cabinet painter Lake Oswego', you show up — not a national directory listing.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: "Reviews That Close the Deal",
    desc: "Google reviews embedded where homeowners see them immediately — before they scroll, before they wonder if you're legit. Five stars next to a real photo of finished work converts better than any sales pitch.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Quote Requests Without the Phone Tag",
    desc: "A quote form above the fold that captures name, project type, and contact info — so homeowners can reach out at 10pm on a Sunday without waiting for you to pick up while you're on a job.",
  },
];

const bullets = [
  "Mobile-first design — looks sharp on every phone",
  "Before/after portfolio gallery organized by project type",
  "Quote request form above the fold — no scrolling to find it",
  "Click-to-call button visible on every page",
  "Service area pages targeting Portland and surrounding cities",
  "Google reviews embed to build trust before they call",
  "LocalBusiness schema, title tags, and meta descriptions for local SEO",
  "Services breakdown — interior, exterior, cabinet, commercial",
  "2 rounds of revisions before launch",
];

const serviceAreas = [
  "Portland", "Beaverton", "Lake Oswego", "Gresham",
  "Hillsboro", "Tigard", "Tualatin", "Milwaukie",
  "West Linn", "Sherwood", "Clackamas", "Oregon City",
];

const painterTypes = [
  {
    label: "Exterior Repainters",
    desc: "Before/after galleries, service area coverage, and a quote form that captures homeowners mid-planning for their spring or summer project.",
  },
  {
    label: "Interior Painters",
    desc: "Color consultation, room-by-room examples, and a layout that shows finish quality — not just roller coverage.",
  },
  {
    label: "Cabinet Refinishers",
    desc: "High-detail close-up galleries that show the transformation, paired with clear service descriptions that justify your pricing.",
  },
  {
    label: "Commercial Painters",
    desc: "Portfolio-forward sites targeting property managers and business owners, with commercial references and project scale examples.",
  },
  {
    label: "Pressure Washing & Prep Services",
    desc: "Service pages that explain the prep process and why it matters — positioned alongside your painting work to justify a premium.",
  },
  {
    label: "Solo Operators & Small Crews",
    desc: "Professional sites that make a one- or two-person operation look as credible as a larger company — because your work is just as good.",
  },
];

const faqs = [
  {
    q: "Why do painters specifically need a portfolio website?",
    a: "Painting is a visual trade. Homeowners are making a decision about how their home looks — they need to see your finish quality, your color choices, and the scale of work you do before they trust you with their biggest asset. A Facebook album or a few Google photos isn't enough. A proper portfolio site lets you organize your best work, show before/afters, and give serious homeowners a reason to call you instead of the cheapest option they found.",
  },
  {
    q: "How does local SEO work for painters?",
    a: "Most painting searches are hyper-local: 'exterior painter Beaverton', 'interior painter Lake Oswego', 'cabinet painting Portland'. We build dedicated service area pages for each city you work in — not just a mention in the footer, but real pages with unique content. Combined with LocalBusiness schema markup and a well-maintained Google Business Profile, this is how you start showing up in the local map pack for the searches that actually lead to booked jobs.",
  },
  {
    q: "I get most of my work from referrals. Do I still need a website?",
    a: "Yes — and here's why: referrals still Google you before they call. If they land on an empty Facebook page or a site that looks like it was built in 2009, some of them move on. A professional site validates the referral and closes the gap between 'my neighbor recommended you' and 'I'm ready to book'. It also opens up a second lead channel so you're not entirely dependent on word-of-mouth when things slow down.",
  },
  {
    q: "Can you help me show off before/after photos effectively?",
    a: "That's the core of what we build for painters. We structure your gallery by project type so homeowners browsing exterior repaints don't have to scroll past cabinet work. We display before/afters side-by-side. We make the photos load fast on mobile, because most homeowners are browsing on their phone while doing something else. The goal is a portfolio that actually gets looked at — not just uploaded somewhere.",
  },
  {
    q: "How long does it take?",
    a: "Most painter sites are live in 2–3 weeks. The process is straightforward — you share your project photos, your service list, and your service area, and we handle everything else. You review and approve before we go live.",
  },
  {
    q: "How much does it cost?",
    a: "A standard painter site — portfolio gallery, service pages, quote form, local SEO setup — starts at $600. We'll give you a straight number after your free review, before any commitment.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-contractors", label: "Contractors" },
  { to: "/web-design-for-home-services", label: "Home Services" },
  { to: "/small-business-website-design", label: "Small Business" },
  { to: "/", label: "← Homepage" },
];

export default function WebDesignPainters() {
  useSEO({
    title: "Painter Website Design Portland | Likwit Devs",
    description:
      "Website design for Portland painters. Portfolio galleries, local SEO, and quote forms built to get you more calls and win better jobs.",
    canonical: "https://www.likwitdevs.com/web-design-for-painters",
  });

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Hero */}
        <Reveal once>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Painter Website Design in Portland — Show Your Work, Win More Jobs
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl text-lg">
            Stop competing on price. Start winning on quality.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            Portland homeowners search for painters online before they ask a neighbor.
            If they can't find you — or if they land on a site with no photos and a
            phone number buried in the footer — they move on. We build painter websites
            that show your best work, rank locally, and turn browsers into quote requests.
          </p>
          <p className="mt-3 text-white/50 text-sm max-w-2xl">
            Part of our{" "}
            <Link to="/web-design-portland" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for Portland contractors and service businesses
            </Link>
            . Also see our page for{" "}
            <Link to="/web-design-for-contractors" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              general contractors
            </Link>
            .
          </p>
          <Link to="/free-review" className="btn mt-6 inline-block">Get a Free Website Review</Link>
        </Reveal>

        {/* Problems */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What's Costing You Jobs</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            Most painting businesses lose work to the same three website problems.
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

        {/* Portfolio callout */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
          <h2 className="text-xl font-semibold mb-3">Your Portfolio Is Your Best Sales Tool</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
            Painting is one of the few trades where the work speaks for itself — if homeowners
            can actually see it. A well-organized before/after gallery does more to justify your
            quote than any amount of copy. It answers the question every homeowner has before
            they call: <em className="text-white/85 not-italic font-medium">"Can they do what I'm picturing?"</em>
          </p>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl mt-3">
            We build galleries that load fast on mobile, organized by project type so the right
            homeowner sees the right work — exterior repaints, interior rooms, cabinets, commercial.
            No compression artifacts, no slow-loading sliders. Just your work, shown properly.
          </p>
        </Reveal>

        {/* Solutions */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What We Build</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            Every painter site is built around one goal: getting homeowners to request a quote.
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

        {/* Service Area SEO */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
          <h2 className="text-xl font-semibold mb-3">Local SEO for Painters Across the Portland Metro</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-2xl">
            Homeowners don't search "Portland painter" — they search "exterior painter Beaverton"
            or "interior house painting Lake Oswego". We build service area pages targeting each
            city and neighborhood you actually work in, so you rank for the specific searches
            that lead to real quote requests. Every page is built with LocalBusiness schema,
            proper title tags, and content that signals to Google exactly where you serve.
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
            We build for painters of all kinds — solo operators, small crews, and specialty services.
            We also build for{" "}
            <Link to="/web-design-for-contractors" className="text-white/80 underline underline-offset-2 hover:text-white transition">
              general contractors in Portland
            </Link>
            {" "}who take on a broader range of projects.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {painterTypes.map(({ label, desc }) => (
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
              <p className="text-white font-semibold">Already have a site that isn't converting?</p>
              <p className="text-white/60 text-sm mt-1">
                Get a free review — we'll show you exactly what's costing you quote requests.
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
          <h2 className="text-2xl font-bold mb-2">Ready to stop competing on price?</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            Get a free review of your current online presence — or let's build a portfolio site
            that shows the quality of your work and fills your schedule with the right jobs.
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
