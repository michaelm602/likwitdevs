import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const analyticsCollection = "analyticsEvents";
const sessionStorageKey = "likwitdevs_session_id";

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

function compactEventPayload(payload = {}) {
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
        metadata: payload.metadata || {},
        createdAt: serverTimestamp(),
        sessionId: getAnalyticsSessionId(),
    };
}

export function trackEvent(payload) {
    try {
        const eventPayload = compactEventPayload(payload);
        void addDoc(collection(db, analyticsCollection), eventPayload).catch(() => {});
    } catch {
        // Analytics should never interrupt the user experience.
    }
}

export function trackPageView(pagePath) {
    trackEvent({
        eventName: "page_view",
        pagePath,
        sourcePage: pagePath,
    });
}
