/**
 * @file src/types/inventory.ts
 * @description IOM 도메인 타입 정의 — 매장 섹션·창고·SKU·트래킹·알림
 */

// ─── 매장 섹션 ───────────────────────────────────────────────────────────────

export type StoreSectionId =
    | "1F-A"
    | "1F-B"
    | "1F-C"
    | "2F-A"
    | "2F-B"
    | "2F-C"
    | "3F-A";
export type StockLevel = "sufficient" | "warning" | "shortage";

export interface StoreZone {
    id: string;          // "A", "B", "C"
    name: string;        // "A존", "B존", "C존"
    skuCount: number;
    quantity: number;
    valueKRW: number;
}

export interface StoreSection {
    id: StoreSectionId;
    floor: string;
    category: ProductCategory;
    name: string;        // "1F-A 의류"
    zones: StoreZone[];
    skuCount: number;
    totalQuantity: number;
    totalValueKRW: number;
}

// ─── 창고 ────────────────────────────────────────────────────────────────────

export type WarehouseId = "WH-1" | "WH-2" | "WH-3";

export interface Warehouse {
    id: WarehouseId;
    name: string;
    location: string;
    skuCount: number;
    totalQuantity: number;
    totalValueKRW: number;
    utilizationPct: number;
}

// ─── SKU / 카테고리 ─────────────────────────────────────────────────────────

export type ProductCategory =
    | "의류"
    | "신발"
    | "언더웨어"
    | "잡화"
    | "화장품"
    | "주얼리"
    | "라이프스타일";

export interface Sku {
    id: string;          // "SKU-CL-0001"
    name: string;        // "트렌치 코트 - 베이지 - M"
    category: ProductCategory;
    storeSectionId?: StoreSectionId;
    warehouseId: WarehouseId;
    storeQuantity: number;
    warehouseQuantity: number;
    unitPriceKRW: number;
    threshold: number;
    lastRestockedAt: string; // ISO 8601
    turnoverRate: number;    // 월평균 회전율 (회/월) — 매출수량 ÷ 평균재고
}

// ─── 입출고 트래킹 ──────────────────────────────────────────────────────────

export type TrackingType = "inbound" | "outbound" | "transfer" | "return";
export type TrackingLocation = StoreSectionId | WarehouseId | "VENDOR" | "EXTERNAL";

export interface TrackingEvent {
    id: string;
    timestamp: string;   // ISO 8601
    skuId: string;
    skuName: string;
    category: ProductCategory;
    type: TrackingType;
    fromLocation: TrackingLocation;
    toLocation: TrackingLocation;
    quantity: number;
    operatorName: string;
    memo?: string;
}

// ─── 알림 ────────────────────────────────────────────────────────────────────

export type AlertSeverity = "critical" | "warning" | "ok";
export type AlertStatus = "new" | "acknowledged" | "resolved";

export interface StockAlert {
    id: string;
    occurredAt: string;
    skuId: string;
    skuName: string;
    category: ProductCategory;
    storeSectionId?: StoreSectionId;
    storeSectionName?: string;
    currentQuantity: number;
    thresholdQuantity: number;
    severity: AlertSeverity;
    status: AlertStatus;
}

// ─── 사용자 / 권한 ──────────────────────────────────────────────────────────

export type UserRole = "STORE_STAFF" | "HQ_MANAGER" | "SYSTEM_ADMIN";

export interface User {
    id: string;
    name: string;
    role: UserRole;
    roleLabelKr: string;
}
