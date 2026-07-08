import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import useAuthGate from "../hooks/useAuthGate";
import { auth, db } from "../lib/firebase";

const eventLimit = 1000;
const leadLimit = 1000;
const funnelEvents = ["page_view", "contact_form_started", "contact_form_submitted"];
const serviceInterestEvents = ["service_card_click", "service_problem_click", "cta_click"];
const portfolioEvents = ["project_case_study_click", "project_live_site_click"];
const displayedEventNames = new Set([
    "page_view",
    "cta_click",
    "contact_form_started",
    "contact_form_submitted",
    "lead_created",
    "emailjs_sent",
    "emailjs_failed",
    "lead_create_failed",
    "service_card_click",
    "service_problem_click",
    "project_case_study_click",
    "project_live_site_click",
    "admin_lead_status_changed",
    "admin_lead_note_updated",
]);
const serviceCategories = ["Business Websites", "Workflow Automation", "SEO", "Portfolio", "Other"];
const openPipelineStatuses = new Set(["New", "Contacted", "Discovery", "Proposal Sent"]);

function toDate(value) {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
}

function formatTimestamp(value) {
    const date = toDate(value);
    if (!date) return "Unknown";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function getField(event, key) {
    return event[key] || event.metadata?.[key] || "";
}

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function getLeadValue(lead) {
    return toNumber(lead.proposalValue) || toNumber(lead.estimatedValue);
}

function getLeadSource(lead) {
    return lead.originPage || lead.sourcePage || lead.source || "Unknown";
}

function getLandingPage(lead) {
    return lead.landingPage || lead.sourcePage || "Unknown";
}

function getDisplayPageLabel(value) {
    if (!value) return "Unknown";
    const rawValue = String(value);
    if (rawValue.includes("#pricing") || rawValue === "/pricing") return "Pricing Page";
    const path = rawValue.split("?")[0].split("#")[0] || "/";

    if (path === "/") return "Home Page";
    if (path.startsWith("/services")) return "Services Page";
    if (path.startsWith("/work")) return "Work Page";
    if (path.startsWith("/contact")) return "Contact Page";
    if (path === "/pricing") return "Pricing Page";
    return path;
}

function classifyServiceInterest(event) {
    const targetPath = getField(event, "targetPath");
    const serviceIntent = getField(event, "serviceIntent") || event.metadata?.serviceId || event.metadata?.title || "";
    const haystack = `${targetPath} ${serviceIntent} ${event.metadata?.label || ""} ${event.metadata?.solution || ""}`.toLowerCase();

    if (haystack.includes("business") || haystack.includes("website") || haystack.includes("websites")) {
        return "Business Websites";
    }
    if (haystack.includes("workflow") || haystack.includes("automation") || haystack.includes("intake")) {
        return "Workflow Automation";
    }
    if (haystack.includes("seo") || haystack.includes("local search")) {
        return "SEO";
    }
    if (haystack.includes("portfolio") || haystack.includes("/work") || haystack.includes("#projects")) {
        return "Portfolio";
    }

    return "Other";
}

function startOfToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

function startOfWeek() {
    const date = startOfToday();
    date.setDate(date.getDate() - date.getDay());
    return date;
}

function normalizePagePath(event) {
    const rawPath = getField(event, "pagePath") || getField(event, "sourcePage") || "";
    if (!rawPath) return "Unknown";

    let path = rawPath;
    try {
        path = new URL(rawPath, window.location.origin).pathname + new URL(rawPath, window.location.origin).hash;
    } catch {
        path = rawPath.split("?")[0];
    }

    if (path === "" || path === "/") return "/";
    if (path.includes("#pricing")) return "/pricing";
    if (path.startsWith("/services")) return "/services";
    if (path.startsWith("/work")) return "/work";
    if (path.startsWith("/contact")) return "/contact";
    return "Other pages";
}

function percent(numerator, denominator) {
    if (!denominator) return "0%";
    return `${Math.round((numerator / denominator) * 100)}%`;
}

function countBy(items, keyGetter) {
    return items.reduce((map, item) => {
        const key = keyGetter(item) || "Unknown";
        map.set(key, (map.get(key) || 0) + 1);
        return map;
    }, new Map());
}

function StatCard({ label, value, helper }) {
    return (
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/60">{label}</p>
            <div className="mt-2 text-3xl font-bold text-white">{value}</div>
            {helper && <p className="mt-2 text-sm text-white/65">{helper}</p>}
        </article>
    );
}

function AdminNav({ onSignOut }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                View site
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Projects
            </Link>
            <Link to="/admin/leads" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Leads
            </Link>
            <Link to="/admin/reviews" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Reviews
            </Link>
            <Link to="/admin/analytics" className="px-3 py-2 rounded-xl bg-white/20">
                Analytics
            </Link>
            <button onClick={onSignOut} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Sign out
            </button>
        </div>
    );
}

