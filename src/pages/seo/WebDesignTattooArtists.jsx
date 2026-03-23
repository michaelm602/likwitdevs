import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";

const problems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "Instagram Can't Replace a Portfolio",
    desc: "A grid of squares compressed for a feed isn't how your linework deserves to be seen. Serious clients want to browse by style, see healed photos, and understand your process — none of which Instagram is built for.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "You Don't Show Up on Google",
    desc: "When someone searches 'fine line tattoo artist Portland' or 'blackwork tattoo near me', Instagram profiles rarely rank. If you don't have a website, you're invisible to anyone who isn't already following you.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "DMs Are a Terrible Booking System",
    desc: "Inquiries buried in Instagram DMs, requests that go unanswered while you're tattooing, clients who ghost after three back-and-forths. A proper inquiry form filters serious clients and captures their info the first time.",
  },
];

const solutions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: "A Gallery Built for Your Work",
    desc: "Full-width photos, organized by style. Blackwork separate from fine line, traditional from neo-trad. Clients find what matches their vision without wading through everything you've ever posted.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Bookings While You're Tattooing",
    desc: "A structured inquiry form that asks the right questions upfront — placement, size, style, reference images. You review real submissions instead of chasing vague DMs. Integrates with Vagaro, Booksy, Square, or a custom form.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Found on Google by the Right Clients",
    desc: "Local SEO built around your style and location — so clients searching 'fine line tattoo Portland' or 'traditional tattoo artist near me' find your site, not just your Instagram profile buried three pages deep.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: "A Site That Matches Your Aesthetic",
    desc: "Not a generic template. A design that reflects your style — dark, minimal, editorial, or bold — so clients feel your work before they even see the gallery. First impressions determine whether they read further or bounce.",
  },
];

const bullets = [
  "Portfolio-first design — your work is the first thing clients see",
  "Style-filtered galleries — blackwork, fine line, traditional, neo-trad, etc.",
  "Booking inquiry form with custom fields (placement, size, style, references)",
  "Booking platform integration — Vagaro, Booksy, Square, or custom",
  "Flash available / waitlist section to capture interest between bookings",
  "Guest spot or travel schedule section for touring artists",
  "About section — your story, your process, your policies",
  "Mobile-first layout — clients browse on their phones",
  "Local SEO — title tags, meta descriptions, and style-specific keyword targeting",
  "2 rounds of revisions before launch",
];

const artistTypes = [
  {
    label: "Independent Artists & Studio Renters",
    desc: "Artists working solo or renting a chair who want a professional presence that's fully their own — not tied to the shop's site.",
  },
  {
    label: "Established Artists Seeking Better Clients",
    desc: "Artists with strong work who are tired of vague 'how much for a sleeve' DMs and want a site that pre-qualifies clients by style and commitment before they reach out.",
  },
  {
    label: "Apprentices Building a Portfolio",
    desc: "Early-career artists who want to document their growth, show healed work, and look credible from the start — not just a burner Instagram account.",
  },
  {
    label: "Instagram-Only Artists",
    desc: "Artists whose entire presence lives on one platform they don't own — and who want something that shows up in Google and can't be deleted by an algorithm.",
  },
  {
    label: "Guest Spot & Traveling Artists",
    desc: "Artists who tour regularly and need a central hub where followers in every city can see upcoming dates, book in advance, and track their schedule.",
  },
  {
    label: "Flash-Focused Artists",
    desc: "Artists who drop flash regularly and need a dedicated section to showcase available designs, capture interest, and manage waitlists without living in their DMs.",
  },
];

