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
}) {
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
        metadata: {
            source: leadDocument.source,
            projectType: leadDocument.projectType,
            ...(analytics.metadata || {}),
        },
    });

    return leadRef;
}
