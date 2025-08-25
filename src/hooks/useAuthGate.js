// src/hooks/useAuthGate.js
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

// Read allowed admin UIDs from .env (comma-separated) or fall back to hardcoded list
const ENV_UIDS = (import.meta.env.VITE_ADMIN_UIDS || "").split(",").map(s => s.trim()).filter(Boolean);
const FALLBACK_UIDS = ["7u3Uund1CKRrtf4Pw0ehaLCI7WR2"];

export default function useAuthGate() {
    const ADMIN_UIDS = useMemo(() => (ENV_UIDS.length ? ENV_UIDS : FALLBACK_UIDS), []);
    const [state, setState] = useState({ loading: true, ok: false, user: null });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            const ok = !!u && ADMIN_UIDS.includes(u.uid);
            setState({ loading: false, ok, user: u || null });
        });
        return unsub;
    }, [ADMIN_UIDS]);

    return state; // { loading, ok, user }
}
