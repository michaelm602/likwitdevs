import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
    ADMIN_OWNER_UID,
    hasValidAdminOwnerConfiguration,
    isAuthorizedAdminUser,
} from "../src/lib/adminAccess.js";

test("owner configuration is a concrete Firebase UID and fails closed", () => {
    assert.equal(hasValidAdminOwnerConfiguration(), true);
    assert.equal(ADMIN_OWNER_UID.includes("@"), false);
    assert.equal(isAuthorizedAdminUser(null), false);
    assert.equal(isAuthorizedAdminUser({}), false);
    assert.equal(isAuthorizedAdminUser({ uid: "wrong-owner" }), false);
    assert.equal(isAuthorizedAdminUser({ uid: ADMIN_OWNER_UID }), true);
});

test("client and both Firestore rule sets use the same owner UID", async () => {
    const [transitional, v2Only] = await Promise.all([
        readFile(new URL("../firestore.rules", import.meta.url), "utf8"),
        readFile(new URL("../firestore.v2-only.rules", import.meta.url), "utf8"),
    ]);
    assert.equal(transitional.includes(ADMIN_OWNER_UID), true);
    assert.equal(v2Only.includes(ADMIN_OWNER_UID), true);
});
