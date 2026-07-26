import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";
import {
    normalizeCanonicalPath,
    shouldTrackPathnameChange,
} from "../lib/analyticsContext";

export default function AnalyticsRouteTracker() {
    const location = useLocation();
    const lastTrackedPath = useRef("");

    useEffect(() => {
        const pagePath = normalizeCanonicalPath(location.pathname);
        if (!shouldTrackPathnameChange(lastTrackedPath.current, pagePath)) return;
        lastTrackedPath.current = pagePath;
        trackPageView(pagePath);
    }, [location.pathname]);

    return null;
}