const instagramComparison = [
  {
    label: "Discoverability",
    instagram: "Only reaches existing followers + hashtag traffic. No Google presence.",
    website: "Ranks on Google for style + location searches. Discoverable by people who've never heard of you.",
  },
  {
    label: "Portfolio control",
    instagram: "Chronological grid. Old work mixed with new. No organization by style.",
    website: "Galleries organized by style, placement, or project. Clients find exactly what they're looking for.",
  },
  {
    label: "Booking",
    instagram: "DMs. Chaotic, easy to miss, no structure to the conversation.",
    website: "Inquiry form that asks the right questions upfront — style, placement, size, timeline, references.",
  },
  {
    label: "Ownership",
    instagram: "Account can be flagged, restricted, or deleted. You own nothing.",
    website: "You own it. No platform risk. No algorithm changes that tank your reach overnight.",
  },
  {
    label: "Credibility",
    instagram: "Looks like every other artist. Hard to convey professionalism or process.",
    website: "Your own domain, your own design, your policies and process explained — signals a serious professional.",
  },
];

const faqs = [
  {
    q: "I have 10,000 Instagram followers. Do I actually need a website?",
    a: "Yes — and your following makes a website more valuable, not less. A large following means more people are already interested. A website gives those people somewhere to go that's organized, professional, and searchable. It also protects you: if Instagram restricts your account, flags a post, or changes its algorithm, your website is still there. You own it. Your 10,000 followers don't transfer if your account gets deleted.",
  },
  {
    q: "How does local SEO work for tattoo artists?",
    a: "People search specifically — 'fine line tattoo artist Portland', 'traditional tattoo Portland OR', 'blackwork tattoo near me'. We optimize your site around your actual style and location so you show up for those searches. Instagram profiles almost never rank for these queries. A properly built portfolio site with your style, location, and schema markup does. Over time, that means a steady stream of new clients who found you through Google, not just word of mouth.",
  },
  {
    q: "Can my website replace my Instagram booking DMs?",
    a: "Not replace — but dramatically improve. We add a booking inquiry form that asks exactly what you need to know: style, placement, size, skin tone, reference images, timeline. You get structured submissions you can actually evaluate instead of scattered DMs that are easy to lose. For artists using Vagaro, Booksy, or Square, we integrate your existing booking tool directly so clients can check your calendar and book without a back-and-forth.",
  },
  {
    q: "Can I organize my portfolio by style?",
    a: "Yes — style-specific galleries are one of the most important things we build for tattoo artists. Clients looking for fine line work don't want to scroll through your blackwork, and vice versa. Organized galleries let clients self-select and reach out already knowing you're the right fit. It also reduces low-effort inquiries from people who didn't look at your work carefully.",
  },
  {
    q: "What about flash drops and waitlists?",
    a: "We can build a flash available section where you swap in current designs — or a waitlist form where interested clients drop their email to be notified when you open bookings. Both give you a way to manage interest between booking windows without living in your DMs.",
  },
  {
    q: "I travel and do guest spots. Can the site reflect that?",
    a: "Yes. We build guest spot and travel schedule sections so clients in other cities know when you'll be nearby and can book in advance. Some artists get fully booked for guest spots before they even arrive — a central site makes that possible.",
  },
  {
    q: "How much does it cost?",
    a: "A portfolio site for a tattoo artist — gallery, booking form, about section, local SEO setup — starts at $600. We'll give you an exact number after your free review, with no commitment required.",
  },
];

const relatedLinks = [
  { to: "/web-design-portland", label: "Web Design Portland" },
  { to: "/web-design-for-tattoo-shops", label: "Tattoo Shops & Studios" },
  { to: "/web-design-for-salons", label: "Salons & Beauty" },
  { to: "/small-business-website-design", label: "Small Business" },
  { to: "/", label: "← Homepage" },
];

