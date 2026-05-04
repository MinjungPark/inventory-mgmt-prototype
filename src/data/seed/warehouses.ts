/**
 * @file src/data/seed/warehouses.ts
 * @description 창고 시드 — v3 5-2 표 그대로 (3창고)
 */

import type { Warehouse } from "@/types/inventory";

export const WAREHOUSES: Warehouse[] = [
    {
        id: "WH-1",
        name: "본사 창고",
        location: "본사 지하",
        skuCount: 4820,
        totalQuantity: 38_400,
        totalValueKRW: 728_500_000,
        utilizationPct: 78,
    },
    {
        id: "WH-2",
        name: "매장 백창고",
        location: "매장 후방",
        skuCount: 1250,
        totalQuantity: 9_640,
        totalValueKRW: 184_300_000,
        utilizationPct: 65,
    },
    {
        id: "WH-3",
        name: "외부 위탁 창고",
        location: "외부 위탁 업체",
        skuCount: 3400,
        totalQuantity: 26_800,
        totalValueKRW: 337_200_000,
        utilizationPct: 88,
    },
];

export const TOTAL_WAREHOUSE_SKU = WAREHOUSES.reduce((acc, w) => acc + w.skuCount, 0);
export const TOTAL_WAREHOUSE_VALUE = WAREHOUSES.reduce(
    (acc, w) => acc + w.totalValueKRW,
    0,
);
