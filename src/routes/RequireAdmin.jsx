import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";

const ADMIN_UIDS = (import.meta.env.VITE_ADMIN_UIDS || "7u3Uund1CKRrtf4Pw0ehaLCI7WR2")
    .split(",").map(s => s.trim()).filter(Boolean);

export default function RequireAdmin({ children }) {
    const [checking, setChecking] = useState(true);
    const [ok, setOk] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setOk(!!u && ADMIN_UIDS.includes(u.uid));
            setChecking(false);
        });
        return unsub;
    }, []);

    if (checking)
        return <div className="px-4 py-10 text-white/70">Checking access…</div>;

    if (!ok) return <Navigate to="/admin/login" replace state={{ from: location }} />;

    return children;
}
