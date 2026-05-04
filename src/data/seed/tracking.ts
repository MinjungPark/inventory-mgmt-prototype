/**
 * @file src/data/seed/tracking.ts
 * @description 입출고 트래킹 시드 — 30일치 약 4,800건 (v3 5-4)
 *              - 평일 평균 150건, 주말 평균 200건
 *              - 카테고리 회전율 차이 (화장품 > 의류 > 라이프스타일)
 *              - 매장 → 창고 반품 5%
 */

import type { TrackingEvent, TrackingType, TrackingLocation, ProductCategory } from "@/types/inventory";
import { SKUS } from "./skus";

const OPERATORS = [
    "김민준", "이서윤", "박지호", "최예린", "정현우",
    "강도윤", "윤하은", "장시우", "임수아", "한도현",
];

const MEMOS: Record<TrackingType, string[]> = {
    inbound:  ["정기 입고", "긴급 입고", "재발주 도착", "신상 입고"],
    outbound: ["매장 보충", "프로모션 차감", "정기 출고"],
    transfer: ["섹션 간 재배치", "백창고 → 매장", "본사창고 → 백창고"],
    return:   ["불량 반품", "디스플레이 회수", "시즌 마감 반품"],
};

const CATEGORY_VOLUME_WEIGHT: Record<ProductCategory, number> = {
    화장품: 0.35,
    의류: 0.25,
    잡화: 0.18,
    신발: 0.14,
    라이프스타일: 0.08,
};

// 결정론적 슈도 랜덤 (빌드 안정)
let seed = 42;
function det(): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
}

function pickWeighted<T extends string>(weights: Record<T, number>): T {
    const r = det();
    let acc = 0;
    const keys = Object.keys(weights) as T[];
    for (const k of keys) {
        acc += weights[k];
        if (r <= acc) return k;
    }
    return keys[keys.length - 1];
}

function pickType(): TrackingType {
    const r = det();
    if (r < 0.05) return "return";       // 5%
    if (r < 0.20) return "transfer";     // 15%
    if (r < 0.55) return "inbound";      // 35%
    return "outbound";                   // 45%
}

function locationsFor(type: TrackingType): { from: TrackingLocation; to: TrackingLocation } {
    switch (type) {
        case "inbound":
            return { from: "VENDOR", to: "WH-1" };
        case "outbound": {
            const sections: TrackingLocation[] = ["1F-A", "1F-B", "2F-A", "2F-B", "3F-A"];
            return {
                from: det() < 0.7 ? "WH-1" : "WH-2",
                to: sections[Math.floor(det() * sections.length)],
            };
        }
        case "transfer":
            return { from: "WH-1", to: "WH-2" };
        case "return": {
            const sections: TrackingLocation[] = ["1F-A", "1F-B", "2F-A", "2F-B", "3F-A"];
            return {
                from: sections[Math.floor(det() * sections.length)],
                to: "WH-1",
            };
        }
    }
}

function generateTracking(): TrackingEvent[] {
    const events: TrackingEvent[] = [];
    const now = new Date();
    let runningId = 1;

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const day = new Date(now);
        day.setDate(now.getDate() - dayOffset);
        day.setHours(9, 0, 0, 0);

        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        const baseCount = isWeekend ? 200 : 150;
        const dailyCount = baseCount + Math.floor(det() * 30) - 15;

        for (let i = 0; i < dailyCount; i++) {
            const category = pickWeighted(CATEGORY_VOLUME_WEIGHT);
            const candidates = SKUS.filter((s) => s.category === category);
            const sku = candidates[Math.floor(det() * candidates.length)];
            const type = pickType();
            const { from, to } = locationsFor(type);
            const quantity = 1 + Math.floor(det() * 24);
            const operator = OPERATORS[Math.floor(det() * OPERATORS.length)];
            const memo = MEMOS[type][Math.floor(det() * MEMOS[type].length)];

            const ts = new Date(day);
            ts.setMinutes(Math.floor((i / dailyCount) * 11 * 60));
            ts.setSeconds(Math.floor(det() * 60));

            events.push({
                id: `TRK-${String(runningId++).padStart(6, "0")}`,
                timestamp: ts.toISOString(),
                skuId: sku.id,
                skuName: sku.name,
                category: sku.category,
                type,
                fromLocation: from,
                toLocation: to,
                quantity,
                operatorName: operator,
                memo,
            });
        }
    }

    return events.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export const TRACKING_EVENTS: TrackingEvent[] = generateTracking();

export const TRACKING_TODAY_COUNT = TRACKING_EVENTS.filter((e) => {
    const d = new Date(e.timestamp);
    const today = new Date();
    return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
    );
}).length;
