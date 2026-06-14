import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

let lastTrackedPagePath = "";

export default function AnalyticsRouteTracker() {
    const location = useLocation();

    useEffect(() => {
        const pagePath = `${location.pathname}${location.search}${location.hash}`;
        if (pagePath === lastTrackedPagePath) return;
        lastTrackedPagePath = pagePath;
        trackPageView(pagePath);
    }, [location.pathname, location.search, location.hash]);

    return null;
}
