export const ANALYTICS_CUTOVER_ID = String(
    import.meta.env.VITE_ANALYTICS_CUTOVER_ID || ""
).trim();

export function hasConfiguredAnalyticsCutover() {
    return ANALYTICS_CUTOVER_ID.length > 0;
}
