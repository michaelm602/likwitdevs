import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { isAuthorizedAdminUser } from "./adminAccess";
import { ANALYTICS_CUTOVER_ID, hasConfiguredAnalyticsCutover } from "./analyticsRuntimeConfig";
import {
    ADMIN_OPERATIONAL_EVENT_NAMES,
    ANALYTICS_SCHEMA_VERSION,
    PUBLIC_EVENT_NAMES,
    buildTouchAttribution,
    createSessionManager,
    normalizeCanonicalPath,
    shouldCollectPublicAnalytics,
    updateAttributionState,
} from "./analyticsContext";

const analyticsCollection = "analyticsEvents";
const attributionStorageKey = "likwitdevs_attribution_v2";
const publicEventNames = new Set(PUBLIC_EVENT_NAMES);
const adminOperationalEventNames = new Set(ADMIN_OPERATIONAL_EVENT_NAMES);

let sessionManager;
let attributionMemory = {};
let entryCaptured = false;

function getStorage() {
    if (typeof window === "undefined") return null;
    try {
        return window.sessionStorage;
    } catch {
        return null;
    }
}

function getSessionManager() {
    if (!sessionManager) {
        sessionManager = createSessionManager({ storage: getStorage() });
    }
    return sessionManager;
}

function getRuntimeLocation() {
    if (typeof window === "undefined") {
        return { pathname: "/", search: "", hostname: "" };
    }

    return {
        pathname: window.location.pathname || "/",
        search: window.location.search || "",
        hostname: window.location.hostname || "",
    };
}

function getReferrer() {
    if (typeof document === "undefined") return "";
    return document.referrer || "";
}

function readAttribution() {
    const storage = getStorage();
    if (!storage) return attributionMemory;

    try {
        const parsed = JSON.parse(storage.getItem(attributionStorageKey) || "{}");
        attributionMemory = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        attributionMemory = {};
    }
    return attributionMemory;
}

function writeAttribution(attribution) {
    attributionMemory = attribution;
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.setItem(attributionStorageKey, JSON.stringify(attribution));
    } catch {
        // The in-memory copy remains available for this page lifecycle.
    }
}

function getUpdatedAttribution({ isEntry = false } = {}) {
    const location = getRuntimeLocation();
    const touch = buildTouchAttribution({
        location,
        referrer: getReferrer(),
    });
    const next = updateAttributionState({
        existing: readAttribution(),
        touch,
        isEntry,
    });
    writeAttribution(next);
    return next;
}

function getEventPolicy(eventName) {
    const location = getRuntimeLocation();
    const approvedEnvironment = shouldCollectPublicAnalytics({
        hostname: location.hostname,
        pathname: "/",
        isProductionBuild: import.meta.env.PROD,
    });

    if (adminOperationalEventNames.has(eventName)) {
        return {
            allowed: approvedEnvironment && isAuthorizedAdminUser(auth.currentUser),
            eventCategory: "admin_operation",
            isPublicTraffic: false,
        };
    }

    return {
        allowed:
            publicEventNames.has(eventName) &&
            hasConfiguredAnalyticsCutover() &&
            shouldCollectPublicAnalytics({
                hostname: location.hostname,
                pathname: location.pathname,
                isProductionBuild: import.meta.env.PROD,
            }),
        eventCategory: "public",
        isPublicTraffic: true,
    };
}

export function getAnalyticsSessionId() {
    return getSessionManager().peek()?.id || "";
}

export function getLeadAttribution() {
    const attribution = getUpdatedAttribution();
    const location = getRuntimeLocation();
    const firstTouch = attribution.firstTouch;
    const latestTouch = attribution.latestTouch;
    const conversionLocation = normalizeCanonicalPath(location.pathname);

    return {
        analyticsSchemaVersion: ANALYTICS_SCHEMA_VERSION,
        analyticsReleaseId: ANALYTICS_CUTOVER_ID,
        firstTouch,
        latestTouch,
        acquisitionSource: firstTouch?.acquisitionSource || "Unknown",
        canonicalLandingPage: firstTouch?.landingPage || conversionLocation,
        conversionLocation,
        landingPage: firstTouch?.landingPage || conversionLocation,
        originPage: conversionLocation,
        referrer: firstTouch?.referrer || "",
    };
}

function compactEventPayload(payload, policy) {
    const location = getRuntimeLocation();
    const canonicalPath = normalizeCanonicalPath(
        payload.pagePath || payload.sourcePage || location.pathname
    );
    const session = getSessionManager().touch();
    const isEntry = !entryCaptured && policy.isPublicTraffic;
    const attribution = getUpdatedAttribution({ isEntry });
    if (policy.isPublicTraffic) entryCaptured = true;

    return {
        schemaVersion: ANALYTICS_SCHEMA_VERSION,
        releaseId: ANALYTICS_CUTOVER_ID,
        eventCategory: policy.eventCategory,
        isPublicTraffic: policy.isPublicTraffic,
        hostname: location.hostname.toLowerCase(),
        eventName: payload.eventName,
        canonicalPath,
        pagePath: canonicalPath,
        sourcePage: normalizeCanonicalPath(payload.sourcePage || canonicalPath),
        targetPath: payload.targetPath
            ? normalizeCanonicalPath(payload.targetPath)
            : "",
        targetUrl: payload.targetUrl || "",
        projectSlug: payload.projectSlug || "",
        projectName: payload.projectName || "",
        serviceIntent: payload.serviceIntent || "",
        leadId: payload.leadId || "",
        originPage: normalizeCanonicalPath(
            payload.originPage || payload.conversionLocation || canonicalPath
        ),
        landingPage:
            payload.landingPage ||
            attribution.firstTouch?.landingPage ||
            canonicalPath,
        referrer:
            payload.referrer ||
            attribution.firstTouch?.referrer ||
            "",
        firstTouch: payload.firstTouch || attribution.firstTouch,
        latestTouch: payload.latestTouch || attribution.latestTouch,
        acquisitionSource:
            payload.acquisitionSource ||
            attribution.firstTouch?.acquisitionSource ||
            "Unknown",
        conversionLocation: normalizeCanonicalPath(
            payload.conversionLocation || canonicalPath
        ),
        submissionSurface:
            payload.submissionSurface ||
            payload.metadata?.source ||
            "",
        metadata: payload.metadata || {},
        createdAt: serverTimestamp(),
        sessionId: session.id,
    };
}

export function trackEvent(payload = {}) {
    const policy = getEventPolicy(payload.eventName || "");
    if (!policy.allowed) return Promise.resolve(null);

    try {
        const eventPayload = compactEventPayload(payload, policy);
        return addDoc(collection(db, analyticsCollection), eventPayload).catch((err) => {
            console.error("Analytics event write failed", {
                eventName: eventPayload.eventName,
                error: err,
            });
            return null;
        });
    } catch (err) {
        console.error("Analytics event setup failed", {
            eventName: payload.eventName || "event",
            error: err,
        });
        return Promise.resolve(null);
    }
}

export function trackPageView(pagePath) {
    return trackEvent({
        eventName: "page_view",
        pagePath,
        sourcePage: pagePath,
    });
}
