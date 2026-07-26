/* global process, Buffer */
import test from "node:test";
import assert from "node:assert/strict";
import { ADMIN_OWNER_UID } from "../src/lib/adminAccess.js";

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = "demo-likwitdevs";
const rulesMode = process.env.FIRESTORE_RULES_MODE || "transitional";
const acceptsLegacy = rulesMode === "transitional";
const baseUrl = `http://${emulatorHost}/v1/projects/${projectId}/databases/(default)/documents`;
const ownerUid = ADMIN_OWNER_UID;

function value(input) {
    if (input === null) return { nullValue: null };
    if (typeof input === "string") return { stringValue: input };
    if (typeof input === "boolean") return { booleanValue: input };
    if (Number.isInteger(input)) return { integerValue: String(input) };
    if (typeof input === "number") return { doubleValue: input };
    if (Array.isArray(input)) return { arrayValue: { values: input.map(value) } };
    return {
        mapValue: {
            fields: Object.fromEntries(
                Object.entries(input).map(([key, item]) => [key, value(item)])
            ),
        },
    };
}

function fields(record) {
    return Object.fromEntries(
        Object.entries(record).map(([key, item]) => [key, value(item)])
    );
}

function touch(source = "Direct", landingPage = "/") {
    return {
        acquisitionSource: source,
        landingPage,
        landingPath: landingPage,
        referrer: "",
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmContent: "",
        utmTerm: "",
        fbclid: "",
        gclid: "",
    };
}

function eventRecord(overrides = {}) {
    return {
        schemaVersion: 2,
        releaseId: "production-v2-checkpoint",
        eventCategory: "public",
        isPublicTraffic: true,
        hostname: "www.likwitdevs.com",
        eventName: "page_view",
        canonicalPath: "/services",
        pagePath: "/services",
        sourcePage: "/services",
        targetPath: "",
        targetUrl: "",
        projectSlug: "",
        projectName: "",
        serviceIntent: "",
        leadId: "",
        originPage: "/services",
        landingPage: "/services",
        referrer: "",
        firstTouch: touch("Direct", "/services"),
        latestTouch: touch("Direct", "/services"),
        acquisitionSource: "Direct",
        conversionLocation: "/services",
        submissionSurface: "",
        metadata: {},
        sessionId: "anonymous-session-id",
        ...overrides,
    };
}

function legacyEventRecord(overrides = {}) {
    return {
        eventName: "page_view",
        pagePath: "/services",
        sourcePage: "/services",
        targetPath: "",
        targetUrl: "",
        projectSlug: "",
        projectName: "",
        serviceIntent: "",
        leadId: "",
        metadata: {},
        originPage: "/services",
        landingPage: "/services",
        referrer: "",
        sessionId: "legacy-session-id",
        ...overrides,
    };
}

function leadRecord(overrides = {}) {
    return {
        name: "Test Lead",
        email: "lead@example.com",
        replyTo: "lead@example.com",
        website: "",
        projectType: "Business Website / Website Rebuild",
        rawIntent: "webdev",
        message: "Project request",
        rawMessage: "Project request",
        source: "contact",
        sourcePage: "/contact",
        status: "New",
        originPage: "/contact",
        landingPage: "/services",
        referrer: "",
        estimatedValue: null,
        notes: "",
        leadSource: "Referral",
        analyticsSchemaVersion: 2,
        analyticsReleaseId: "production-v2-checkpoint",
        firstTouch: touch("Direct", "/services"),
        latestTouch: touch("Direct", "/services"),
        acquisitionSource: "Direct",
        selfReportedSource: "Referral",
        canonicalLandingPage: "/services",
        conversionLocation: "/contact",
        submissionSurface: "contact",
        ...overrides,
    };
}

function legacyLeadRecord(overrides = {}) {
    return {
        name: "Legacy Lead",
        email: "legacy@example.com",
        replyTo: "legacy@example.com",
        website: "",
        projectType: "Business Website / Website Rebuild",
        rawIntent: "webdev",
        message: "Legacy project request",
        rawMessage: "Legacy project request",
        source: "contact",
        sourcePage: "/contact",
        status: "New",
        originPage: "/contact",
        landingPage: "/",
        referrer: "",
        estimatedValue: null,
        notes: "",
        leadSource: "Referral",
        ...overrides,
    };
}

