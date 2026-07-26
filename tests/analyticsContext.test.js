import test from "node:test";
import assert from "node:assert/strict";
import {
    SESSION_TIMEOUT_MS,
    buildTouchAttribution,
    createSessionManager,
    isAdminPath,
    normalizeCanonicalPath,
    shouldCollectPublicAnalytics,
    shouldTrackPathnameChange,
    updateAttributionState,
} from "../src/lib/analyticsContext.js";

function createMemoryStorage() {
    const values = new Map();
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
    };
}

test("canonical paths remove queries, hashes, duplicate and trailing slashes", () => {
    assert.equal(normalizeCanonicalPath("/"), "/");
    assert.equal(normalizeCanonicalPath("/contact/?fbclid=abc#form"), "/contact");
    assert.equal(normalizeCanonicalPath("https://likwitdevs.com/services///?x=1"), "/services");
});

test("admin routes are excluded including query and hash variations", () => {
    assert.equal(isAdminPath("/admin"), true);
    assert.equal(isAdminPath("/admin/login?next=/admin#form"), true);
    assert.equal(isAdminPath("/admin/leads/"), true);
    assert.equal(isAdminPath("/services"), false);
});

test("only approved production hosts collect public analytics", () => {
    const base = { pathname: "/", isProductionBuild: true };
    assert.equal(shouldCollectPublicAnalytics({ ...base, hostname: "likwitdevs.com" }), true);
    assert.equal(shouldCollectPublicAnalytics({ ...base, hostname: "www.likwitdevs.com" }), true);
    assert.equal(shouldCollectPublicAnalytics({ ...base, hostname: "localhost" }), false);
    assert.equal(shouldCollectPublicAnalytics({ ...base, hostname: "127.0.0.1" }), false);
    assert.equal(shouldCollectPublicAnalytics({ ...base, hostname: "preview.vercel.app" }), false);
    assert.equal(shouldCollectPublicAnalytics({ ...base, hostname: "michaelm602.github.io" }), false);
    assert.equal(
        shouldCollectPublicAnalytics({
            ...base,
            hostname: "likwitdevs.com",
            isProductionBuild: false,
        }),
        false
    );
    assert.equal(
        shouldCollectPublicAnalytics({
            ...base,
            hostname: "likwitdevs.com",
            pathname: "/admin/analytics?x=1",
        }),
        false
    );
});

test("query and hash changes do not count as pathname navigation", () => {
    assert.equal(shouldTrackPathnameChange("/contact", "/contact?plan=Core"), false);
    assert.equal(shouldTrackPathnameChange("/contact#top", "/contact#form"), false);
    assert.equal(shouldTrackPathnameChange("/contact", "/services"), true);
    assert.equal(shouldTrackPathnameChange("", "/"), true);
});

test("sessions reuse IDs inside 30 minutes and expire at the boundary", () => {
    let currentTime = 1_000;
    let nextId = 0;
    const manager = createSessionManager({
        storage: createMemoryStorage(),
        now: () => currentTime,
        createId: () => `id-${++nextId}`,
    });

    assert.deepEqual(manager.touch(), {
        id: "id-1",
        lastActivityAt: 1_000,
        isNew: true,
    });
    currentTime += SESSION_TIMEOUT_MS - 1;
    assert.equal(manager.touch().id, "id-1");
    currentTime += SESSION_TIMEOUT_MS;
    assert.deepEqual(manager.touch(), {
        id: "id-2",
        lastActivityAt: currentTime,
        isNew: true,
    });
});

test("unavailable storage keeps one in-memory session per page lifecycle", () => {
    let currentTime = 10;
    let nextId = 0;
    const manager = createSessionManager({
        storage: null,
        now: () => currentTime,
        createId: () => `memory-${++nextId}`,
    });
    assert.equal(manager.touch().id, "memory-1");
    currentTime += 100;
    assert.equal(manager.touch().id, "memory-1");
});

const cases = [
    ["UTM Facebook", "/?utm_source=facebook&utm_medium=social", "", "Facebook"],
    ["UTM Instagram", "/?utm_source=instagram&utm_medium=social", "", "Instagram"],
    ["Google Ads UTM", "/?utm_source=google&utm_medium=cpc", "", "Google Ads"],
    ["gclid", "/?gclid=secret-click", "", "Google Ads"],
    ["fbclid", "/?fbclid=secret-click", "", "Facebook"],
    ["Google organic", "/", "https://www.google.com/search?q=private", "Google Organic"],
    ["Facebook referrer", "/", "https://l.facebook.com/path?private=1", "Facebook"],
    ["Instagram referrer", "/", "https://www.instagram.com/path?private=1", "Instagram"],
    ["Direct", "/", "", "Direct"],
    ["Referral", "/", "https://example.com/article?private=1", "Referral"],
    ["Email", "/?utm_source=newsletter&utm_medium=email", "", "Email"],
    ["QR", "/?utm_source=card&utm_medium=qr", "", "QR"],
    ["NFC", "/?utm_source=card&utm_medium=nfc", "", "NFC"],
    [
        "Outreach Audit",
        "/?utm_source=outreach&utm_campaign=website_audit",
        "",
        "Outreach Audit",
    ],
    ["Other Campaign", "/?utm_source=partner&utm_campaign=spring", "", "Other Campaign"],
];

for (const [name, location, referrer, expected] of cases) {
    test(`classifies ${name}`, () => {
        const touch = buildTouchAttribution({ location, referrer });
        assert.equal(touch.acquisitionSource, expected);
        assert.equal(touch.landingPage, "/");
        assert.equal(touch.referrer.includes("?"), false);
    });
}

test("safe landing paths retain only approved campaign parameters", () => {
    const touch = buildTouchAttribution({
        location: "/contact?utm_source=email&token=sensitive&email=person@example.com#form",
        referrer: "",
    });
    assert.equal(touch.landingPath, "/contact?utm_source=email");
    assert.equal(touch.landingPath.includes("sensitive"), false);
    assert.equal(touch.landingPath.includes("person"), false);
});

test("first touch remains stable while latest touch updates on a new entry", () => {
    const first = buildTouchAttribution({
        location: "/?utm_source=facebook",
        referrer: "",
    });
    const initial = updateAttributionState({ touch: first, isEntry: true });
    const internal = buildTouchAttribution({ location: "/services", referrer: "" });
    const afterInternal = updateAttributionState({
        existing: initial,
        touch: internal,
        isEntry: false,
    });
    assert.equal(afterInternal.firstTouch.acquisitionSource, "Facebook");
    assert.equal(afterInternal.latestTouch.acquisitionSource, "Facebook");

    const returnVisit = buildTouchAttribution({ location: "/contact", referrer: "" });
    const afterReturn = updateAttributionState({
        existing: afterInternal,
        touch: returnVisit,
        isEntry: true,
    });
    assert.equal(afterReturn.firstTouch.acquisitionSource, "Facebook");
    assert.equal(afterReturn.latestTouch.acquisitionSource, "Direct");
    assert.equal(afterReturn.latestTouch.landingPage, "/contact");
});
