# Analytics v2 release runbook

## Clean-baseline cutover

Set `VITE_ANALYTICS_CUTOVER_ID` in the production website environment immediately
before building the v2 release. Use a new opaque, non-secret rollout label (for
example, a release identifier); do not use or infer a deployment date. Keep that
same value for later website deployments unless an intentional new analytics
baseline is approved.

The website writes this value as:

- `releaseId` on schema-v2 analytics events
- `analyticsReleaseId` on schema-v2 public lead documents

The admin dashboard includes a record in primary traffic, source, campaign,
interest, funnel, attribution, and recent-business-activity reports only when it
is schema v2, production-hosted, public, and has an exact match to the configured
cutover ID. If the variable is missing, public analytics collection and primary
analytics fail closed while current CRM lead and pipeline reports stay visible.
Legacy activity remains visible only in Diagnostics.

## Two-phase rules rollout

`firestore.rules` is the transitional ruleset. It has separate validators for:

- existing legacy public analytics writes
- schema-v2 public analytics writes
- existing legacy public lead writes
- schema-v2 public lead writes
- owner-authorized legacy and v2 admin operational events

Legacy compatibility is temporary. After the observation window, replace
`firestore.rules` with the checked-in `firestore.v2-only.rules`, rerun the
Firestore emulator suite against that exact active rules file with
`FIRESTORE_RULES_MODE=v2-only`, review the diff
to confirm that only legacy validators and allow clauses were removed, and then
deploy the v2-only rules. Do not retain a legacy `allow create` branch.

## Exact deployment sequence

1. Install or make Java available through the normal operator-managed
   environment. Run the Firestore emulator rules tests and require every test to
   pass. This is a release gate.
2. Deploy `firestore.rules` (the transitional rules) by itself.
3. Set `VITE_ANALYTICS_CUTOVER_ID` to a new rollout label and deploy the v2
   website.
4. Perform the controlled production verification below.
5. Observe the compatibility window. Monitor rejected writes, lead delivery,
   clean dashboard population, and unexpected legacy volume. Do not mix legacy
   records into primary reports.
6. Replace the active rules file with `firestore.v2-only.rules`, rerun the
   emulator suite against it, and deploy the v2-only rules.

No website or rules deployment should be described as atomic.

## Controlled production verification

Use a designated test browser/session and a clearly identifiable test lead.
Inspect Firestore and the admin dashboard without changing production records
other than the explicitly controlled writes.

1. **One valid public page view:** Open a production public route once. Confirm
   exactly one `page_view` with schema version 2, the configured release ID,
   approved production hostname, canonical path, public category, and a
   non-empty session ID.
2. **One query-string campaign visit:** Start a fresh session on a production
   URL with controlled UTM parameters. Confirm first touch preserves the UTM
   values, the canonical path excludes the query, and the expected campaign and
   computed acquisition source appear in clean reports.
3. **No duplicate after query/hash change:** In the same route, change only the
   query string and then the hash. Confirm neither change creates another
   `page_view`.
4. **No admin page view:** Visit an admin route. Confirm no public
   `page_view` is created and the route is absent from clean public reports.
5. **One controlled test lead:** Submit one designated test lead from the
   campaign session. Confirm one lead document and one `lead_created` event,
   each with the v2 schema/release markers.
6. **Correct acquisition source:** Confirm the computed source equals first
   touch and is not replaced by the self-reported `leadSource`.
7. **Correct conversion location:** Confirm the lead and event use the
   canonical public form route as `conversionLocation`.
8. **Correct first/latest touch:** Confirm first touch remains the initial
   campaign entry and latest touch reflects the most recent qualifying touch;
   both maps have the same exact 11-field shape.
9. **Authorized admin operation:** As the configured owner, perform one
   reversible admin workflow that emits an allowlisted operational event.
   Confirm one `admin_operation` event with `isPublicTraffic: false`, and confirm
   it is excluded from primary reports.
10. **Rejected unauthorized admin event:** From an unauthenticated controlled
    client, attempt the equivalent allowlisted admin event write. Confirm
    Firestore rejects it and no record exists.

Delete or archive the controlled test lead later only through the normal
authorized CRM workflow and according to the business's data-retention policy.
