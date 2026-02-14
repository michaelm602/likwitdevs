import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";

const OWNER_UID =
    import.meta.env.VITE_OWNER_UID || "7u3Uund1CKRrtf4Pw0ehaLCI7WR2";

export default function RequireAdmin({ children }) {
    const [checking, setChecking] = useState(true);
    const [ok, setOk] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setOk(!!u && u.uid === OWNER_UID);
            setChecking(false);
        });
        return unsub;
    }, []);

    if (checking)
        return <div className="px-4 py-10 text-white/70">Checking access…</div>;

    if (!ok) return <Navigate to="/admin/login" replace state={{ from: location }} />;

    return children;
}
