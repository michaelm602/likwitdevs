export const ANALYTICS_SCHEMA_VERSION = 2;
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const APPROVED_ANALYTICS_HOSTS = Object.freeze([
    "likwitdevs.com",
    "www.likwitdevs.com",
]);

export const ACQUISITION_SOURCES = Object.freeze([
    "Facebook",
    "Instagram",
    "Google Organic",
    "Google Ads",
    "Direct",
    "Referral",
    "Email",
    "QR",
    "NFC",
    "Outreach Audit",
    "Other Campaign",
    "Unknown",
]);

export const PUBLIC_EVENT_NAMES = Object.freeze([
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
]);

export const ADMIN_OPERATIONAL_EVENT_NAMES = Object.freeze([
    "admin_lead_status_changed",
    "admin_lead_note_updated",
    "admin_proposal_generated",
]);

const approvedHostSet = new Set(APPROVED_ANALYTICS_HOSTS);
const campaignKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
];

function cleanValue(value, maxLength = 200) {
    return String(value || "").trim().slice(0, maxLength);
}

function lower(value) {
    return cleanValue(value).toLowerCase();
}

function parseLocation(value) {
    if (value && typeof value === "object") {
        const pathname = value.pathname || "/";
        const search = value.search || "";
        return new URL(`${pathname}${search}`, "https://www.likwitdevs.com");
    }

    try {
        return new URL(String(value || "/"), "https://www.likwitdevs.com");
    } catch {
        return new URL("/", "https://www.likwitdevs.com");
    }
}

export function normalizeCanonicalPath(value) {
    const url = parseLocation(value);
    let pathname = url.pathname || "/";

    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
    pathname = pathname.replace(/\/{2,}/g, "/");
    if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");

    return pathname || "/";
}

