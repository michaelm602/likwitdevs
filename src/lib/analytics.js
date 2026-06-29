import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const analyticsCollection = "analyticsEvents";
const sessionStorageKey = "likwitdevs_session_id";
const attributionStorageKey = "likwitdevs_attribution";

function createSessionId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getAnalyticsSessionId() {
    if (typeof window === "undefined") return "";

    try {
        const existing = window.localStorage.getItem(sessionStorageKey);
        if (existing) return existing;

        const next = createSessionId();
        window.localStorage.setItem(sessionStorageKey, next);
        return next;
    } catch {
        return createSessionId();
    }
}

function getCurrentPagePath() {
    if (typeof window === "undefined") return "";
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getReferrer() {
    if (typeof document === "undefined") return "";
    return document.referrer || "";
}

function readAttribution() {
    if (typeof window === "undefined") return {};

    try {
        return JSON.parse(window.localStorage.getItem(attributionStorageKey) || "{}");
    } catch {
        return {};
    }
}

function writeAttribution(attribution) {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(attributionStorageKey, JSON.stringify(attribution));
    } catch {
        // Attribution should never interrupt the user experience.
    }
}

function isContactTarget(target = "") {
    return target.startsWith("/contact") || target.includes("/contact?");
}

function getUpdatedAttribution(payload = {}) {
    const currentPage = payload.pagePath || payload.sourcePage || getCurrentPagePath();
    const existing = readAttribution();
    const next = {
        landingPage: existing.landingPage || currentPage,
        originPage: existing.originPage || "",
        referrer: existing.referrer || getReferrer(),
    };

    if (payload.eventName === "cta_click" && isContactTarget(payload.targetPath || "")) {
        next.originPage = currentPage;
    }

    if (
        ["contact_form_started", "contact_form_submitted", "lead_created", "lead_create_failed"].includes(payload.eventName) &&
        !next.originPage
    ) {
        next.originPage = currentPage;
    }

    writeAttribution(next);
    return next;
}

export function getLeadAttribution() {
    const attribution = getUpdatedAttribution({});
    return {
        originPage: attribution.originPage || getCurrentPagePath(),
        landingPage: attribution.landingPage || getCurrentPagePath(),
        referrer: attribution.referrer || "",
    };
}

function compactEventPayload(payload = {}) {
    const attribution = getUpdatedAttribution(payload);

    return {
        eventName: payload.eventName || "event",
        pagePath: payload.pagePath || getCurrentPagePath(),
        sourcePage: payload.sourcePage || getCurrentPagePath(),
        targetPath: payload.targetPath || "",
        targetUrl: payload.targetUrl || "",
        projectSlug: payload.projectSlug || "",
        projectName: payload.projectName || "",
        serviceIntent: payload.serviceIntent || "",
        leadId: payload.leadId || "",
        originPage: payload.originPage || attribution.originPage || "",
        landingPage: payload.landingPage || attribution.landingPage || "",
        referrer: payload.referrer || attribution.referrer || "",
        metadata: payload.metadata || {},
        createdAt: serverTimestamp(),
        sessionId: getAnalyticsSessionId(),
    };
}

export function trackEvent(payload) {
    try {
        const eventPayload = compactEventPayload(payload);
        return addDoc(collection(db, analyticsCollection), eventPayload).catch((err) => {
            console.error("Analytics event write failed", {
                eventName: eventPayload.eventName,
                error: err,
            });
            return null;
        });
    } catch (err) {
        console.error("Analytics event setup failed", {
            eventName: payload?.eventName || "event",
            error: err,
        });
        return Promise.resolve(null);
    }
}

export function trackPageView(pagePath) {
    trackEvent({
        eventName: "page_view",
        pagePath,
        sourcePage: pagePath,
    });
}
