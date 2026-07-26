import test from "node:test";
import assert from "node:assert/strict";
import {
    getEventCanonicalPath,
    getLeadAcquisitionSource,
    getLeadConversionLocation,
    getLeadLandingPage,
    getLeadPipelineValue,
    isEligibleV2AttributedLead,
    isEligibleV2PublicEvent,
    isLegacyAnalyticsEvent,
} from "../src/lib/analyticsReporting.js";

const cutoverId = "production-v2-checkpoint";

function v2Event(overrides = {}) {
    return {
        schemaVersion: 2,
        releaseId: cutoverId,
        eventCategory: "public",
        isPublicTraffic: true,
        hostname: "www.likwitdevs.com",
        canonicalPath: "/services",
        ...overrides,
    };
}

function v2Lead(overrides = {}) {
    return {
        analyticsSchemaVersion: 2,
        analyticsReleaseId: cutoverId,
        acquisitionSource: "Direct",
        firstTouch: { acquisitionSource: "Direct", landingPage: "/" },
        latestTouch: { acquisitionSource: "Direct", landingPage: "/" },
        ...overrides,
    };
}

test("legacy event paths normalize without query fragmentation", () => {
    assert.equal(
        getEventCanonicalPath({ pagePath: "/contact/?fbclid=old#form" }),
        "/contact"
    );
});

test("clean public traffic requires v2, production host, and exact cutover", () => {
    assert.equal(isEligibleV2PublicEvent(v2Event(), cutoverId), true);
    assert.equal(isEligibleV2PublicEvent(v2Event(), ""), false);
    assert.equal(isEligibleV2PublicEvent(v2Event(), "different-rollout"), false);
    assert.equal(
        isEligibleV2PublicEvent(v2Event({ canonicalPath: "/admin/leads" }), cutoverId),
        false
    );
    assert.equal(
        isEligibleV2PublicEvent(v2Event({ hostname: "preview.vercel.app" }), cutoverId),
        false
    );
    assert.equal(
        isEligibleV2PublicEvent(v2Event({
            eventCategory: "admin_operation",
            isPublicTraffic: false,
        }), cutoverId),
        false
    );
    assert.equal(
        isEligibleV2PublicEvent({ eventName: "page_view", pagePath: "/" }, cutoverId),
        false
    );
});

test("legacy analytics are diagnostics-only", () => {
    assert.equal(isLegacyAnalyticsEvent({ eventName: "page_view" }), true);
    assert.equal(isLegacyAnalyticsEvent(v2Event()), false);
});

test("clean lead attribution requires v2 and the exact cutover", () => {
    assert.equal(isEligibleV2AttributedLead(v2Lead(), cutoverId), true);
    assert.equal(isEligibleV2AttributedLead(v2Lead(), ""), false);
    assert.equal(isEligibleV2AttributedLead(v2Lead(), "different-rollout"), false);
    assert.equal(
        isEligibleV2AttributedLead(v2Lead({ acquisitionSource: "Referral" }), cutoverId),
        false
    );
});

test("legacy query strings are never upgraded into acquisition traffic", () => {
    assert.equal(
        getLeadAcquisitionSource({
            landingPage: "/?utm_source=google&utm_medium=cpc",
            referrer: "https://google.com/",
        }),
        "Unknown"
    );
});

test("self-reported source stays separate from computed acquisition", () => {
    const lead = v2Lead({
        acquisitionSource: "Direct",
        leadSource: "Referral",
        selfReportedSource: "Referral",
    });
    assert.equal(getLeadAcquisitionSource(lead), "Direct");
    assert.equal(lead.selfReportedSource, "Referral");
});

test("lead landing and conversion locations use canonical fallbacks", () => {
    const lead = {
        landingPage: "/services/?utm_source=email",
        originPage: "/contact?intent=webdev",
    };
    assert.equal(getLeadLandingPage(lead), "/services");
    assert.equal(getLeadConversionLocation(lead), "/contact");
});

test("pipeline value excludes closed and spam leads", () => {
    assert.equal(getLeadPipelineValue({ status: "New", estimatedValue: 900 }), 900);
    assert.equal(getLeadPipelineValue({ status: "Proposal Sent", proposalValue: 1500 }), 1500);
    assert.equal(getLeadPipelineValue({ status: "Won", proposalValue: 1500 }), 0);
    assert.equal(getLeadPipelineValue({ status: "Lost", proposalValue: 1500 }), 0);
    assert.equal(getLeadPipelineValue({ status: "Spam", proposalValue: 1500 }), 0);
});
