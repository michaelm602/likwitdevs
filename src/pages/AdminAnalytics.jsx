import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import useAuthGate from "../hooks/useAuthGate";
import { auth, db } from "../lib/firebase";
import {
    ANALYTICS_CUTOVER_ID,
    hasConfiguredAnalyticsCutover,
} from "../lib/analyticsRuntimeConfig";
import {
    getEventCanonicalPath,
    getLeadAcquisitionSource,
    getLeadConversionLocation,
    getLeadLandingPage,
    getLeadPipelineValue,
    isEligibleV2AttributedLead,
    isEligibleV2PublicEvent,
    isLegacyAnalyticsEvent,
} from "../lib/analyticsReporting";

const eventLimit = 1000;
const leadLimit = 1000;
const funnelEvents = ["page_view", "contact_form_started", "contact_form_submitted"];
const serviceInterestEvents = ["service_card_click", "service_problem_click", "cta_click"];
const portfolioEvents = ["project_case_study_click", "project_live_site_click"];
const serviceCategories = ["Business Websites", "Workflow Automation", "SEO", "Portfolio", "Other"];

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

function getLeadValue(lead) {
    return toNumber(lead.proposalValue) || toNumber(lead.estimatedValue);
}

function formatMoney(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function displayPath(value) {
    if (!value) return "Unknown";
    if (value === "/") return "Home Page";
    if (value === "/services") return "Services Page";
    if (value === "/work") return "Work Page";
    if (value === "/contact") return "Contact Page";
    if (value === "/pricing") return "Pricing Section";
    return value;
}

function classifyServiceInterest(event) {
    const targetPath = getField(event, "targetPath");
    const serviceIntent =
        getField(event, "serviceIntent") ||
        event.metadata?.serviceId ||
        event.metadata?.title ||
        "";
    const haystack = `${targetPath} ${serviceIntent} ${event.metadata?.label || ""} ${event.metadata?.solution || ""}`.toLowerCase();

    if (haystack.includes("business") || haystack.includes("website")) return "Business Websites";
    if (haystack.includes("workflow") || haystack.includes("automation") || haystack.includes("intake")) {
        return "Workflow Automation";
    }
    if (haystack.includes("seo") || haystack.includes("local search")) return "SEO";
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

function CountList({ items, emptyMessage, labelKey = "label" }) {
    if (items.length === 0) return <p className="text-sm text-white/65">{emptyMessage}</p>;
    return items.map((item) => (
        <div key={item[labelKey]} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
            <span className="text-sm text-white/80">{item[labelKey]}</span>
            <span className="font-semibold text-white">{item.count}</span>
        </div>
    ));
}

function AdminNav({ onSignOut }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">View site</Link>
            <Link to="/admin" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Projects</Link>
            <Link to="/admin/leads" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Leads</Link>
            <Link to="/admin/reviews" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Reviews</Link>
            <Link to="/admin/analytics" className="px-3 py-2 rounded-xl bg-white/20">Analytics</Link>
            <button onClick={onSignOut} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Sign out</button>
        </div>
    );
}

export default function AdminAnalytics() {
    const { loading: authLoading, ok } = useAuthGate();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadAnalytics() {
            try {
                const [eventSnapshot, leadSnapshot] = await Promise.all([
                    getDocs(query(
                        collection(db, "analyticsEvents"),
                        orderBy("createdAt", "desc"),
                        limit(eventLimit)
                    )),
                    getDocs(query(
                        collection(db, "leads"),
                        orderBy("createdAt", "desc"),
                        limit(leadLimit)
                    )),
                ]);
                if (!mounted) return;
                setEvents(eventSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
                setLeads(leadSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
                setError("");
            } catch (err) {
                console.error("Analytics load failed", err);
                if (mounted) setError("Could not load analytics or CRM records.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        if (ok) loadAnalytics();
        return () => {
            mounted = false;
        };
    }, [ok]);

    const dashboard = useMemo(() => {
        const cleanEvents = events.filter((event) =>
            isEligibleV2PublicEvent(event, ANALYTICS_CUTOVER_ID)
        );
        const cleanLeads = leads.filter((lead) =>
            isEligibleV2AttributedLead(lead, ANALYTICS_CUTOVER_ID)
        );
        const pageViews = cleanEvents.filter((event) => event.eventName === "page_view");
        const today = startOfToday();
        const week = startOfWeek();
        const sessionsSince = (start) => new Set(
            cleanEvents
                .filter((event) => {
                    const date = toDate(event.createdAt);
                    return date && date >= start;
                })
                .map((event) => event.sessionId)
                .filter(Boolean)
        );

        const pageCounts = countBy(pageViews, getEventCanonicalPath);
        const topPages = [...pageCounts.entries()]
            .map(([path, count]) => ({ label: displayPath(path), path, count }))
            .sort((a, b) => b.count - a.count);

        const serviceEvents = cleanEvents.filter((event) =>
            serviceInterestEvents.includes(event.eventName)
        );
        const serviceCounts = countBy(serviceEvents, classifyServiceInterest);
        const services = serviceCategories.map((label) => ({
            label,
            count: serviceCounts.get(label) || 0,
            percentage: percent(serviceCounts.get(label) || 0, serviceEvents.length),
        }));

        const portfolioMap = new Map();
        cleanEvents
            .filter((event) => portfolioEvents.includes(event.eventName))
            .forEach((event) => {
                const slug = getField(event, "projectSlug") || "unknown";
                const current = portfolioMap.get(slug) || {
                    slug,
                    name: getField(event, "projectName") || slug,
                    caseStudyClicks: 0,
                    liveSiteClicks: 0,
                };
                if (event.eventName === "project_case_study_click") current.caseStudyClicks += 1;
                if (event.eventName === "project_live_site_click") current.liveSiteClicks += 1;
                portfolioMap.set(slug, current);
            });
        const portfolio = [...portfolioMap.values()]
            .map((project) => ({
                ...project,
                totalInterest: project.caseStudyClicks + project.liveSiteClicks,
            }))
            .sort((a, b) => b.totalInterest - a.totalInterest);

        const funnelCounts = funnelEvents.reduce((next, eventName) => {
            next[eventName] = cleanEvents.filter((event) => event.eventName === eventName).length;
            return next;
        }, {});

        const sources = [...countBy(cleanLeads, getLeadAcquisitionSource).entries()]
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count);
        const landingPages = [...countBy(cleanLeads, (lead) => displayPath(getLeadLandingPage(lead))).entries()]
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count);
        const conversionLocations = [...countBy(cleanLeads, (lead) => displayPath(getLeadConversionLocation(lead))).entries()]
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count);
        const campaignSessions = new Map();
        pageViews.forEach((event) => {
            const campaign = event.firstTouch?.utmCampaign ||
                [event.firstTouch?.utmSource, event.firstTouch?.utmMedium]
                    .filter(Boolean)
                    .join(" / ");
            if (!campaign) return;
            const sessionKey = event.sessionId || event.id;
            if (!campaignSessions.has(sessionKey)) campaignSessions.set(sessionKey, campaign);
        });
        const campaigns = [...countBy(
            [...campaignSessions.values()],
            (campaign) => campaign
        ).entries()]
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count);

        const attributionMap = new Map();
        cleanLeads.forEach((lead) => {
            const source = getLeadAcquisitionSource(lead);
            const landingPage = displayPath(getLeadLandingPage(lead));
            const conversionLocation = displayPath(getLeadConversionLocation(lead));
            const key = `${source}__${landingPage}__${conversionLocation}`;
            const current = attributionMap.get(key) || {
                source,
                landingPage,
                conversionLocation,
                leads: 0,
                won: 0,
                pipelineValue: 0,
            };
            current.leads += 1;
            if (lead.status === "Won") current.won += 1;
            current.pipelineValue += getLeadPipelineValue(lead);
            attributionMap.set(key, current);
        });

        const revenue = leads.reduce(
            (totals, lead) => {
                totals.openPipelineValue += getLeadPipelineValue(lead);
                if (lead.status === "Won") totals.closedWonValue += getLeadValue(lead);
                if (lead.status === "Lost") totals.lostOpportunityValue += getLeadValue(lead);
                return totals;
            },
            { openPipelineValue: 0, closedWonValue: 0, lostOpportunityValue: 0 }
        );

        return {
            cleanEvents,
            visitorsToday: sessionsSince(today).size,
            visitorsThisWeek: sessionsSince(week).size,
            totalPageViews: pageViews.length,
            uniqueSessions: new Set(cleanEvents.map((event) => event.sessionId).filter(Boolean)).size,
            topPages,
            services,
            portfolio,
            funnelCounts,
            currentLeads: leads.length,
            sources,
            landingPages,
            conversionLocations,
            campaigns,
            attributionReport: [...attributionMap.values()].sort((a, b) => b.leads - a.leads),
            revenue,
            historicalLeadEvents: events.filter((event) => event.eventName === "lead_created").length,
            leadCreateFailures: events.filter((event) => event.eventName === "lead_create_failed").length,
            emailFailures: events.filter((event) => event.eventName === "emailjs_failed").length,
            legacyEventCount: events.filter(isLegacyAnalyticsEvent).length,
            recentBusinessEvents: cleanEvents.slice(0, 10),
            recentEvents: events.slice(0, 25),
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
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-3">
                    <div>Not authorized</div>
                    <Link to="/admin/login" className="inline-flex px-4 py-2 rounded-xl bg-white text-black">Go to Login</Link>
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
                        Clean analytics begin with the configured v2 production rollout. CRM metrics always use current lead documents.
                    </p>
                </div>
                <AdminNav onSignOut={handleSignOut} />
            </div>

            {error && (
                <div className="max-w-6xl mx-auto mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200">{error}</div>
            )}

            {loading ? (
                <div className="max-w-6xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">Loading analytics...</div>
            ) : (
                <div className="max-w-6xl mx-auto mt-6 space-y-6">
                    {!hasConfiguredAnalyticsCutover() && (
                        <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-5 text-sm text-amber-100">
                            Clean analytics are not configured. Set VITE_ANALYTICS_CUTOVER_ID during release. Public analytics fail closed; current CRM and pipeline reports remain available.
                        </div>
                    )}
                    {hasConfiguredAnalyticsCutover() && dashboard.cleanEvents.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/65">
                            No eligible public analytics events are in the current event window. Current CRM and pipeline reports remain available below.
                        </div>
                    )}

                    <section>
                        <h2 className="text-lg font-semibold">Public Traffic — Clean V2 Production Baseline</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard label="Visitors Today" value={dashboard.visitorsToday} />
                            <StatCard label="Visitors This Week" value={dashboard.visitorsThisWeek} />
                            <StatCard label="Total Page Views" value={dashboard.totalPageViews} />
                            <StatCard label="Unique Sessions" value={dashboard.uniqueSessions} helper="30-minute activity sessions for new events" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold">Current CRM Value</h2>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                            <StatCard label="Open Pipeline Value" value={formatMoney(dashboard.revenue.openPipelineValue)} helper="New through Proposal Sent only" />
                            <StatCard label="Closed-Won Value" value={formatMoney(dashboard.revenue.closedWonValue)} helper="Deal value, not collected revenue" />
                            <StatCard label="Lost Opportunity Value" value={formatMoney(dashboard.revenue.lostOpportunityValue)} />
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <h2 className="text-lg font-semibold">Top Pages</h2>
                            <div className="mt-4 space-y-2">
                                <CountList items={dashboard.topPages} emptyMessage="No public page views found." />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <h2 className="text-lg font-semibold">Service Interest</h2>
                            <div className="mt-4 space-y-2">
                                {dashboard.services.every((item) => item.count === 0) ? (
                                    <p className="text-sm text-white/65">No service-interest events found.</p>
                                ) : dashboard.services.map((item) => (
                                    <div key={item.label} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                                        <span className="text-sm text-white/80">{item.label}</span>
                                        <span className="font-semibold">{item.count} <span className="text-sm font-normal text-white/55">({item.percentage})</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold">Portfolio Interest</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <thead className="text-white/60"><tr><th className="py-2 pr-4">Project</th><th className="py-2 pr-4">Case Study Clicks</th><th className="py-2 pr-4">Live Site Clicks</th><th className="py-2">Total</th></tr></thead>
                                <tbody>
                                    {dashboard.portfolio.length === 0 ? (
                                        <tr><td colSpan="4" className="py-4 text-white/65">No public project clicks found.</td></tr>
                                    ) : dashboard.portfolio.map((project) => (
                                        <tr key={project.slug} className="border-t border-white/10">
                                            <td className="py-3 pr-4">{project.name}</td>
                                            <td className="py-3 pr-4">{project.caseStudyClicks}</td>
                                            <td className="py-3 pr-4">{project.liveSiteClicks}</td>
                                            <td className="py-3">{project.totalInterest}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold">Lead Funnel — Clean V2 Events and Current CRM</h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-4">
                            <StatCard label="Page Views (Events)" value={dashboard.funnelCounts.page_view || 0} />
                            <StatCard label="Form Started (Events)" value={dashboard.funnelCounts.contact_form_started || 0} helper={`${percent(dashboard.funnelCounts.contact_form_started || 0, dashboard.funnelCounts.page_view || 0)} of page views`} />
                            <StatCard label="Form Submitted (Events)" value={dashboard.funnelCounts.contact_form_submitted || 0} helper={`${percent(dashboard.funnelCounts.contact_form_submitted || 0, dashboard.funnelCounts.contact_form_started || 0)} of starts`} />
                            <StatCard label="Current Leads" value={dashboard.currentLeads} helper="Current CRM documents" />
                        </div>
                    </section>

                    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            ["Clean Lead Sources", dashboard.sources, "No clean v2 acquisition-source data found."],
                            ["Clean Landing Pages", dashboard.landingPages, "No clean v2 landing-page data found."],
                            ["Clean Conversion Locations", dashboard.conversionLocations, "No clean v2 conversion-location data found."],
                            ["Clean Campaign Sessions", dashboard.campaigns, "No clean v2 campaign visits found."],
                        ].map(([title, items, emptyMessage]) => (
                            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <div className="mt-4 space-y-2">
                                    <CountList items={items} emptyMessage={emptyMessage} />
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold">Clean V2 Lead Attribution — Current CRM</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="text-white/60"><tr><th className="py-2 pr-4">Acquisition Source</th><th className="py-2 pr-4">Landing Page</th><th className="py-2 pr-4">Conversion Location</th><th className="py-2 pr-4">Leads</th><th className="py-2 pr-4">Won</th><th className="py-2">Open Pipeline</th></tr></thead>
                                <tbody>
                                    {dashboard.attributionReport.length === 0 ? (
                                        <tr><td colSpan="6" className="py-4 text-white/65">No lead attribution data found.</td></tr>
                                    ) : dashboard.attributionReport.map((row) => (
                                        <tr key={`${row.source}-${row.landingPage}-${row.conversionLocation}`} className="border-t border-white/10">
                                            <td className="py-3 pr-4">{row.source}</td>
                                            <td className="py-3 pr-4 text-white/70">{row.landingPage}</td>
                                            <td className="py-3 pr-4 text-white/70">{row.conversionLocation}</td>
                                            <td className="py-3 pr-4">{row.leads}</td>
                                            <td className="py-3 pr-4">{row.won}</td>
                                            <td className="py-3">{formatMoney(row.pipelineValue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="text-lg font-semibold">Recent Clean Business Activity</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left text-sm">
                                <thead className="text-white/60"><tr><th className="py-2 pr-4">Timestamp</th><th className="py-2 pr-4">Event</th><th className="py-2 pr-4">Page</th><th className="py-2">Acquisition Source</th></tr></thead>
                                <tbody>
                                    {dashboard.recentBusinessEvents.length === 0 ? (
                                        <tr><td colSpan="4" className="py-4 text-white/65">No clean v2 business activity found.</td></tr>
                                    ) : dashboard.recentBusinessEvents.map((event) => (
                                        <tr key={event.id} className="border-t border-white/10">
                                            <td className="py-3 pr-4 text-white/70">{formatTimestamp(event.createdAt)}</td>
                                            <td className="py-3 pr-4">{event.eventName}</td>
                                            <td className="py-3 pr-4 text-white/70">{getEventCanonicalPath(event)}</td>
                                            <td className="py-3 text-white/70">{event.acquisitionSource || "Unknown"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <summary className="cursor-pointer text-lg font-semibold">Diagnostics and Raw Activity</summary>
                        <p className="mt-2 text-sm text-white/60">Operational diagnostics include all records in the latest event window and are excluded from public traffic totals.</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <StatCard label="Historical Lead Events" value={dashboard.historicalLeadEvents} />
                            <StatCard label="Lead Write Failures" value={dashboard.leadCreateFailures} />
                            <StatCard label="Email Failures" value={dashboard.emailFailures} />
                            <StatCard label="Legacy Records in Window" value={dashboard.legacyEventCount} />
                        </div>
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="text-white/60"><tr><th className="py-2 pr-4">Timestamp</th><th className="py-2 pr-4">Category</th><th className="py-2 pr-4">Event</th><th className="py-2 pr-4">Page</th><th className="py-2">Service Intent</th></tr></thead>
                                <tbody>
                                    {dashboard.recentEvents.map((event) => (
                                        <tr key={event.id} className="border-t border-white/10">
                                            <td className="py-3 pr-4 text-white/70">{formatTimestamp(event.createdAt)}</td>
                                            <td className="py-3 pr-4 text-white/70">{event.eventCategory || "legacy"}</td>
                                            <td className="py-3 pr-4">{event.eventName || "Unknown"}</td>
                                            <td className="py-3 pr-4 text-white/70">{getEventCanonicalPath(event)}</td>
                                            <td className="py-3 text-white/70">{getField(event, "serviceIntent") || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            )}
        </main>
    );
}
