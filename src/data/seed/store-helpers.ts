/**
 * @file src/data/seed/store-helpers.ts
 * @description 매장 재고 화면용 helper — SKU의 매장 섹션 존(Zone) 매핑.
 *              시드 SKU는 결정론적으로 생성되므로 id 끝번호로 안정 매핑.
 */

import type { Sku, StoreSection } from "@/types/inventory";
import { STORE_SECTIONS } from "./store-sections";

/**
 * SKU의 id 끝번호를 기반으로 존 식별자(A/B/C 등)를 결정론적으로 매핑.
 *  - 같은 SKU는 항상 같은 존에 배치됨 (안정적)
 *  - 섹션이 가진 존 개수에 맞게 modulo 배분
 */
export function getZoneIdForSku(sku: Sku, section: StoreSection): string {
    if (!section.zones.length) return "A";
    const tail = parseInt(sku.id.slice(-4), 10);
    const idx = (isNaN(tail) ? 0 : tail) % section.zones.length;
    return section.zones[idx].id;
}

/**
 * 매장 섹션별 SKU 리스트 (storeSectionId 기준).
 */
export function getSkusBySection(skus: Sku[], sectionId: string): Sku[] {
    return skus.filter((s) => s.storeSectionId === sectionId);
}

/**
 * 섹션 + 존 조합의 SKU 리스트.
 */
export function getSkusBySectionAndZone(
    skus: Sku[],
    sectionId: string,
    zoneId: string,
): Sku[] {
    const section = STORE_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return [];
    return skus
        .filter((s) => s.storeSectionId === sectionId)
        .filter((s) => getZoneIdForSku(s, section) === zoneId);
}

/**
 * SKU의 매장 재고 수준 분류.
 *  - 부족: storeQuantity ≤ threshold * 0.3
 *  - 주의: storeQuantity ≤ threshold * 0.7
 *  - 충분: 그 외
 */
export type StockStatus = "shortage" | "warning" | "sufficient";

export function getStockStatus(sku: Sku): StockStatus {
    const ratio = sku.threshold > 0 ? sku.storeQuantity / sku.threshold : 1;
    if (ratio <= 0.3) return "shortage";
    if (ratio <= 0.7) return "warning";
    return "sufficient";
}
