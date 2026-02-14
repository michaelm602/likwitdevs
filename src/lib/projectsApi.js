import { db } from "./firebase";
import {
    collection,
    doc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";

export async function updateProject(projectId, patch) {
    const ref = doc(db, "projects", projectId);
    await updateDoc(ref, patch);
}

export async function batchUpdateProjectOrders(orderPairs) {
    // orderPairs: [{ id, order }, ...]
    const batch = writeBatch(db);
    const col = collection(db, "projects");

    orderPairs.forEach(({ id, order }) => {
        batch.update(doc(col, id), { order });
    });

    await batch.commit();
}
