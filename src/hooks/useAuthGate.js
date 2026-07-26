// src/hooks/useAuthGate.js
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { isAuthorizedAdminUser } from "../lib/adminAccess";

export default function useAuthGate() {
    const [state, setState] = useState({ loading: true, ok: false, user: null });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            const ok = isAuthorizedAdminUser(u);
            setState({ loading: false, ok, user: u || null });
        });
        return unsub;
    }, []);

    return state; // { loading, ok, user }
}