export function isAdminPath(value) {
    const pathname = normalizeCanonicalPath(value).toLowerCase();
    return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isApprovedAnalyticsEnvironment({
    hostname,
    isProductionBuild,
}) {
    return Boolean(isProductionBuild) && approvedHostSet.has(lower(hostname));
}

export function shouldCollectPublicAnalytics({
    hostname,
    pathname,
    isProductionBuild,
}) {
    return (
        isApprovedAnalyticsEnvironment({ hostname, isProductionBuild }) &&
        !isAdminPath(pathname)
    );
}

export function shouldTrackPathnameChange(previousPath, nextPath) {
    const nextCanonical = normalizeCanonicalPath(nextPath);
    if (!previousPath) return true;
    return normalizeCanonicalPath(previousPath) !== nextCanonical;
}

export function sanitizeReferrer(value) {
    const raw = cleanValue(value, 1000);
    if (!raw) return "";

    try {
        const url = new URL(raw);
        return `${url.origin}${normalizeCanonicalPath(url.pathname)}`;
    } catch {
        return "";
    }
}

export function extractCampaignFields(locationValue) {
    const url = parseLocation(locationValue);
    const params = url.searchParams;

    return {
        utmSource: cleanValue(params.get("utm_source")),
        utmMedium: cleanValue(params.get("utm_medium")),
        utmCampaign: cleanValue(params.get("utm_campaign")),
        utmContent: cleanValue(params.get("utm_content")),
        utmTerm: cleanValue(params.get("utm_term")),
        fbclid: cleanValue(params.get("fbclid"), 256),
        gclid: cleanValue(params.get("gclid"), 256),
    };
}

function hasUtm(fields) {
    return Boolean(
        fields.utmSource ||
        fields.utmMedium ||
        fields.utmCampaign ||
        fields.utmContent ||
        fields.utmTerm
    );
}

function isInstagramHost(hostname) {
    return hostname === "instagram.com" || hostname.endsWith(".instagram.com");
}

function isFacebookHost(hostname) {
    return (
        hostname === "facebook.com" ||
        hostname.endsWith(".facebook.com") ||
        hostname === "fb.com" ||
        hostname.endsWith(".fb.com") ||
        hostname === "l.facebook.com" ||
        hostname === "lm.facebook.com"
    );
}

function getReferrerHostname(referrer) {
    try {
        return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
        return "";
    }
}

export function classifyAcquisitionSource({ campaign = {}, referrer = "" }) {
    const source = lower(campaign.utmSource);
    const medium = lower(campaign.utmMedium);
    const campaignName = lower(campaign.utmCampaign);
    const campaignText = `${source} ${medium} ${campaignName}`;
    const referrerHostname = getReferrerHostname(referrer);

    if (hasUtm(campaign)) {
        if (/(^|\s|[-_])qr($|\s|[-_])/.test(campaignText)) return "QR";
        if (/(^|\s|[-_])nfc($|\s|[-_])/.test(campaignText)) return "NFC";
        if (
            campaignText.includes("outreach audit") ||
            campaignText.includes("outreach-audit") ||
            campaignText.includes("outreach_audit") ||
            (source === "outreach" && campaignName.includes("audit"))
        ) {
            return "Outreach Audit";
        }
        if (
            medium === "email" ||
            source === "email" ||
            source.includes("newsletter")
        ) {
            return "Email";
        }
        if (["facebook", "fb", "meta"].includes(source)) return "Facebook";
        if (["instagram", "ig"].includes(source)) return "Instagram";
        if (
            source === "google" &&
            ["cpc", "ppc", "paid", "paid_search", "paid-search"].includes(medium)
        ) {
            return "Google Ads";
        }
        if (source === "google" && medium === "organic") return "Google Organic";
        return "Other Campaign";
    }

    if (campaign.gclid) return "Google Ads";
    if (campaign.fbclid) {
        return isInstagramHost(referrerHostname) ? "Instagram" : "Facebook";
    }

    if (!referrerHostname || approvedHostSet.has(referrerHostname)) return "Direct";
    if (
        referrerHostname === "google.com" ||
        referrerHostname.endsWith(".google.com")
    ) {
        return "Google Organic";
    }
    if (isInstagramHost(referrerHostname)) return "Instagram";
    if (isFacebookHost(referrerHostname)) return "Facebook";
    return "Referral";
}

export function buildSafeLandingPath(locationValue) {
    const url = parseLocation(locationValue);
    const safeParams = new URLSearchParams();

    campaignKeys.forEach((key) => {
        const value = cleanValue(
            url.searchParams.get(key),
            key.endsWith("clid") ? 256 : 200
        );
        if (value) safeParams.set(key, value);
    });

    const query = safeParams.toString();
    const pathname = normalizeCanonicalPath(url.pathname);
    return query ? `${pathname}?${query}` : pathname;
}

export function buildTouchAttribution({ location, referrer = "" }) {
    const campaign = extractCampaignFields(location);
    const safeReferrer = sanitizeReferrer(referrer);

    return {
        acquisitionSource: classifyAcquisitionSource({
            campaign,
            referrer: safeReferrer,
        }),
        landingPage: normalizeCanonicalPath(location),
        landingPath: buildSafeLandingPath(location),
        referrer: safeReferrer,
        ...campaign,
    };
}

export function hasCampaignSignal(touch = {}) {
    return Boolean(
        touch.utmSource ||
        touch.utmMedium ||
        touch.utmCampaign ||
        touch.utmContent ||
        touch.utmTerm ||
        touch.fbclid ||
        touch.gclid
    );
}

export function updateAttributionState({
    existing = {},
    touch,
    isEntry = false,
}) {
    const firstTouch = existing.firstTouch?.acquisitionSource
        ? existing.firstTouch
        : touch;
    const latestTouch =
        !existing.latestTouch?.acquisitionSource ||
        isEntry ||
        hasCampaignSignal(touch)
            ? touch
            : existing.latestTouch;

    return { firstTouch, latestTouch };
}

function defaultSessionIdFactory() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function readStoredSession(storage, storageKey) {
    if (!storage) return null;

    try {
        const parsed = JSON.parse(storage.getItem(storageKey) || "null");
        if (
            parsed &&
            typeof parsed.id === "string" &&
            parsed.id &&
            Number.isFinite(parsed.lastActivityAt)
        ) {
            return parsed;
        }
    } catch {
        return null;
    }

    return null;
}

function writeStoredSession(storage, storageKey, session) {
    if (!storage) return;

    try {
        storage.setItem(storageKey, JSON.stringify(session));
    } catch {
        // The in-memory copy remains available for this page lifecycle.
    }
}

export function createSessionManager({
    storage = null,
    storageKey = "likwitdevs_analytics_session_v2",
    now = () => Date.now(),
    createId = defaultSessionIdFactory,
} = {}) {
    let memorySession = readStoredSession(storage, storageKey);

    return {
        touch() {
            const currentTime = now();
            const storedSession = readStoredSession(storage, storageKey);
            const currentSession = storedSession || memorySession;
            const isActive =
                currentSession &&
                currentTime >= currentSession.lastActivityAt &&
                currentTime - currentSession.lastActivityAt < SESSION_TIMEOUT_MS;

            memorySession = {
                id: isActive ? currentSession.id : createId(),
                lastActivityAt: currentTime,
            };
            writeStoredSession(storage, storageKey, memorySession);
            return { ...memorySession, isNew: !isActive };
        },
        peek() {
            const storedSession = readStoredSession(storage, storageKey);
            return storedSession || memorySession;
        },
    };
}

export function isKnownAcquisitionSource(value) {
    return ACQUISITION_SOURCES.includes(value);
}
