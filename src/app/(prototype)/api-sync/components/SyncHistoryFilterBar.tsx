/**
 * @file src/app/(prototype)/api-sync/components/SyncHistoryFilterBar.tsx
 * @description 동기화 이력 필터바 — 기간 / 유형 / 결과 / 검색.
 *              화면 5(트래킹) 패턴과 일관성 유지.
 */

"use client";

import { Search } from "lucide-react";
import InfoHint from "@/components/ui/InfoHint";
import type { SyncResult, SyncType } from "@/data/seed/api-sync-seed";

export type SyncPeriodKey = "today" | "24h" | "7d" | "all";

const PERIODS: { value: SyncPeriodKey; label: string }[] = [
    { value: "today", label: "오늘" },
    { value: "24h", label: "24시간" },
    { value: "7d", label: "7일" },
    { value: "all", label: "전체" },
];

const TYPES: { value: SyncType | "ALL"; label: string }[] = [
    { value: "ALL", label: "전체" },
    { value: "재고 일괄", label: "재고 일괄" },
    { value: "SKU 마스터", label: "SKU 마스터" },
    { value: "가격 정책", label: "가격 정책" },
    { value: "안전 재고 기준", label: "안전 재고 기준" },
    { value: "매장 운영 시간", label: "매장 운영 시간" },
];

// 비활성 상태는 4개 모두 무채색 회색으로 통일 — 평소엔 깔끔한 4개 칩.
// 활성 상태에서만 해당 결과의 의미 색을 solid 톤으로 부여.
const IDLE_TONE =
    "bg-white text-[#4a5568] border-[#e2e8f0] hover:border-[#94a3b8] hover:text-[#1a1a1a]";

const RESULTS: { value: SyncResult | "ALL"; label: string; toneActive: string }[] = [
    {
        value: "ALL",
        label: "전체",
        toneActive: "bg-[#0d47a1] text-white border-[#0d47a1]",
    },
    {
        value: "success",
        label: "성공",
        toneActive: "bg-[#15803d] text-white border-[#15803d]",
    },
    {
        value: "partial",
        label: "부분",
        toneActive: "bg-[#c2410c] text-white border-[#c2410c]",
    },
    {
        value: "failed",
        label: "실패",
        toneActive: "bg-[#b34530] text-white border-[#b34530]",
    },
];

interface SyncHistoryFilterBarProps {
    /** 기간 탭 활성값 — 'custom'은 from~to 모드 */
    period: SyncPeriodKey | "custom";
    onPeriodChange: (v: SyncPeriodKey) => void;
    /** from~to 직접 지정 (YYYY-MM-DD) */
    dateFrom: string;
    dateTo: string;
    onDateFromChange: (v: string) => void;
    onDateToChange: (v: string) => void;
    typeFilter: SyncType | "ALL";
    onTypeChange: (v: SyncType | "ALL") => void;
    result: SyncResult | "ALL";
    onResultChange: (v: SyncResult | "ALL") => void;
    search: string;
    onSearchChange: (v: string) => void;
}

export default function SyncHistoryFilterBar({
    period,
    onPeriodChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    typeFilter,
    onTypeChange,
    result,
    onResultChange,
    search,
    onSearchChange,
}: SyncHistoryFilterBarProps) {
    const isCustom = period === "custom";
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-end gap-3">
                {/* 기간 탭 — 빠른 선택 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        기간 (빠른 선택)
                    </label>
                    <div className="flex items-center gap-1 p-1 rounded-md bg-[#f8fafc] border border-[#e2e8f0]">
                        {PERIODS.map((p) => {
                            // isCustom일 땐 탭 모두 비활성으로 — from~to 모드 시그널
                            const active = !isCustom && period === p.value;
                            return (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => onPeriodChange(p.value)}
                                    className={`h-7 px-3 rounded-sm text-[12px] font-medium transition-colors ${
                                        active
                                            ? "bg-white text-[#0d47a1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0]"
                                            : "text-[#4a5568] hover:text-[#1a1a1a]"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 기간 직접 지정 — from~to */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        기간 직접 지정
                    </label>
                    <div className="flex items-center gap-1.5">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => onDateFromChange(e.target.value)}
                            className={`h-9 px-2.5 rounded-md border bg-white text-[12px] tabular-nums hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 transition-colors ${
                                isCustom
                                    ? "border-[#0d47a1] text-[#1a1a1a]"
                                    : "border-[#e2e8f0] text-[#4a5568]"
                            }`}
                        />
                        <span className="text-[12px] text-[#94a3b8]">~</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => onDateToChange(e.target.value)}
                            className={`h-9 px-2.5 rounded-md border bg-white text-[12px] tabular-nums hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 transition-colors ${
                                isCustom
                                    ? "border-[#0d47a1] text-[#1a1a1a]"
                                    : "border-[#e2e8f0] text-[#4a5568]"
                            }`}
                        />
                    </div>
                </div>

                {/* 유형 */}
                <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        동기화 유형
                        <InfoHint
                            title="동기화 유형 5종 (예시)"
                            definition="본 시스템의 주력은 매장 재고 관리이며, 본사 ERP와의 연동을 통해 함께 동기화될 수 있는 마스터 데이터를 예시로 보여줍니다. 실제 연동 항목은 본사와 협의하여 결정합니다."
                            bullets={[
                                "재고 일괄 — 본사 ERP의 SKU별 재고 수량을 일괄 조회 (대조 검증용).",
                                "SKU 마스터 — 신규 SKU 등록 / 기존 SKU 단가 변경 사항 동기화.",
                                "가격 정책 — 본사가 결정한 할인율 · 프로모션 가격 정책 수신.",
                                "안전 재고 기준 — 본사 정책 변경 시 SKU별 임계값 일괄 갱신.",
                                "매장 운영 시간 — 매장별 영업 시간 / 휴무 정보 수신.",
                            ]}
                            placement="bottom"
                            width={360}
                        />
                    </label>
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => onTypeChange(e.target.value as SyncType | "ALL")}
                            className="h-9 pl-3 pr-8 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 appearance-none cursor-pointer transition-colors"
                        >
                            {TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none text-[10px]">▼</span>
                    </div>
                </div>

                {/* 결과 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        결과
                    </label>
                    <div className="flex items-center gap-1.5">
                        {RESULTS.map((r) => {
                            const active = result === r.value;
                            return (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => onResultChange(r.value)}
                                    className={`h-9 px-3 rounded-md text-[12px] font-semibold border transition-colors ${
                                        active ? r.toneActive : IDLE_TONE
                                    }`}
                                >
                                    {r.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 검색 */}
                <div className="flex flex-col gap-1 ml-auto min-w-[240px] flex-1 max-w-[360px]">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        검색
                    </label>
                    <div className="relative">
                        <Search
                            size={14}
                            strokeWidth={2}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="실패 사유 · 실패 SKU ID 검색"
                            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] placeholder:text-[#94a3b8] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 transition-colors"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
