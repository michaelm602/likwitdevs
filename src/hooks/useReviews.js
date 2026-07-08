import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { publicDb } from "../lib/firebasePublic";
import { sortReviews } from "../lib/reviews";

export default function useReviews({
    featuredOnly = false,
    showOnHomepage = false,
    showOnServices = false,
    associatedProjectIds = [],
    limitCount = 0,
} = {}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const reviewsQuery = query(collection(publicDb, "reviews"), orderBy("displayOrder", "asc"));
        const unsubscribe = onSnapshot(
            reviewsQuery,
            (snapshot) => {
                setRecords(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Reviews load failed", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const reviews = useMemo(() => {
        const projectIds = new Set(associatedProjectIds.filter(Boolean));
        const filtered = records
            .filter((review) => !featuredOnly || review.featured === true)
            .filter((review) => !showOnHomepage || review.showOnHomepage === true)
            .filter((review) => !showOnServices || review.showOnServices === true)
            .filter((review) => projectIds.size === 0 || projectIds.has(review.associatedProjectId));

        const sorted = [...filtered].sort(sortReviews);
        return limitCount > 0 ? sorted.slice(0, limitCount) : sorted;
    }, [associatedProjectIds, featuredOnly, limitCount, records, showOnHomepage, showOnServices]);

    return { reviews, loading, error };
}
