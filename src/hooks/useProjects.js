import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

export default function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // primary query: needs composite index (published + order)
        const q = query(
            collection(db, "projects"),
            where("published", "==", true),
            orderBy("order", "asc")
        );

        // subscribe, with fallback if index is missing
        let unsubscribe = onSnapshot(
            q,
            snap => {
                setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            },
            err => {
                const needsIndex =
                    err.code === "failed-precondition" ||
                    /index/i.test(err.message || "");

                if (!needsIndex) {
                    setError(err);
                    setLoading(false);
                    return;
                }

                // Fallback: no where-clause (no composite index required)
                const q2 = query(collection(db, "projects"), orderBy("order", "asc"));
                unsubscribe = onSnapshot(
                    q2,
                    snap => {
                        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                            .filter(p => p.published === true);
                        setProjects(items);
                        setLoading(false);
                    },
                    e2 => { setError(e2); setLoading(false); }
                );
            }
        );

        return () => unsubscribe && unsubscribe();
    }, []);

    return { projects, loading, error };
}
