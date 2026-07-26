export const ADMIN_OWNER_UID = "7u3Uund1CKRrtf4Pw0ehaLCI7WR2";

const firebaseUidPattern = /^[A-Za-z0-9_-]{20,128}$/;
const invalidMarkers = /(placeholder|example|changeme|undefined|null)/i;

export function hasValidAdminOwnerConfiguration() {
    return (
        firebaseUidPattern.test(ADMIN_OWNER_UID) &&
        !ADMIN_OWNER_UID.includes("@") &&
        !invalidMarkers.test(ADMIN_OWNER_UID)
    );
}

export function isAuthorizedAdminUser(user) {
    return (
        hasValidAdminOwnerConfiguration() &&
        Boolean(user?.uid) &&
        user.uid === ADMIN_OWNER_UID
    );
}