function fakeOwnerToken() {
    const encode = (input) =>
        Buffer.from(JSON.stringify(input)).toString("base64url");
    const now = Math.floor(Date.now() / 1000);
    return `${encode({ alg: "none", typ: "JWT" })}.${encode({
        aud: projectId,
        auth_time: now,
        exp: now + 3600,
        iat: now,
        iss: `https://securetoken.google.com/${projectId}`,
        sub: ownerUid,
        user_id: ownerUid,
    })}.`;
}

async function commit(collectionName, record, timestampFields, token = "") {
    const documentId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const body = {
        writes: [{
            update: {
                name: `projects/${projectId}/databases/(default)/documents/${collectionName}/${documentId}`,
                fields: fields(record),
            },
            updateTransforms: timestampFields.map((fieldPath) => ({
                fieldPath,
                setToServerValue: "REQUEST_TIME",
            })),
        }],
    };
    return fetch(`${baseUrl}:commit`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });
}

test("Firestore emulator is available", () => {
    assert.ok(emulatorHost, "Run with firebase emulators:exec --only firestore");
});

test("legacy public event behavior matches the selected rules mode", async () => {
    const response = await commit(
        "analyticsEvents",
        legacyEventRecord(),
        ["createdAt"]
    );
    if (acceptsLegacy) {
        assert.equal(response.ok, true, await response.text());
    } else {
        assert.equal(response.status, 403);
    }
});

test("transitional rules reject arbitrary legacy event names", async () => {
    const response = await commit(
        "analyticsEvents",
        legacyEventRecord({ eventName: "arbitrary_event" }),
        ["createdAt"]
    );
    assert.equal(response.status, 403);
});

test("transitional legacy admin events require the configured owner", async () => {
    const record = legacyEventRecord({
        eventName: "admin_lead_status_changed",
        pagePath: "/admin/leads",
        sourcePage: "/admin/leads",
    });
    const unauthorized = await commit("analyticsEvents", record, ["createdAt"]);
    assert.equal(unauthorized.status, 403);

    const authorized = await commit(
        "analyticsEvents",
        record,
        ["createdAt"],
        fakeOwnerToken()
    );
    if (acceptsLegacy) {
        assert.equal(authorized.ok, true, await authorized.text());
    } else {
        assert.equal(authorized.status, 403);
    }
});

test("allows a valid production public analytics event", async () => {
    const response = await commit("analyticsEvents", eventRecord(), ["createdAt"]);
    assert.equal(response.ok, true, await response.text());
});

test("blocks unrecognized analytics metadata fields", async () => {
    const response = await commit(
        "analyticsEvents",
        eventRecord({ metadata: { arbitraryAdminField: "blocked" } }),
        ["createdAt"]
    );
    assert.equal(response.status, 403);
});

test("blocks non-production analytics hosts", async () => {
    const response = await commit(
        "analyticsEvents",
        eventRecord({ hostname: "preview.vercel.app" }),
        ["createdAt"]
    );
    assert.equal(response.status, 403);
});

test("blocks unknown acquisition sources", async () => {
    const response = await commit(
        "analyticsEvents",
        eventRecord({
            acquisitionSource: "Contact Page",
            firstTouch: touch("Contact Page", "/contact"),
        }),
        ["createdAt"]
    );
    assert.equal(response.status, 403);
});

test("blocks unauthenticated spoofed admin operational events", async () => {
    const response = await commit(
        "analyticsEvents",
        eventRecord({
            eventCategory: "admin_operation",
            isPublicTraffic: false,
            eventName: "admin_lead_status_changed",
            canonicalPath: "/admin/leads",
            pagePath: "/admin/leads",
            sourcePage: "/admin/leads",
        }),
        ["createdAt"]
    );
    assert.equal(response.status, 403);
});

test("allows authorized owner admin operational events", async () => {
    const response = await commit(
        "analyticsEvents",
        eventRecord({
            eventCategory: "admin_operation",
            isPublicTraffic: false,
            eventName: "admin_lead_status_changed",
            canonicalPath: "/admin/leads",
            pagePath: "/admin/leads",
            sourcePage: "/admin/leads",
        }),
        ["createdAt"],
        fakeOwnerToken()
    );
    assert.equal(response.ok, true, await response.text());
});

test("legacy public lead behavior matches the selected rules mode", async () => {
    const response = await commit(
        "leads",
        legacyLeadRecord(),
        ["createdAt", "updatedAt"]
    );
    if (acceptsLegacy) {
        assert.equal(response.ok, true, await response.text());
    } else {
        assert.equal(response.status, 403);
    }
});

test("allows a valid lead with separate computed and self-reported sources", async () => {
    const response = await commit(
        "leads",
        leadRecord(),
        ["createdAt", "updatedAt"]
    );
    assert.equal(response.ok, true, await response.text());
});

test("blocks public proposal fields and invalid lead types", async () => {
    const proposalResponse = await commit(
        "leads",
        leadRecord({ proposals: [] }),
        ["createdAt", "updatedAt"]
    );
    assert.equal(proposalResponse.status, 403);

    const typeResponse = await commit(
        "leads",
        leadRecord({ selfReportedSource: 123 }),
        ["createdAt", "updatedAt"]
    );
    assert.equal(typeResponse.status, 403);
});
