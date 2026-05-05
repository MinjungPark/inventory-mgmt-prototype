/**
 * @file src/data/seed/index.ts
 * @description 시드 데이터 진입점 — 전 화면 공용 import 포인트
 */

export * from "./store-sections";
export * from "./warehouses";
export * from "./skus";
export * from "./tracking";
export * from "./alerts";
export * from "./users";
export * from "./api-keys";
export * from "./external-systems";

// ─── KPI 통합 (대시보드용) ──────────────────────────────────────────────────

import { TOTAL_STORE_VALUE } from "./store-sections";
import { TOTAL_WAREHOUSE_VALUE } from "./warehouses";
import { TOTAL_SKU_COUNT_DISPLAY } from "./skus";
import { TRACKING_TODAY_COUNT } from "./tracking";
import { ALERT_TOTAL } from "./alerts";

export const DASHBOARD_KPI = {
    totalSku: TOTAL_SKU_COUNT_DISPLAY,
    storeValueKRW: TOTAL_STORE_VALUE,
    warehouseValueKRW: TOTAL_WAREHOUSE_VALUE,
    alertCount: ALERT_TOTAL,
    todayTrackingCount: TRACKING_TODAY_COUNT,
};
