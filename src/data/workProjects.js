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
            "Beauty service website built to improve online credibility, service presentation, and customer contact flow.",
        // TODO: Need project history from Michael.
        challenge: "",
        solution:
            "Built a beauty service website focused on online credibility, service presentation, and customer contact flow.",
        // TODO: Need project history from Michael.
        status: "",
    },
    {
        slug: "freva-construction",
        category: "client",
        matchIds: ["freva-construction", "freva"],
        matchTitles: ["Freva Construction", "Freva"],
        name: "Freva Construction",
        industry: "Client work",
        summary: missingProjectHistory,
        // TODO: Need project history from Michael.
        challenge: "",
        // TODO: Need project history from Michael.
        solution: "",
        // TODO: Need project history from Michael.
        status: "",
    },
    {
        slug: "nails-by-elysia",
        category: "client",
        matchIds: ["nails-by-elysia", "elysia", "elegance-by-elysia"],
        matchTitles: ["Nails by Elysia", "Elegance By Elysia", "Elysia"],
        name: "Nails by Elysia",
        industry: "Client work",
        summary: missingProjectHistory,
        // TODO: Need project history from Michael.
        challenge: "",
        // TODO: Need project history from Michael.
        solution: "",
        // TODO: Need project history from Michael.
        status: "",
    },
    {
        slug: "iep-compass",
        category: "owned",
        matchIds: ["iep-compass"],
        matchTitles: ["IEP Compass"],
        showOnHome: true,
        homeOrder: 4,
        name: "IEP Compass",
        industry: "Owned product",
        summary: missingProjectHistory,
        // TODO: Need product history from Michael.
        challenge: "",
        // TODO: Need product history from Michael.
        solution: "",
        // TODO: Need product history from Michael.
        status: "",
    },
    {
        slug: "likwit-blvd",
        category: "owned",
        matchIds: ["likwit-blvd", "likwit-boulevard"],
        matchTitles: ["Likwit Blvd", "Likwit Boulevard"],
        name: "Likwit Blvd",
        industry: "Owned product",
        summary: missingProjectHistory,
        // TODO: Need product history from Michael.
        challenge: "",
        // TODO: Need product history from Michael.
        solution: "",
        // TODO: Need product history from Michael.
        status: "",
    },
];

export function getWorkProject(slug) {
    return workProjects.find((project) => project.slug === slug);
}
