/**
 * @file src/app/(prototype)/api-sync/components/SyncHistorySection.tsx
 * @description 동기화 이력 섹션 — 필터바 + 시각 피드백 배너 + 테이블 묶음.
 *
 *  필터 5종:
 *   - 기간 (빠른 선택): 오늘 / 24시간 / 7일 / 전체
 *   - 기간 직접 지정: from~to (활성 시 빠른 선택은 비활성)
 *   - 동기화 유형: 6 옵션 (전체 + 5종 예시 — 본사 협의)
 *   - 결과: 전체 / 성공 / 부분 / 실패 (칩 토글)
 *   - 검색: 사유 + 실패 SKU ID 부분 일치
 *
 *  상호작용 (마지막 조작 우선):
 *   - 빠른 선택 탭 클릭 → from~to 자동 비움
 *   - from 또는 to 입력 → 빠른 선택 탭 모두 비활성으로 표시
 */

"use client";

import { useMemo, useState } from "react";
import { History, CalendarRange } from "lucide-react";

import {
    SYNC_HISTORY,
    type SyncLog,
    type SyncResult,
    type SyncType,
} from "@/data/seed/api-sync-seed";

import SyncHistoryFilterBar, { type SyncPeriodKey } from "./SyncHistoryFilterBar";
import SyncHistoryTable from "./SyncHistoryTable";

const PERIOD_LABEL: Record<SyncPeriodKey, string> = {
    today: "오늘",
    "24h": "24시간",
    "7d": "7일",
    all: "전체 (7일)",
};

function periodCutoff(period: SyncPeriodKey): number {
    const now = Date.now();
    if (period === "today") {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }
    if (period === "24h") return now - 24 * 60 * 60 * 1000;
    if (period === "7d") return now - 7 * 24 * 60 * 60 * 1000;
    return 0; // all
}

/** YYYY-MM-DD 문자열을 그날 00:00 timestamp로 (로컬 타임존) */
function dateStrToStartMs(s: string): number | null {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
    return dt.getTime();
}

/** YYYY-MM-DD 문자열을 그날 23:59:59 timestamp로 (로컬 타임존, inclusive) */
function dateStrToEndMs(s: string): number | null {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d, 23, 59, 59, 999);
    return dt.getTime();
}

function diffDays(fromMs: number, toMs: number): number {
    return Math.max(1, Math.round((toMs - fromMs) / (24 * 60 * 60 * 1000)));
}

