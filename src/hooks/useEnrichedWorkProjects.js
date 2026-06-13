import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { publicDb } from "../lib/firebasePublic";
import { missingProjectHistory, workProjects } from "../data/workProjects";

function slugify(value = "") {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getProjectKeys(project) {
    return new Set([
        project.slug,
        project.name,
        ...(project.matchIds || []),
        ...(project.matchTitles || []),
    ].map(slugify).filter(Boolean));
}

function getFirestoreKeys(project) {
    return new Set([
        project.id,
        project.slug,
        project.title,
        project.name,
        project.href,
    ].map(slugify).filter(Boolean));
}

function getProjectImage(record) {
    return record?.imageUrl || record?.imageURL || record?.image || record?.thumbnailUrl || record?.thumbnail || "";
}

function getRecordBadges(record) {
    if (Array.isArray(record?.badges)) return record.badges;
    if (Array.isArray(record?.tags)) return record.tags;
    return [];
}

function normalizeCategory(category) {
    if (category === "owned" || category === "owned-product") return "owned";
    if (category === "client" || category === "client-work") return "client";
    return "";
}

function toOptionalNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function isPublicProjectUrl(value) {
    if (!value) return false;

    try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();
        const pathname = url.pathname.toLowerCase();

        if (!["http:", "https:"].includes(url.protocol)) return false;
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") return false;
        if (hostname.startsWith("192.168.") || hostname.startsWith("10.")) return false;
        if (hostname.includes("admin") || pathname.includes("/admin")) return false;

        return true;
    } catch {
        return false;
    }
}

function getLiveProjectUrl(record, project) {
    const candidates = [record?.liveUrl, project.liveUrl, record?.href, project.href];
    return candidates.find(isPublicProjectUrl) || "";
}

function mergeProject(project, record, projectOrder = 0) {
    const imageUrl = getProjectImage(record);
    const category = normalizeCategory(record?.category) || project.category || "client";
    const recordHasHomeVisibility = typeof record?.showOnHome === "boolean";
    const recordHasServicesVisibility = typeof record?.showOnServices === "boolean";
    const homeOrder = toOptionalNumber(record?.homeOrder) ?? toOptionalNumber(project.homeOrder);
    const servicesOrder = toOptionalNumber(record?.servicesOrder) ?? toOptionalNumber(project.servicesOrder);
    const order = toOptionalNumber(record?.order) ?? toOptionalNumber(project.order) ?? projectOrder + 1;
    const liveUrl = getLiveProjectUrl(record, project);

    return {
        ...project,
        category,
        firestoreId: record?.id || null,
        name: record?.title || record?.name || project.name,
        industry: record?.industry || project.industry,
        summary: record?.summary || project.summary || missingProjectHistory,
        overview: record?.overview || project.overview || project.summary || "",
        challenge: record?.challenge || project.challenge || "",
        solution: record?.solution || project.solution || "",
        status: record?.status || project.status || "",
        badges: getRecordBadges(record).length ? getRecordBadges(record) : project.badges || [],
        liveUrl,
        liveHref: liveUrl,
        order,
        projectOrder,
        showOnHome: recordHasHomeVisibility ? record.showOnHome : Boolean(project.showOnHome),
        homeOrder,
        homeVisibilityConfigured: recordHasHomeVisibility,
        showOnServices: recordHasServicesVisibility ? record.showOnServices : Boolean(project.showOnServices),
        servicesOrder,
        servicesVisibilityConfigured: recordHasServicesVisibility,
        imageUrl,
        imageFocus: record?.imageFocus || project.imageFocus || "50% 25%",
        imageAlt: `${record?.title || project.name} project preview`,
        imageMatched: Boolean(imageUrl),
    };
}

function recordToProject(record, projectOrder = 0) {
    const title = record?.title || record?.name || "Untitled Project";
    const slug = record?.slug || slugify(title || record?.id || "project");

    return mergeProject(
        {
            slug,
            category: normalizeCategory(record?.category) || "client",
            name: title,
            industry: record?.industry || "Project",
            summary: record?.summary || missingProjectHistory,
            overview: "",
            challenge: "",
            solution: "",
            status: "",
            badges: [],
        },
        record,
        projectOrder
    );
}

function findMatchingRecord(project, records) {
    const projectKeys = getProjectKeys(project);

    return records.find((record) => {
        const recordKeys = getFirestoreKeys(record);
        return [...recordKeys].some((recordKey) =>
            [...projectKeys].some((projectKey) => {
                if (recordKey === projectKey) return true;
                if (projectKey.length >= 5 && recordKey.includes(projectKey)) return true;
                if (recordKey.length >= 5 && projectKey.includes(recordKey)) return true;
                return false;
            })
        );
    });
}

export default function useEnrichedWorkProjects() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const primaryQuery = query(
            collection(publicDb, "projects"),
            where("published", "==", true),
            orderBy("order", "asc")
        );

        let unsubscribe = onSnapshot(
            primaryQuery,
            (snapshot) => {
                setRecords(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            },
            (err) => {
                const needsIndex =
                    err.code === "failed-precondition" || /index/i.test(err.message || "");

                if (!needsIndex) {
                    setError(err);
                    setLoading(false);
                    return;
                }

                const fallbackQuery = query(collection(publicDb, "projects"), orderBy("order", "asc"));
                unsubscribe = onSnapshot(
                    fallbackQuery,
                    (snapshot) => {
                        setRecords(
                            snapshot.docs
                                .map((doc) => ({ id: doc.id, ...doc.data() }))
                                .filter((project) => project.published === true)
                        );
                        setLoading(false);
                    },
                    (fallbackError) => {
                        setError(fallbackError);
                        setLoading(false);
                    }
                );
            }
        );

        return () => unsubscribe && unsubscribe();
    }, []);

    const projects = useMemo(
        () => {
            const matchedRecordIds = new Set();
            const staticProjects = workProjects.map((project, index) => {
                const record = findMatchingRecord(project, records);
                if (record?.id) matchedRecordIds.add(record.id);
                return mergeProject(project, record, index);
            });

            const firestoreOnlyProjects = records
                .filter((record) => !matchedRecordIds.has(record.id))
                .map((record, index) => recordToProject(record, workProjects.length + index));

            return [...staticProjects, ...firestoreOnlyProjects];
        },
        [records]
    );

    return {
        projects,
        loading,
        error,
        matchedSlugs: projects.filter((project) => project.imageMatched).map((project) => project.slug),
    };
}
