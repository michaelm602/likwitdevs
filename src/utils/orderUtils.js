// src/utils/orderUtils.js

export function normalizeOrders(projects) {
    const sorted = [...projects].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
    return sorted.map((p, idx) => ({ ...p, order: idx + 1 }));
}

export function applyOrderChange(projects, changedId, newOrderRaw) {
    const max = projects.length;
    let newOrder = Number(newOrderRaw);

    if (!Number.isFinite(newOrder)) newOrder = max;
    newOrder = Math.max(1, Math.min(max, newOrder));

    const sorted = [...projects].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
    const moving = sorted.find((p) => p.id === changedId);
    if (!moving) return sorted.map((p, idx) => ({ ...p, order: idx + 1 }));

    const others = sorted.filter((p) => p.id !== changedId);
    others.splice(newOrder - 1, 0, moving);

    return others.map((p, idx) => ({ ...p, order: idx + 1 }));
}