export default function SyncHistorySection() {
    const [period, setPeriod] = useState<SyncPeriodKey>("24h");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [typeFilter, setTypeFilter] = useState<SyncType | "ALL">("ALL");
    const [result, setResult] = useState<SyncResult | "ALL">("ALL");
    const [search, setSearch] = useState("");

    // from 또는 to가 채워지면 custom 모드 — 빠른 선택 탭은 비활성으로 표시
    const isCustom = dateFrom !== "" || dateTo !== "";

    function handlePeriodChange(v: SyncPeriodKey) {
        // 빠른 선택 누르면 from~to 자동 비움 (마지막 조작 우선)
        setDateFrom("");
        setDateTo("");
        setPeriod(v);
    }

    const filtered: SyncLog[] = useMemo(() => {
        const q = search.trim().toLowerCase();

        // 시간 범위 결정 — custom 우선
        let fromMs: number;
        let toMs: number = Number.POSITIVE_INFINITY;
        if (isCustom) {
            fromMs = dateStrToStartMs(dateFrom) ?? 0;
            toMs = dateStrToEndMs(dateTo) ?? Number.POSITIVE_INFINITY;
        } else {
            fromMs = periodCutoff(period);
        }

        return SYNC_HISTORY.filter((l) => {
            const t = new Date(l.timestamp).getTime();
            return t >= fromMs && t <= toMs;
        })
            .filter((l) => typeFilter === "ALL" || l.type === typeFilter)
            .filter((l) => result === "ALL" || l.result === result)
            .filter((l) => {
                if (!q) return true;
                const reason = (l.errorReason ?? "").toLowerCase();
                const sku = (l.failedSkuId ?? "").toLowerCase();
                return reason.includes(q) || sku.includes(q);
            });
    }, [isCustom, dateFrom, dateTo, period, typeFilter, result, search]);

    // 결과 통계 — 시각 피드백 배너에 표시
    const stats = useMemo(() => {
        const total = filtered.length;
        const success = filtered.filter((l) => l.result === "success").length;
        const partial = filtered.filter((l) => l.result === "partial").length;
        const failed = filtered.filter((l) => l.result === "failed").length;
        const successRate = total > 0 ? (success / total) * 100 : 0;
        return { total, success, partial, failed, successRate };
    }, [filtered]);

    // 배너 라벨 — custom 모드면 "2026-04-01 ~ 2026-04-15 (15일)" 형태로
    const periodLabel = useMemo(() => {
        if (!isCustom) return PERIOD_LABEL[period];
        const fromTxt = dateFrom || "시작일 미입력";
        const toTxt = dateTo || "종료일 미입력";
        const fromMs = dateStrToStartMs(dateFrom);
        const toMs = dateStrToEndMs(dateTo);
        if (fromMs && toMs && toMs >= fromMs) {
            return `${fromTxt} ~ ${toTxt} (${diffDays(fromMs, toMs)}일)`;
        }
        return `${fromTxt} ~ ${toTxt}`;
    }, [isCustom, period, dateFrom, dateTo]);

    return (
        <div>
            {/* 섹션 헤더 */}
            <div className="flex items-start gap-2 mb-3">
                <History size={16} strokeWidth={2} className="text-[#0d47a1] mt-[3px]" />
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-[14px] font-semibold text-[#1a1a1a]">동기화 이력</h2>
                        <span className="text-[12px] text-[#718096]">시간순 · 최근 7일</span>
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-0.5 leading-[1.6]">
                        본 시스템의 주력은 매장 재고 관리이며, 본사 ERP와의 연동을 통해
                        SKU 마스터 · 가격 정책 · 안전 재고 기준 · 매장 운영 시간 등 관련 데이터도 함께 동기화될 수 있습니다 <span className="text-[#94a3b8]">(예시 — 실제 항목은 본사 협의)</span>.
                    </p>
                </div>
            </div>

            {/* 필터바 */}
            <SyncHistoryFilterBar
                period={isCustom ? "custom" : period}
                onPeriodChange={handlePeriodChange}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                result={result}
                onResultChange={setResult}
                search={search}
                onSearchChange={setSearch}
            />

            {/* 시각 피드백 배너 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 mt-3 rounded-md bg-[#e8eef6] border border-[#0d47a1]/15">
                <div className="inline-flex items-center gap-2">
                    <CalendarRange size={14} strokeWidth={2} className="text-[#0d47a1]" />
                    <span className="text-[12px] font-semibold text-[#0d47a1]">
                        현재 표시 기간: {periodLabel}
                    </span>
                </div>
                <span className="text-[#cbd5e1]">·</span>
                <span className="text-[12px] text-[#4a5568]">
                    이 조건에서{" "}
                    <span className="font-bold text-[#1a1a1a] tabular-nums">
                        {stats.total.toLocaleString()}
                    </span>
                    건 조회
                </span>
                {stats.total > 0 && (
                    <>
                        <span className="text-[#cbd5e1]">·</span>
                        <span className="inline-flex items-center gap-1 text-[12px]">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#15803d]" />
                            <span className="font-semibold text-[#15803d] tabular-nums">{stats.success}</span>
                            <span className="text-[#4a5568]">성공</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px]">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#c2410c]" />
                            <span className="font-semibold text-[#c2410c] tabular-nums">{stats.partial}</span>
                            <span className="text-[#4a5568]">부분</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px]">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#b34530]" />
                            <span className="font-semibold text-[#b34530] tabular-nums">{stats.failed}</span>
                            <span className="text-[#4a5568]">실패</span>
                        </span>
                        <span className="text-[#cbd5e1]">·</span>
                        <span className="text-[12px] text-[#4a5568]">
                            성공률{" "}
                            <span className="font-bold text-[#0d47a1] tabular-nums">
                                {stats.successRate.toFixed(1)}%
                            </span>
                        </span>
                    </>
                )}
            </div>

            {/* 테이블 */}
            <div className="mt-3">
                <SyncHistoryTable logs={filtered} />
            </div>
        </div>
    );
}
