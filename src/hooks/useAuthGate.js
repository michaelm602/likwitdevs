import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

// replace with your real UID
const ALLOWED = new Set(["7u3Uund1CKRrtf4Pw0ehaLCI7WR2"]);

export default function useAuthGate() {
    const [ok, setOk] = useState(null);
    useEffect(() => onAuthStateChanged(auth, (u) => {
        setOk(!!u && ALLOWED.has(u.uid));
    }), []);
    return ok;
}