export default function WebDesignTattooArtists() {
  useSEO({
    title: "Tattoo Artist Website Design (Get Found Beyond Instagram)",
    description:
      "Instagram isn't a portfolio. Get a site that ranks on Google, showcases your work, and makes booking easy. Free review.",
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
            Your art deserves more than a grid of Instagram screenshots.
          </p>
          <p className="mt-3 text-white/60 max-w-2xl">
            We build portfolio sites for independent tattoo artists that present your work
            the way it deserves, show up when clients search for your style on Google,
            and turn genuine interest into structured booking inquiries — not DM chaos.
            A site you own, that works around the clock, whether you're mid-session or on a guest spot.
          </p>
          <p className="mt-3 text-white/50 text-sm max-w-2xl">
            Part of our{" "}
            <Link to="/web-design-portland" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              web design for Portland creatives and service businesses
            </Link>
            . Looking for a shop site?{" "}
            <Link to="/web-design-for-tattoo-shops" className="text-white/65 underline underline-offset-2 hover:text-white transition">
              See our tattoo shop page
            </Link>
            .
          </p>
          <Link to="/free-review" className="btn mt-6 inline-block">Get a Free Website Review</Link>
        </Reveal>

        {/* Problems */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Why Instagram Alone Isn't Enough</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            Instagram is a discovery tool. It was never built to be a portfolio, a booking system, or a business.
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

        {/* Instagram vs Website comparison */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
          <h2 className="text-xl font-semibold mb-2">Instagram vs. Your Own Website</h2>
          <p className="text-white/65 text-sm mb-6 max-w-2xl">
            Instagram and a portfolio site do different jobs. You need both — but only one of them you own.
          </p>
          <div className="space-y-0 divide-y divide-white/10">
            <div className="grid grid-cols-3 gap-4 pb-3 text-xs uppercase tracking-wider text-white/40">
              <span></span>
              <span>Instagram</span>
              <span>Your Website</span>
            </div>
            {instagramComparison.map(({ label, instagram, website }) => (
              <div key={label} className="grid grid-cols-3 gap-4 py-4 text-sm">
                <span className="text-white/80 font-medium">{label}</span>
                <span className="text-white/50 leading-snug">{instagram}</span>
                <span className="text-white/80 leading-snug">{website}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Solutions */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What We Build</h2>
          <p className="text-white/65 mb-6 max-w-2xl">
            Every artist site is built around your specific style, workflow, and the clients you want to attract.
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

        {/* Local SEO callout */}
        <Reveal y={24} once className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
          <h2 className="text-xl font-semibold mb-3">Get Found When Clients Search for Your Style</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
            Most tattoo searches are style-specific and location-specific: <span className="text-white/85">'fine line tattoo Portland'</span>,{" "}
            <span className="text-white/85">'traditional tattoo artist near me'</span>,{" "}
            <span className="text-white/85">'blackwork tattoo Portland OR'</span>. Instagram profiles
            don't rank for these searches. A properly built portfolio site with your styles,
            your location, and the right schema markup does.
          </p>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl mt-3">
            We optimize your site for the specific style keywords that match your work —
            so the clients finding you through Google are already looking for exactly what you do.
            That means fewer 'what's your cheapest tattoo' messages and more people who
            researched you before they reached out.
          </p>
        </Reveal>

        {/* Who This Is For */}
        <Reveal y={24} once>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Who This Is For</h2>
          <p className="text-white/65 mb-2 max-w-2xl">
            This page is specifically for individual tattoo artists — not shops or studios. If you run
            a multi-artist operation,{" "}
            <Link to="/web-design-for-tattoo-shops" className="text-white/80 underline underline-offset-2 hover:text-white transition">
              see our tattoo shop page instead
            </Link>
            .
          </p>
          <p className="text-white/50 text-sm mb-6 max-w-2xl">
            We've built sites for artists at every stage — apprentices building their first real portfolio
            to established artists who want to attract a completely different tier of client.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {artistTypes.map(({ label, desc }) => (
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
              <p className="text-white font-semibold">Not sure what your site is missing?</p>
              <p className="text-white/60 text-sm mt-1">
                Get a free review — we'll tell you exactly what's keeping clients from reaching out.
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
          <h2 className="text-2xl font-bold mb-2">Ready to build a portfolio that books better clients?</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            Get a free review of your current online presence — or let's build a site that
            represents your work the way it deserves and brings in the clients you actually want.
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
