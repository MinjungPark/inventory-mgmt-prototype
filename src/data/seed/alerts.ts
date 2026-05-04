/**
 * @file src/data/seed/alerts.ts
 * @description 안전 재고 알림 시드 — 총 23건 (v3 5-5)
 *              - 적색(긴급): 5건  (current ≤ threshold * 0.30)
 *              - 황색(주의): 12건 (current ≤ threshold * 0.70)
 *              - 처리 중(확인됨): 6건
 */

import type { StockAlert, AlertSeverity, AlertStatus } from "@/types/inventory";
import { SKUS } from "./skus";
import { STORE_SECTIONS } from "./store-sections";

const SECTION_BY_CATEGORY = STORE_SECTIONS.reduce<Record<string, { id: string; name: string }>>(
    (acc, s) => ({ ...acc, [s.category]: { id: s.id, name: s.name } }),
    {},
);

interface AlertSpec {
    severity: AlertSeverity;
    status: AlertStatus;
    count: number;
    ratioMin: number;
    ratioMax: number;
}

const SPECS: AlertSpec[] = [
    { severity: "critical", status: "new",          count: 7,  ratioMin: 0.03, ratioMax: 0.28 },
    { severity: "warning",  status: "new",          count: 16, ratioMin: 0.32, ratioMax: 0.68 },
    { severity: "warning",  status: "acknowledged", count: 7,  ratioMin: 0.40, ratioMax: 0.65 },
];

function generate(): StockAlert[] {
    const alerts: StockAlert[] = [];
    let runningId = 1;
    let cursor = 0;

    for (const spec of SPECS) {
        for (let i = 0; i < spec.count; i++) {
            const sku = SKUS[(cursor * 13 + i * 7) % SKUS.length];
            cursor++;

            const threshold = sku.threshold;
            const ratio = spec.ratioMin + ((i / Math.max(spec.count - 1, 1)) * (spec.ratioMax - spec.ratioMin));
            const currentQuantity = Math.max(0, Math.floor(threshold * ratio));

            const section = SECTION_BY_CATEGORY[sku.category];
            const occurredAt = new Date(
                Date.now() - (i * 4 + 1) * 60 * 60 * 1000,
            ).toISOString();

            alerts.push({
                id: `ALT-${String(runningId++).padStart(4, "0")}`,
                occurredAt,
                skuId: sku.id,
                skuName: sku.name,
                category: sku.category,
                storeSectionId: section?.id as never,
                storeSectionName: section?.name,
                currentQuantity,
                thresholdQuantity: threshold,
                severity: spec.severity,
                status: spec.status,
            });
        }
    }

    return alerts.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));
}

export const STOCK_ALERTS: StockAlert[] = generate();

export const ALERT_KPI = {
    new: STOCK_ALERTS.filter((a) => a.status === "new").length,
    acknowledged: STOCK_ALERTS.filter((a) => a.status === "acknowledged").length,
    resolved: 0,
    todayCount: STOCK_ALERTS.length,
    critical: STOCK_ALERTS.filter((a) => a.severity === "critical").length,
    warning: STOCK_ALERTS.filter((a) => a.severity === "warning").length,
};

export const ALERT_TOTAL = STOCK_ALERTS.length; // 23
