export const missingProjectHistory = "Project history needed from Michael before this section is written.";

export const projectCategories = {
    client: "Client Work",
    owned: "Owned Products",
};

export const workProjects = [
    {
        slug: "forest-pathways",
        category: "client",
        matchIds: ["forest-pathways"],
        matchTitles: ["Forest Pathways"],
        showOnHome: true,
        homeOrder: 1,
        name: "Forest Pathways",
        industry: "Oregon wellness and facilitation",
        summary:
            "Professional online presence for an Oregon psilocybin facilitator, including local SEO structure, trust-focused content, and a clear contact path.",
        // TODO: Need project history from Michael.
        challenge: "",
        solution:
            "Built a professional online presence with local SEO structure, trust-focused content, and a clear contact path.",
        // TODO: Need project history from Michael.
        status: "",
    },
    {
        slug: "nw-autofix",
        category: "client",
        matchIds: ["nw-autofix", "nw-auto-fix"],
        matchTitles: ["NW AutoFix", "NW Auto Fix"],
        showOnHome: true,
        homeOrder: 2,
        name: "NW AutoFix",
        industry: "Auto repair",
        liveUrl: "https://www.nwautofix.com/",
        summary:
            "Modern auto repair website rebuild focused on customer trust, mobile usability, service visibility, and local search structure.",
        challenge:
            "Existing website had SSL/security issues. Website accessibility was unreliable. Customers could encounter loading/security problems. Service information needed better organization.",
        solution:
            "Diagnosed and resolved SSL/loading issues. Restored secure site accessibility. Rebuilt the website experience. Added organized service pages. Improved mobile usability. Added local SEO structure.",
        status:
            "Website is live, secure, mobile-friendly, and available at https://www.nwautofix.com/.",
    },
    {
        slug: "diamond-auto",
        category: "client",
        matchIds: ["diamond-auto"],
        matchTitles: ["Diamond Auto", "Diamond Auto Intake System"],
        showOnHome: true,
        homeOrder: 3,
        name: "Diamond Auto Intake System",
        industry: "Automotive operations",
        summary:
            "Custom intake and admin system built to streamline vehicle service requests, VIN info, referral tracking, customer details, and internal workflow.",
        challenge:
            "Customer intake information was being collected manually. Customer details, vehicle information, service concerns, referral details, and photos needed a more organized workflow. The shop needed a way to view, manage, print, and update intake records from an admin area.",
        solution:
            "Built a custom multi-step customer intake workflow with customer information capture, vehicle information capture, VIN entry and VIN decoding support, service concern/details capture, referral tracking, photo uploads, and customer communication preferences. Built an admin dashboard for viewing and managing intakes, intake status tracking, internal notes, print-friendly intake views, and copy-to-clipboard functionality for customer-submitted details.",
        status:
            "Intake system is live on Vercel and is intended to run from the Vercel deployment URL unless the client chooses to connect a custom domain later. Admin dashboard, customer intake flow, photo upload support, and VIN decoding support are built.",
    },
    {
        slug: "blessed-n-polished",
        category: "client",
        matchIds: ["blessed-n-polished", "blessed-polished"],
        matchTitles: ["Blessed N Polished", "Blessed & Polished", "Blessed Polished"],
        name: "Blessed N Polished",
        industry: "Beauty services",
        summary:
            "Beauty service website and booking-focused presence built to improve online credibility, service presentation, and customer contact flow.",
        challenge:
            "Blessed N Polished needed a more polished online presence for presenting services, building trust with new clients, and moving visitors toward booking or contacting the business.",
        solution:
            "Built a beauty service website focused on clear service presentation, mobile-friendly browsing, credibility signals, and a cleaner path for customers to take the next step.",
        status:
            "Completed client website build. No public live URL is listed in the current project data, so the confirmed domain should be attached when available.",
    },
    {
        slug: "freva-construction",
        category: "client",
        matchIds: ["freva-construction", "freva"],
        matchTitles: ["Freva Construction", "Freva"],
        name: "Freva Construction",
        industry: "Construction",
        summary:
            "Construction business website built to establish credibility, explain services clearly, and give prospects a direct path to request work.",
        challenge:
            "Freva Construction needed a professional web presence that could make the business easier to evaluate, communicate construction services clearly, and support new project inquiries.",
        solution:
            "Created a straightforward construction website structure with service-focused messaging, trust-building presentation, mobile-friendly layout, and a clear contact path for prospective customers.",
        status:
            "Completed client website build. No public live URL is listed in the current project data, so the confirmed domain should be attached when available.",
    },
    {
        slug: "nails-by-elysia",
        category: "client",
        matchIds: ["nails-by-elysia", "elysia", "elegance-by-elysia"],
        matchTitles: ["Nails by Elysia", "Elegance By Elysia", "Elysia"],
        name: "Nails by Elysia",
        industry: "Beauty services",
        summary:
            "Custom booking-focused website for a nail artist, built to move clients from social discovery to service selection and appointment requests.",
        challenge:
            "Nails by Elysia needed a cleaner way for clients to understand services and request appointments without every inquiry starting in scattered DMs.",
        solution:
            "Built a mobile-friendly beauty website with service presentation, booking-oriented customer flow, and a more structured path from interest to appointment request.",
        status:
            "Completed custom booking-focused client build. No public live URL is listed in the current project data, so the confirmed domain should be attached when available.",
    },
    {
        slug: "iep-compass",
        category: "owned",
        matchIds: ["iep-compass"],
        matchTitles: ["IEP Compass"],
        showOnHome: true,
        homeOrder: 4,
        name: "IEP Compass",
        industry: "Education technology",
        summary:
            "Owned AI-assisted education product that helps position Likwit Devs as a custom software and product builder, not only a website studio.",
        challenge:
            "Families and educators working with IEPs need clearer ways to understand complex education documents, organize next steps, and get support without digging through dense paperwork alone.",
        solution:
            "Built an AI-assisted product concept around IEP guidance, document understanding, and education workflow support, demonstrating custom application and AI tool capability.",
        status:
            "Owned product in active product and portfolio development. No public app URL is listed in the current project data.",
    },
    {
        slug: "likwit-blvd",
        category: "owned",
        matchIds: ["likwit-blvd", "likwit-boulevard"],
        matchTitles: ["Likwit Blvd", "Likwit Boulevard"],
        name: "Likwit Blvd",
        industry: "E-commerce and creative portfolio",
        summary:
            "Owned e-commerce and portfolio-style build that demonstrates product presentation, catalog structure, and branded digital experience work.",
        challenge:
            "Likwit Blvd needed a branded online experience that could present products or creative work with more structure than a basic gallery or social profile.",
        solution:
            "Built a portfolio and commerce-oriented web experience with visual product presentation, branded page structure, and a flexible foundation for future catalog or storefront expansion.",
        status:
            "Owned product build in portfolio development. No public launch URL is listed in the current project data.",
    },
];

export function getWorkProject(slug) {
    return workProjects.find((project) => project.slug === slug);
}
