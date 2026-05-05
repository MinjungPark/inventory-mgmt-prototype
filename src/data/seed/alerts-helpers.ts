/**
 * @file src/data/seed/alerts-helpers.ts
 * @description 재고 알림 화면용 helper.
 */

import type { AlertSeverity, AlertStatus, ProductCategory, StockAlert } from "@/types/inventory";
import { STOCK_ALERTS } from "./alerts";
import { SEED_TODAY } from "./tracking";

// ─── KPI 집계 ──────────────────────────────────────────────────────────────

export function computeAlertsKpi(alerts: StockAlert[] = STOCK_ALERTS) {
    const counts = {
        new: 0,
        acknowledged: 0,
        resolved: 0,
        today: 0,
    };
    // SSR/CSR mismatch 방지 — 시드 모듈에 박힌 SEED_TODAY 사용
    const today = new Date(SEED_TODAY);
    today.setHours(0, 0, 0, 0);

    alerts.forEach((a) => {
        if (a.status === "new") counts.new++;
        else if (a.status === "acknowledged") counts.acknowledged++;
        else if (a.status === "resolved") counts.resolved++;

        const t = new Date(a.occurredAt);
        if (t >= today) counts.today++;
    });

    return counts;
}

// ─── 30일 발생 추이 ───────────────────────────────────────────────────────

export interface AlertDailyPoint {
    day: string;       // "MM/DD"
    isoDate: string;
    critical: number;
    warning: number;
}

/**
 * 30일치 알림 발생 추이.
 * 시드 알림이 23~30건 정도라 일별 분포가 희박하므로,
 * 시드 + 30일 backfill (랜덤 생성) 조합으로 자연스러운 추이 생성.
 */
export function buildAlertTrend(): AlertDailyPoint[] {
    const map = new Map<string, AlertDailyPoint>();
    // SSR/CSR mismatch 방지 — 시드 모듈에 박힌 SEED_TODAY 사용
    const today = new Date(SEED_TODAY);
    today.setHours(0, 0, 0, 0);

    // 시드: 30일 backfill (결정론적)
    let seed = 17;
    function det(): number {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const d = new Date(today);
        d.setDate(today.getDate() - dayOffset);
        const day = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
        const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        // 자연스러운 노이즈: 평일 1-3건, 주말 2-5건
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const critical = Math.floor(det() * (isWeekend ? 3 : 2));
        const warning = (isWeekend ? 2 : 1) + Math.floor(det() * 4);
        map.set(isoDate, { day, isoDate, critical, warning });
    }

    return Array.from(map.values()).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

// ─── 라벨 ───────────────────────────────────────────────────────────────────

export const SEVERITY_LABEL: Record<AlertSeverity, string> = {
    critical: "긴급",
    warning: "주의",
    ok: "정상",
};

export const STATUS_LABEL: Record<AlertStatus, string> = {
    new: "신규",
    acknowledged: "확인됨",
    resolved: "해결됨",
};

// ─── 필터링 ────────────────────────────────────────────────────────────────

export interface AlertFilters {
    storeSectionId?: string;          // ALL or sectionId
    category?: ProductCategory | "ALL";
    severity?: AlertSeverity | "ALL";
    status?: AlertStatus | "ALL";
    search?: string;
}

export function filterAlerts(
    alerts: StockAlert[],
    filters: AlertFilters,
): StockAlert[] {
    const q = filters.search?.trim().toLowerCase() ?? "";
    return alerts.filter((a) => {
        if (filters.storeSectionId && filters.storeSectionId !== "ALL" && a.storeSectionId !== filters.storeSectionId) return false;
        if (filters.category && filters.category !== "ALL" && a.category !== filters.category) return false;
        if (filters.severity && filters.severity !== "ALL" && a.severity !== filters.severity) return false;
        if (filters.status && filters.status !== "ALL" && a.status !== filters.status) return false;
        if (q) {
            const hit =
                a.skuId.toLowerCase().includes(q) ||
                a.skuName.toLowerCase().includes(q);
            if (!hit) return false;
        }
        return true;
    });
}