export default function AdminAnalytics() {
    const { loading: authLoading, ok } = useAuthGate();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadAnalytics() {
            try {
                const analyticsQuery = query(
                    collection(db, "analyticsEvents"),
                    orderBy("createdAt", "desc"),
                    limit(eventLimit)
                );
                const leadsQuery = query(
                    collection(db, "leads"),
                    orderBy("createdAt", "desc"),
                    limit(leadLimit)
                );
                const [snapshot, leadsSnapshot] = await Promise.all([
                    getDocs(analyticsQuery),
                    getDocs(leadsQuery),
                ]);
                if (!mounted) return;
                setEvents(snapshot.docs.map((eventDoc) => ({ id: eventDoc.id, ...eventDoc.data() })));
                setLeads(leadsSnapshot.docs.map((leadDoc) => ({ id: leadDoc.id, ...leadDoc.data() })));
                setError("");
            } catch (err) {
                console.error("Analytics load failed", err);
                if (mounted) setError("Could not load analytics events.");
            } finally {
                if (mounted) setLoadingEvents(false);
            }
        }

        if (ok) loadAnalytics();
        return () => {
            mounted = false;
        };
    }, [ok]);

    const dashboard = useMemo(() => {
        const today = startOfToday();
        const week = startOfWeek();
        const pageViews = events.filter((event) => event.eventName === "page_view");
        const uniqueSessions = new Set(events.map((event) => event.sessionId).filter(Boolean));
        const visitorsToday = new Set(
            events
                .filter((event) => {
                    const date = toDate(event.createdAt);
                    return date && date >= today;
                })
                .map((event) => event.sessionId)
                .filter(Boolean)
        );
        const visitorsThisWeek = new Set(
            events
                .filter((event) => {
                    const date = toDate(event.createdAt);
                    return date && date >= week;
                })
                .map((event) => event.sessionId)
                .filter(Boolean)
        );

        const topPageCounts = countBy(pageViews, normalizePagePath);
        const orderedPages = ["/", "/services", "/work", "/contact", "/pricing", "Other pages"].map((path) => ({
            path,
            views: topPageCounts.get(path) || 0,
        }));

        const serviceInterestEventsList = events.filter((event) => serviceInterestEvents.includes(event.eventName));
        const serviceCounts = countBy(serviceInterestEventsList, classifyServiceInterest);
        const totalServiceInterest = serviceInterestEventsList.length;
        const services = serviceCategories.map((service) => {
            const clicks = serviceCounts.get(service) || 0;
            return {
                service,
                clicks,
                percentage: percent(clicks, totalServiceInterest),
            };
        });

        const portfolioMap = new Map();
        events
            .filter((event) => portfolioEvents.includes(event.eventName))
            .forEach((event) => {
                const slug = getField(event, "projectSlug") || "unknown";
                const project = portfolioMap.get(slug) || {
                    slug,
                    name: getField(event, "projectName") || slug,
                    caseStudyClicks: 0,
                    liveSiteClicks: 0,
                };
                if (event.eventName === "project_case_study_click") project.caseStudyClicks += 1;
                if (event.eventName === "project_live_site_click") project.liveSiteClicks += 1;
                portfolioMap.set(slug, project);
            });
        const portfolio = [...portfolioMap.values()].sort(
            (a, b) => b.caseStudyClicks + b.liveSiteClicks - (a.caseStudyClicks + a.liveSiteClicks)
        ).map((project) => ({
            ...project,
            totalInterest: project.caseStudyClicks + project.liveSiteClicks,
        }));

        const funnelCounts = funnelEvents.reduce((next, eventName) => {
            next[eventName] = events.filter((event) => event.eventName === eventName).length;
            return next;
        }, {});
        const historicalLeadEvents = events.filter((event) => event.eventName === "lead_created").length;
        const leadCreateFailures = events.filter((event) => event.eventName === "lead_create_failed").length;
        const emailFailures = events.filter((event) => event.eventName === "emailjs_failed").length;

        const leadSourceCounts = countBy(leads, (lead) => getDisplayPageLabel(getLeadSource(lead)));
        const topLeadSources = [...leadSourceCounts.entries()]
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count);

        const landingPageCounts = countBy(leads, (lead) => getDisplayPageLabel(getLandingPage(lead)));
        const topLandingPages = [...landingPageCounts.entries()]
            .map(([landingPage, count]) => ({ landingPage, count }))
            .sort((a, b) => b.count - a.count);

        const attributionMap = new Map();
        leads.forEach((lead) => {
            const source = getDisplayPageLabel(getLeadSource(lead));
            const landingPage = getDisplayPageLabel(getLandingPage(lead));
            const key = `${source}__${landingPage}`;
            const current = attributionMap.get(key) || {
                source,
                landingPage,
                leads: 0,
                won: 0,
                pipelineValue: 0,
            };
            current.leads += 1;
            if (lead.status === "Won") current.won += 1;
            current.pipelineValue += getLeadValue(lead);
            attributionMap.set(key, current);
        });
        const attributionReport = [...attributionMap.values()].sort((a, b) => b.leads - a.leads);

        const revenue = leads.reduce(
            (totals, lead) => {
                const value = getLeadValue(lead);
                if (openPipelineStatuses.has(lead.status || "New")) totals.openPipelineValue += value;
                if (lead.status === "Won") totals.wonRevenue += value;
                if (lead.status === "Lost") totals.lostOpportunityValue += value;
                return totals;
            },
            { openPipelineValue: 0, wonRevenue: 0, lostOpportunityValue: 0 }
        );

        const eventNames = [...new Set(events.map((event) => event.eventName).filter(Boolean))].sort();
        const undisplayedEventNames = eventNames.filter((eventName) => !displayedEventNames.has(eventName));

        return {
            totalEvents: events.length,
            visitorsToday: visitorsToday.size,
            visitorsThisWeek: visitorsThisWeek.size,
            totalPageViews: pageViews.length,
            uniqueSessions: uniqueSessions.size,
            orderedPages,
            services,
            portfolio,
            funnelCounts,
            currentLeads: leads.length,
            historicalLeadEvents,
            leadCreateFailures,
            emailFailures,
            topLeadSources,
            topLandingPages,
            attributionReport,
            revenue,
            recentEvents: events.slice(0, 25),
            eventNames,
            undisplayedEventNames,
        };
    }, [events, leads]);

    async function handleSignOut() {
        await signOut(auth);
        navigate("/");
    }

    if (authLoading) {
        return <div className="min-h-screen grid place-items-center p-6 text-white">Checking access...</div>;
    }

    if (!ok) {
        return (
            <main className="min-h-screen grid place-items-center p-6 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-3 text-white">
                    <div>Not authorized</div>
                    <Link to="/admin/login" className="inline-flex px-4 py-2 rounded-xl bg-white text-black">
                        Go to Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 pt-28 pb-12 text-white">
            <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">Admin</p>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="mt-1 text-sm text-white/65">
                        Read-only view of the latest {eventLimit.toLocaleString()} first-party analytics events.
                    </p>
                </div>
                <AdminNav onSignOut={handleSignOut} />
            </div>

            {error && (
                <div className="max-w-6xl mx-auto mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200">
                    {error}
                </div>
            )}

            {loadingEvents ? (
                <div className="max-w-6xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                    Loading analytics...
                </div>
            ) : dashboard.totalEvents === 0 ? (
                <div className="max-w-6xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                    No analytics events found yet.
                </div>
            ) : (
                <div className="max-w-6xl mx-auto mt-6 space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold text-white">Traffic Overview</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard label="Visitors Today" value={dashboard.visitorsToday} />
                            <StatCard label="Visitors This Week" value={dashboard.visitorsThisWeek} />
                            <StatCard label="Total Page Views" value={dashboard.totalPageViews} />
                            <StatCard label="Unique Sessions" value={dashboard.uniqueSessions} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white">Revenue Pipeline</h2>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                            <StatCard label="Open Pipeline Value" value={formatMoney(dashboard.revenue.openPipelineValue)} />
                            <StatCard label="Won Revenue" value={formatMoney(dashboard.revenue.wonRevenue)} />
                            <StatCard label="Lost Opportunity Value" value={formatMoney(dashboard.revenue.lostOpportunityValue)} />
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <h2 className="text-lg font-semibold text-white">Top Pages</h2>
                            <div className="mt-4 space-y-2">
                                {dashboard.orderedPages.map((page) => (
                                    <div key={page.path} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                                        <span className="text-sm text-white/80">{page.path}</span>
                                        <span className="font-semibold text-white">{page.views}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <h2 className="text-lg font-semibold text-white">Service Interest</h2>
                            <div className="mt-4 space-y-2">
                                {dashboard.services.every((service) => service.clicks === 0) ? (
                                    <p className="text-sm text-white/65">No service card clicks found yet.</p>
                                ) : (
                                    dashboard.services.map((service) => (
                                        <div key={service.service} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                                            <span className="text-sm text-white/80">{service.service}</span>
                                            <span className="font-semibold text-white">
                                                {service.clicks} <span className="text-sm font-normal text-white/55">({service.percentage})</span>
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold text-white">Portfolio Interest</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <thead className="text-white/60">
                                    <tr>
                                        <th className="py-2 pr-4 font-medium">Project</th>
                                        <th className="py-2 pr-4 font-medium">Slug</th>
                                        <th className="py-2 pr-4 font-medium">Case Study Clicks</th>
                                        <th className="py-2 pr-4 font-medium">Live Site Clicks</th>
                                        <th className="py-2 font-medium">Total Interest</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard.portfolio.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-white/65">
                                                No project clicks found yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        dashboard.portfolio.map((project) => (
                                            <tr key={project.slug} className="border-t border-white/10">
                                                <td className="py-3 pr-4 text-white">{project.name}</td>
                                                <td className="py-3 pr-4 text-white/70">{project.slug}</td>
                                                <td className="py-3 pr-4 text-white">{project.caseStudyClicks}</td>
                                                <td className="py-3 pr-4 text-white">{project.liveSiteClicks}</td>
                                                <td className="py-3 text-white">{project.totalInterest}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold text-white">Lead Activity and Current CRM</h2>
                        <p className="mt-1 text-sm text-white/60">
                            Event cards use the latest {eventLimit.toLocaleString()} analytics events. Current Leads reads live Firestore lead documents.
                        </p>
                        <div className="mt-4 grid gap-3 md:grid-cols-4">
                            <StatCard
                                label="Page Views (Events)"
                                value={dashboard.funnelCounts.page_view || 0}
                            />
                            <StatCard
                                label="Form Started (Events)"
                                value={dashboard.funnelCounts.contact_form_started || 0}
                                helper={`${percent(dashboard.funnelCounts.contact_form_started || 0, dashboard.funnelCounts.page_view || 0)} of page views`}
                            />
                            <StatCard
                                label="Form Submitted (Events)"
                                value={dashboard.funnelCounts.contact_form_submitted || 0}
                                helper={`${percent(dashboard.funnelCounts.contact_form_submitted || 0, dashboard.funnelCounts.contact_form_started || 0)} of starts`}
                            />
                            <StatCard
                                label="Current Leads"
                                value={dashboard.currentLeads}
                                helper="Live documents currently stored in the CRM"
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold text-white">Pipeline Diagnostics</h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <StatCard
                                label="Historical Lead Events"
                                value={dashboard.historicalLeadEvents}
                                helper="Successful create events; may include leads later deleted from the CRM"
                            />
                            <StatCard
                                label="Lead Write Failures"
                                value={dashboard.leadCreateFailures}
                                helper="Validated submissions that did not reach Firestore"
                            />
                            <StatCard
                                label="Email Failures"
                                value={dashboard.emailFailures}
                                helper="Notification attempts rejected by EmailJS"
                            />
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <h2 className="text-lg font-semibold text-white">Top Lead Sources</h2>
                            <div className="mt-4 space-y-2">
                                {dashboard.topLeadSources.length === 0 ? (
                                    <p className="text-sm text-white/65">No lead source data found yet.</p>
                                ) : (
                                    dashboard.topLeadSources.map((source) => (
                                        <div key={source.source} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                                            <span className="text-sm text-white/80">{source.source}</span>
                                            <span className="font-semibold text-white">{source.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <h2 className="text-lg font-semibold text-white">Top Landing Pages</h2>
                            <div className="mt-4 space-y-2">
                                {dashboard.topLandingPages.length === 0 ? (
                                    <p className="text-sm text-white/65">No landing page data found yet.</p>
                                ) : (
                                    dashboard.topLandingPages.map((landingPage) => (
                                        <div key={landingPage.landingPage} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                                            <span className="text-sm text-white/80">{landingPage.landingPage}</span>
                                            <span className="font-semibold text-white">{landingPage.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold text-white">Lead Attribution Report</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="text-white/60">
                                    <tr>
                                        <th className="py-2 pr-4 font-medium">Lead Source</th>
                                        <th className="py-2 pr-4 font-medium">Landing Page</th>
                                        <th className="py-2 pr-4 font-medium">Leads</th>
                                        <th className="py-2 pr-4 font-medium">Won</th>
                                        <th className="py-2 font-medium">Pipeline Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard.attributionReport.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-white/65">
                                                No attribution data found yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        dashboard.attributionReport.map((row) => (
                                            <tr key={`${row.source}-${row.landingPage}`} className="border-t border-white/10">
                                                <td className="py-3 pr-4 text-white">{row.source}</td>
                                                <td className="py-3 pr-4 text-white/70">{row.landingPage}</td>
                                                <td className="py-3 pr-4 text-white">{row.leads}</td>
                                                <td className="py-3 pr-4 text-white">{row.won}</td>
                                                <td className="py-3 text-white">{formatMoney(row.pipelineValue)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="text-white/60">
                                    <tr>
                                        <th className="py-2 pr-4 font-medium">Timestamp</th>
                                        <th className="py-2 pr-4 font-medium">Event</th>
                                        <th className="py-2 pr-4 font-medium">Page</th>
                                        <th className="py-2 pr-4 font-medium">Project</th>
                                        <th className="py-2 font-medium">Service Intent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard.recentEvents.map((event) => (
                                        <tr key={event.id} className="border-t border-white/10">
                                            <td className="py-3 pr-4 text-white/70">{formatTimestamp(event.createdAt)}</td>
                                            <td className="py-3 pr-4 text-white">{event.eventName || "Unknown"}</td>
                                            <td className="py-3 pr-4 text-white/70">{getField(event, "pagePath") || "Unknown"}</td>
                                            <td className="py-3 pr-4 text-white/70">
                                                {getField(event, "projectName") || getField(event, "projectSlug") || "-"}
                                            </td>
                                            <td className="py-3 text-white/70">{getField(event, "serviceIntent") || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
