/**
 * @file src/data/seed/skus.ts
 * @description SKU 카탈로그 시드 — 카테고리별 30~50개 (v3 5-3)
 *              컬러·사이즈 변형은 함수형 generator로 확장.
 */

import type { ProductCategory, Sku, StoreSectionId, WarehouseId } from "@/types/inventory";

// ─── 카테고리별 베이스 품목 ─────────────────────────────────────────────────

const BASE_ITEMS: Record<ProductCategory, string[]> = {
    의류: [
        "트렌치 코트", "봄 자켓", "데님 자켓", "셔츠", "블라우스",
        "니트 풀오버", "데님 팬츠", "슬랙스", "원피스", "스커트",
        "카디건", "후드 집업", "맨투맨", "베스트", "코트",
    ],
    신발: [
        "스니커즈", "로퍼", "첼시 부츠", "펌프스", "샌들",
        "옥스포드", "슬립온", "스포츠 슈즈", "앵클 부츠", "모카신",
    ],
    잡화: [
        "토트백", "크로스백", "백팩", "클러치", "지갑",
        "벨트", "스카프", "모자", "선글라스", "장갑",
        "양말", "타이", "패션 시계",
    ],
    화장품: [
        "수분 크림", "선크림", "토너", "에센스", "립스틱",
        "쿠션 파운데이션", "마스카라", "아이섀도 팔레트", "아이라이너", "블러셔",
        "클렌징 폼", "마스크 시트", "향수", "바디 로션", "샴푸",
    ],
    라이프스타일: [
        "디퓨저", "캔들", "머그컵", "노트", "펜 세트",
        "데스크 매트", "포스터", "쿠션", "담요", "향초",
    ],
};

const COLORS = ["베이지", "블랙", "네이비", "화이트", "그레이"];
const SIZES_APPAREL = ["S", "M", "L"];
const SIZES_SHOES = ["240", "250", "260", "270"];

const CATEGORY_PREFIX: Record<ProductCategory, string> = {
    의류: "CL",
    신발: "SH",
    잡화: "AC",
    화장품: "CO",
    라이프스타일: "LS",
};

// ─── SKU Generator ──────────────────────────────────────────────────────────

function priceFor(category: ProductCategory): number {
    const ranges: Record<ProductCategory, [number, number]> = {
        의류:        [ 38_000,  280_000],
        신발:        [ 49_000,  220_000],
        잡화:        [ 18_000,  150_000],
        화장품:      [ 12_000,   85_000],
        라이프스타일: [  8_000,   65_000],
    };
    const [min, max] = ranges[category];
    return Math.round((min + Math.random() * (max - min)) / 1000) * 1000;
}

function variantFor(category: ProductCategory, base: string): string {
    if (category === "의류") {
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];
        const s = SIZES_APPAREL[Math.floor(Math.random() * SIZES_APPAREL.length)];
        return `${base} - ${c} - ${s}`;
    }
    if (category === "신발") {
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];
        const s = SIZES_SHOES[Math.floor(Math.random() * SIZES_SHOES.length)];
        return `${base} - ${c} - ${s}mm`;
    }
    if (category === "잡화") {
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];
        return `${base} - ${c}`;
    }
    return base;
}

const SECTION_BY_CATEGORY: Record<ProductCategory, StoreSectionId> = {
    의류: "1F-A",
    신발: "1F-B",
    잡화: "2F-A",
    화장품: "2F-B",
    라이프스타일: "3F-A",
};

function pickWarehouse(idx: number): WarehouseId {
    // 비율 — WH-1: 60%, WH-3: 30%, WH-2: 10%
    const r = idx % 10;
    if (r < 6) return "WH-1";
    if (r < 9) return "WH-3";
    return "WH-2";
}

// 결정론적 슈도 랜덤 — 빌드마다 동일 결과 보장
let seedCursor = 1;
function det(): number {
    seedCursor = (seedCursor * 9301 + 49297) % 233280;
    return seedCursor / 233280;
}

function generateSkusForCategory(category: ProductCategory, count: number): Sku[] {
    const bases = BASE_ITEMS[category];
    const prefix = CATEGORY_PREFIX[category];
    const result: Sku[] = [];

    for (let i = 0; i < count; i++) {
        const base = bases[i % bases.length];
        const id = `SKU-${prefix}-${String(i + 1).padStart(4, "0")}`;
        const name = variantFor(category, base);
        const unitPriceKRW = priceFor(category);
        const threshold = 5 + Math.floor(det() * 15);
        const storeQuantity = Math.floor(det() * 40);
        const warehouseQuantity = 20 + Math.floor(det() * 200);
        // 회전율 0.2 ~ 9.8 — TOP 10 차이가 시각적으로 드러나면서 시작과 끝(0)이 보이도록.
        // 일부 카테고리(화장품)에 가중치 부여해 현실 패턴 반영.
        const baseTurnover = 0.2 + det() * 9.6;
        const categoryBoost =
            category === "화장품" ? 1.15 : category === "의류" ? 1.05 : 1.0;
        const turnoverRate = +Math.min(9.99, baseTurnover * categoryBoost).toFixed(2);

        const lastRestockedAt = new Date(
            Date.now() - Math.floor(det() * 30) * 24 * 60 * 60 * 1000,
        ).toISOString();

        result.push({
            id,
            name,
            category,
            storeSectionId: SECTION_BY_CATEGORY[category],
            warehouseId: pickWarehouse(i),
            storeQuantity,
            warehouseQuantity,
            unitPriceKRW,
            threshold,
            lastRestockedAt,
            turnoverRate,
        });
    }

    return result;
}

// ─── Aggregate ──────────────────────────────────────────────────────────────

export const SKUS: Sku[] = [
    ...generateSkusForCategory("의류", 50),
    ...generateSkusForCategory("신발", 35),
    ...generateSkusForCategory("잡화", 40),
    ...generateSkusForCategory("화장품", 50),
    ...generateSkusForCategory("라이프스타일", 30),
];

export const SKU_BY_ID: Record<string, Sku> = SKUS.reduce(
    (acc, s) => ({ ...acc, [s.id]: s }),
    {},
);

export const TOTAL_SKU_COUNT_DISPLAY = 4_820; // KPI 표시용 (v3 명세 일치)
