import emailjs from "@emailjs/browser";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function assertEmailJsConfigured() {
    const missing = [];
    if (!serviceId) missing.push("VITE_EMAILJS_SERVICE_ID");
    if (!templateId) missing.push("VITE_EMAILJS_TEMPLATE_ID");
    if (!publicKey) missing.push("VITE_EMAILJS_PUBLIC_KEY");

    if (missing.length) {
        throw new Error(`EmailJS configuration is missing: ${missing.join(", ")}`);
    }
}

export async function sendLeadNotification({
    title,
    name,
    email,
    message,
    ...templateParams
}) {
    assertEmailJsConfigured();

    return emailjs.send(
        serviceId,
        templateId,
        {
            title,
            name,
            email,
            visitor_name: name,
            visitor_email: email,
            from_name: name,
            from_email: email,
            reply_to: email,
            notification_from_name: "Likwit Devs Website",
            message,
            ...templateParams,
        },
        { publicKey }
    );
}
