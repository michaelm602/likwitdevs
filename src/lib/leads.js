import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { trackEvent } from "./analytics";

function text(value) {
    return String(value || "").trim();
}

export function buildPublicLeadDocument({
    name,
    email,
    replyTo,
    website,
    projectType,
    rawIntent,
    message,
    rawMessage,
    source,
    sourcePage,
    originPage,
    landingPage,
    referrer,
    leadSource,
    firstTouch,
    latestTouch,
    acquisitionSource,
    selfReportedSource,
    canonicalLandingPage,
    conversionLocation,
    submissionSurface,
    analyticsSchemaVersion,
    analyticsReleaseId,
}) {
    const fallbackLandingPage = text(canonicalLandingPage || landingPage || sourcePage) || "/";
    const fallbackAttribution = {
        acquisitionSource: "Unknown",
        landingPage: fallbackLandingPage,
        landingPath: fallbackLandingPage,
        referrer: text(referrer),
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmContent: "",
        utmTerm: "",
        fbclid: "",
        gclid: "",
    };

    return {
        name: text(name),
        email: text(email),
        replyTo: text(replyTo || email),
        website: text(website),
        projectType: text(projectType) || "Not sure yet",
        rawIntent: text(rawIntent),
        message: text(message),
        rawMessage: text(rawMessage),
        source: text(source),
        sourcePage: text(sourcePage),
        originPage: text(originPage),
        landingPage: text(landingPage),
        referrer: text(referrer),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "New",
        notes: "",
        estimatedValue: null,
        leadSource: text(leadSource),
        analyticsSchemaVersion: Number(analyticsSchemaVersion) || 2,
        analyticsReleaseId: text(analyticsReleaseId),
        firstTouch: firstTouch || fallbackAttribution,
        latestTouch: latestTouch || firstTouch || fallbackAttribution,
        acquisitionSource: text(acquisitionSource) || "Unknown",
        selfReportedSource: text(selfReportedSource || leadSource),
        canonicalLandingPage: fallbackLandingPage,
        conversionLocation: text(conversionLocation || originPage || sourcePage),
        submissionSurface: text(submissionSurface || source),
    };
}

export async function createPublicLead({ lead, analytics = {} }) {
    const leadDocument = buildPublicLeadDocument(lead);
    const leadRef = await addDoc(collection(db, "leads"), leadDocument);

    trackEvent({
        eventName: "lead_created",
        serviceIntent: analytics.serviceIntent || leadDocument.rawIntent,
        leadId: leadRef.id,
        originPage: leadDocument.originPage,
        landingPage: leadDocument.landingPage,
        referrer: leadDocument.referrer,
        firstTouch: leadDocument.firstTouch,
        latestTouch: leadDocument.latestTouch,
        acquisitionSource: leadDocument.acquisitionSource,
        conversionLocation: leadDocument.conversionLocation,
        submissionSurface: leadDocument.submissionSurface,
        metadata: {
            source: leadDocument.source,
            projectType: leadDocument.projectType,
            ...(analytics.metadata || {}),
        },
    });

    return leadRef;
}
