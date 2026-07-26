import test from "node:test";
import assert from "node:assert/strict";
import { ADMIN_OWNER_UID } from "../src/lib/adminAccess.js";
import {
    ARCHIVED_LEAD_FILTER,
    canPermanentlyDeleteLead,
    matchesLeadStatusFilter,
} from "../src/lib/adminLeadControls.js";

test("default and status-filtered views exclude archived leads", () => {
    const active = { status: "New" };
    const archived = { status: "New", archived: true };

    assert.equal(matchesLeadStatusFilter(active, ""), true);
    assert.equal(matchesLeadStatusFilter(archived, ""), false);
    assert.equal(matchesLeadStatusFilter(active, "New"), true);
    assert.equal(matchesLeadStatusFilter(archived, "New"), false);
});

test("Archived filter includes only archived leads", () => {
    assert.equal(
        matchesLeadStatusFilter({ status: "Won", archived: true }, ARCHIVED_LEAD_FILTER),
        true
    );
    assert.equal(
        matchesLeadStatusFilter({ status: "Won" }, ARCHIVED_LEAD_FILTER),
        false
    );
});

test("permanent delete is limited to the owner admin and archived leads", () => {
    const archivedLead = { archived: true };

    assert.equal(
        canPermanentlyDeleteLead({ uid: ADMIN_OWNER_UID }, archivedLead),
        true
    );
    assert.equal(
        canPermanentlyDeleteLead({ uid: "wrong-owner" }, archivedLead),
        false
    );
    assert.equal(
        canPermanentlyDeleteLead({ uid: ADMIN_OWNER_UID }, { archived: false }),
        false
    );
});
