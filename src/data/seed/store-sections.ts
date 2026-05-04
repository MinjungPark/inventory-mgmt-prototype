/**
 * @file src/data/seed/store-sections.ts
 * @description 매장 섹션 시드 — 7섹션 / 약 1,800 SKU (매장 노출 분).
 *              기존 5섹션(작업지시서 v3 5-1)에서 언더웨어(1F-C) + 주얼리(2F-C) 확장.
 */

import type { StoreSection } from "@/types/inventory";

export const STORE_SECTIONS: StoreSection[] = [
    {
        id: "1F-A",
        floor: "1F",
        category: "의류",
        name: "1F-A 의류",
        skuCount: 380,
        totalQuantity: 4280,
        totalValueKRW: 312_400_000,
        zones: [
            { id: "A", name: "A존", skuCount: 142, quantity: 1620, valueKRW: 118_500_000 },
            { id: "B", name: "B존", skuCount: 128, quantity: 1480, valueKRW: 106_200_000 },
            { id: "C", name: "C존", skuCount: 110, quantity: 1180, valueKRW:  87_700_000 },
        ],
    },
    {
        id: "1F-B",
        floor: "1F",
        category: "신발",
        name: "1F-B 신발",
        skuCount: 220,
        totalQuantity: 1960,
        totalValueKRW: 184_700_000,
        zones: [
            { id: "A", name: "A존", skuCount: 120, quantity: 1080, valueKRW: 102_300_000 },
            { id: "B", name: "B존", skuCount: 100, quantity:  880, valueKRW:  82_400_000 },
        ],
    },
    {
        id: "1F-C",
        floor: "1F",
        category: "언더웨어",
        name: "1F-C 언더웨어",
        skuCount: 160,
        totalQuantity: 2240,
        totalValueKRW: 64_800_000,
        zones: [
            { id: "A", name: "A존", skuCount:  88, quantity: 1240, valueKRW: 35_700_000 },
            { id: "B", name: "B존", skuCount:  72, quantity: 1000, valueKRW: 29_100_000 },
        ],
    },
    {
        id: "2F-A",
        floor: "2F",
        category: "잡화",
        name: "2F-A 잡화",
        skuCount: 290,
        totalQuantity: 3120,
        totalValueKRW: 156_800_000,
        zones: [
            { id: "A", name: "A존", skuCount: 110, quantity: 1180, valueKRW: 62_400_000 },
            { id: "B", name: "B존", skuCount:  98, quantity: 1060, valueKRW: 53_300_000 },
            { id: "C", name: "C존", skuCount:  82, quantity:  880, valueKRW: 41_100_000 },
        ],
    },
    {
        id: "2F-B",
        floor: "2F",
        category: "화장품",
        name: "2F-B 화장품",
        skuCount: 450,
        totalQuantity: 5680,
        totalValueKRW: 248_900_000,
        zones: [
            { id: "A", name: "A존", skuCount: 240, quantity: 3020, valueKRW: 132_500_000 },
            { id: "B", name: "B존", skuCount: 210, quantity: 2660, valueKRW: 116_400_000 },
        ],
    },
    {
        id: "2F-C",
        floor: "2F",
        category: "주얼리",
        name: "2F-C 주얼리",
        skuCount: 120,
        totalQuantity: 540,
        totalValueKRW: 184_300_000,
        zones: [
            { id: "A", name: "A존", skuCount:  68, quantity: 310, valueKRW: 104_500_000 },
            { id: "B", name: "B존", skuCount:  52, quantity: 230, valueKRW:  79_800_000 },
        ],
    },
    {
        id: "3F-A",
        floor: "3F",
        category: "라이프스타일",
        name: "3F-A 라이프스타일",
        skuCount: 180,
        totalQuantity: 1420,
        totalValueKRW:  78_300_000,
        zones: [
            { id: "A", name: "A존", skuCount:  98, quantity:  780, valueKRW: 43_200_000 },
            { id: "B", name: "B존", skuCount:  82, quantity:  640, valueKRW: 35_100_000 },
        ],
    },
];

export const TOTAL_STORE_SKU = STORE_SECTIONS.reduce((acc, s) => acc + s.skuCount, 0);
export const TOTAL_STORE_VALUE = STORE_SECTIONS.reduce(
    (acc, s) => acc + s.totalValueKRW,
    0,
);
