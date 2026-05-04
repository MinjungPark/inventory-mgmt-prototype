/**
 * @file src/data/seed/tracking-helpers.ts
 * @description 입출고 트래킹 화면용 helper.
 *              KPI 집계, 일별 추이, 매장↔창고 흐름량 계산.
 */

import type { TrackingEvent, TrackingLocation, TrackingType } from "@/types/inventory";
import { TRACKING_EVENTS } from "./tracking";

// ─── KPI ────────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function computeTrackingKpi() {
    const now = new Date();

    let todayInbound = 0;
    let todayOutbound = 0;
    let totalInbound30 = 0;
    let totalOutbound30 = 0;
    let weekInOut = 0;       // 7일 입+출고 합계 (평균 산출용)
    const weekDays = new Set<string>();

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    TRACKING_EVENTS.forEach((e) => {
        const t = new Date(e.timestamp);
        if (isSameDay(t, now)) {
            if (e.type === "inbound") todayInbound++;
            else if (e.type === "outbound") todayOutbound++;
        }
        if (e.type === "inbound") totalInbound30++;
        if (e.type === "outbound") totalOutbound30++;
        if (t >= sevenDaysAgo) {
            if (e.type === "inbound" || e.type === "outbound") {
                weekInOut++;
                weekDays.add(`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`);
            }
        }
    });

    const weekAvg = weekDays.size > 0 ? Math.round(weekInOut / weekDays.size) : 0;
    const total30 = totalInbound30 + totalOutbound30;

    return {
        todayInbound,
        todayOutbound,
        weekAvg,
        total30,
    };
}

// ─── 일별 추이 ──────────────────────────────────────────────────────────────

export interface DailyTrendPoint {
    day: string;       // "MM/DD"
    isoDate: string;   // sort용
    inbound: number;
    outbound: number;
}

export function buildDailyTrend(events: TrackingEvent[] = TRACKING_EVENTS): DailyTrendPoint[] {
    const map = new Map<string, DailyTrendPoint>();
    events.forEach((e) => {
        const d = new Date(e.timestamp);
        const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const day = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
        if (!map.has(isoDate)) {
            map.set(isoDate, { day, isoDate, inbound: 0, outbound: 0 });
        }
        const p = map.get(isoDate)!;
        if (e.type === "inbound") p.inbound += 1;
        else if (e.type === "outbound") p.outbound += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

// ─── 매장 ↔ 창고 흐름 (Sankey 데이터) ──────────────────────────────────────

export interface FlowLink {
    source: TrackingLocation;
    target: TrackingLocation;
    value: number;       // 총 수량 합계
    type: TrackingType;
}

export function buildFlowLinks(events: TrackingEvent[] = TRACKING_EVENTS): FlowLink[] {
    const key = (s: TrackingLocation, t: TrackingLocation, type: TrackingType) =>
        `${s}|${t}|${type}`;
    const map = new Map<string, FlowLink>();
    events.forEach((e) => {
        const k = key(e.fromLocation, e.toLocation, e.type);
        if (!map.has(k)) {
            map.set(k, {
                source: e.fromLocation,
                target: e.toLocation,
                value: 0,
                type: e.type,
            });
        }
        map.get(k)!.value += e.quantity;
    });
    return Array.from(map.values());
}

// ─── 위치 라벨 ──────────────────────────────────────────────────────────────

export const LOCATION_LABEL: Record<TrackingLocation, string> = {
    "1F-A": "1F-A 의류",
    "1F-B": "1F-B 신발",
    "1F-C": "1F-C 언더웨어",
    "2F-A": "2F-A 잡화",
    "2F-B": "2F-B 화장품",
    "2F-C": "2F-C 주얼리",
    "3F-A": "3F-A 라이프스타일",
    "WH-1": "본사 창고",
    "WH-2": "매장 백창고",
    "WH-3": "외부 위탁 창고",
    VENDOR: "공급사",
    EXTERNAL: "외부",
};

export function labelForLocation(loc: TrackingLocation): string {
    return LOCATION_LABEL[loc] ?? loc;
}

// ─── 유형 라벨 + 색상 ──────────────────────────────────────────────────────

export const TYPE_LABEL: Record<TrackingType, string> = {
    inbound: "입고",
    outbound: "출고",
    transfer: "이동",
    return: "반품",
};

export const TYPE_COLOR: Record<TrackingType, string> = {
    inbound: "#0d47a1",
    outbound: "#42a5f5",
    transfer: "#90caf9",
    return: "#c2410c",
};
