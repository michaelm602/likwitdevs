import { isAuthorizedAdminUser } from "./adminAccess.js";

export const ARCHIVED_LEAD_FILTER = "Archived";

export function isLeadArchived(lead) {
    return lead?.archived === true;
}

export function matchesLeadStatusFilter(lead, statusFilter) {
    const archived = isLeadArchived(lead);

    if (statusFilter === ARCHIVED_LEAD_FILTER) return archived;
    if (archived) return false;

    return !statusFilter || lead?.status === statusFilter;
}

export function canPermanentlyDeleteLead(user, lead) {
    return isAuthorizedAdminUser(user) && isLeadArchived(lead);
}
