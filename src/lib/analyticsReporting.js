import {
    APPROVED_ANALYTICS_HOSTS,
    isAdminPath,
    isKnownAcquisitionSource,
    normalizeCanonicalPath,
} from "./analyticsContext.js";

const approvedHosts = new Set(APPROVED_ANALYTICS_HOSTS);
export const OPEN_PIPELINE_STATUSES = new Set([
    "New",
    "Contacted",
    "Discovery",
    "Proposal Sent",
]);

export function getEventCanonicalPath(event = {}) {
    return normalizeCanonicalPath(
        event.canonicalPath ||
        event.pagePath ||
        event.sourcePage ||
        "/"
    );
}

export function isEligibleV2PublicEvent(event = {}, cutoverId = "") {
    const requiredCutoverId = String(cutoverId || "").trim();
    if (!requiredCutoverId) return false;

    return (
        event.schemaVersion === 2 &&
        event.releaseId === requiredCutoverId &&
        event.eventCategory === "public" &&
        event.isPublicTraffic === true &&
        approvedHosts.has(String(event.hostname || "").toLowerCase()) &&
        !isAdminPath(getEventCanonicalPath(event))
    );
}

export function isLegacyAnalyticsEvent(event = {}) {
    return event.schemaVersion !== 2;
}

export function isEligibleV2AttributedLead(lead = {}, cutoverId = "") {
    const requiredCutoverId = String(cutoverId || "").trim();
    return (
        Boolean(requiredCutoverId) &&
        lead.analyticsSchemaVersion === 2 &&
        lead.analyticsReleaseId === requiredCutoverId &&
        isKnownAcquisitionSource(lead.acquisitionSource) &&
        isKnownAcquisitionSource(lead.firstTouch?.acquisitionSource) &&
        lead.acquisitionSource === lead.firstTouch.acquisitionSource
    );
}

export function getLeadAcquisitionSource(lead = {}) {
    if (lead.analyticsSchemaVersion !== 2) return "Unknown";

    const candidates = [
        lead.acquisitionSource,
        lead.firstTouch?.acquisitionSource,
        lead.latestTouch?.acquisitionSource,
    ];
    return candidates.find(isKnownAcquisitionSource) || "Unknown";
}

export function getLeadLandingPage(lead = {}) {
    return normalizeCanonicalPath(
        lead.canonicalLandingPage ||
        lead.firstTouch?.landingPage ||
        lead.landingPage ||
        lead.sourcePage ||
        "/"
    );
}

export function getLeadConversionLocation(lead = {}) {
    return normalizeCanonicalPath(
        lead.conversionLocation ||
        lead.originPage ||
        lead.sourcePage ||
        "/"
    );
}

export function getLeadPipelineValue(lead = {}) {
    if (!OPEN_PIPELINE_STATUSES.has(lead.status || "New")) return 0;
    const proposalValue = Number(lead.proposalValue);
    if (Number.isFinite(proposalValue) && proposalValue > 0) return proposalValue;
    const estimatedValue = Number(lead.estimatedValue);
    return Number.isFinite(estimatedValue) && estimatedValue > 0
        ? estimatedValue
        : 0;
}
