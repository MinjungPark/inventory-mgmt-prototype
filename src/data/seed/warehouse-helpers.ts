/**
 * @file src/data/seed/warehouse-helpers.ts
 * @description 창고 재고 화면용 helper.
 *              SKU의 warehouseId를 기반으로 창고별·카테고리별 분포 계산.
 */

import type { ProductCategory, Sku, Warehouse, WarehouseId } from "@/types/inventory";
import { WAREHOUSES } from "./warehouses";

export interface CategoryAggregate {
    category: ProductCategory;
    skuCount: number;
    quantity: number;
    valueKRW: number;
}

/**
 * 창고에 속한 SKU 리스트 (warehouseId 기준).
 * 시드 SKU는 약 230개로 적으므로 창고별 보유 SKU 수치를
 * Warehouse.skuCount(시드 표 기준 4820 / 1250 / 3400)로 사용하고,
 * 본 함수는 SKU 카탈로그 내 매핑된 항목만 반환 (드릴다운·테이블용).
 */
export function getSkusByWarehouse(skus: Sku[], warehouseId: WarehouseId): Sku[] {
    return skus.filter((s) => s.warehouseId === warehouseId);
}

/**
 * 창고 내 카테고리별 집계.
 */
export function getCategoryAggregateByWarehouse(
    skus: Sku[],
    warehouseId: WarehouseId,
): CategoryAggregate[] {
    const map = new Map<ProductCategory, CategoryAggregate>();
    skus
        .filter((s) => s.warehouseId === warehouseId)
        .forEach((s) => {
            const acc = map.get(s.category) ?? {
                category: s.category,
                skuCount: 0,
                quantity: 0,
                valueKRW: 0,
            };
            acc.skuCount += 1;
            acc.quantity += s.warehouseQuantity;
            acc.valueKRW += s.warehouseQuantity * s.unitPriceKRW;
            map.set(s.category, acc);
        });
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
}

/**
 * 전체 창고 합산 가치 (KRW).
 */
export const TOTAL_WAREHOUSE_VALUE_AGG = WAREHOUSES.reduce(
    (sum, w) => sum + w.totalValueKRW,
    0,
);

/**
 * 평균 가동률.
 */
export const AVG_UTILIZATION =
    WAREHOUSES.reduce((sum, w) => sum + w.utilizationPct, 0) / WAREHOUSES.length;

/**
 * 외부 위탁 비중 (재고 가치 기준 %).
 */
export const EXTERNAL_VENDOR_RATIO = (() => {
    const wh3 = WAREHOUSES.find((w) => w.id === "WH-3");
    if (!wh3) return 0;
    return (wh3.totalValueKRW / TOTAL_WAREHOUSE_VALUE_AGG) * 100;
})();

/**
 * 가동률 색상 분류.
 */
export function utilizationSeverity(pct: number): "ok" | "warning" | "critical" {
    if (pct >= 85) return "critical";  // 거의 만재 — 신규 입고 어려움
    if (pct >= 70) return "warning";   // 주의 — 곧 만재
    return "ok";                        // 여유
}

/**
 * 창고 ID로 창고 정보 조회.
 */
export function findWarehouse(id: WarehouseId): Warehouse | undefined {
    return WAREHOUSES.find((w) => w.id === id);
}
