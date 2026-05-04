/**
 * @file src/app/(prototype)/tracking/components/TrackingFilterBar.tsx
 * @description 입출고 트래킹 이력 필터바 — 기간·유형 + 검색.
 */

"use client";

import { Search } from "lucide-react";
import type { TrackingType } from "@/types/inventory";
import { TYPE_LABEL } from "@/data/seed/tracking-helpers";

export type PeriodKey = "today" | "7d" | "30d" | "all";

interface TrackingFilterBarProps {
    period: PeriodKey;
    onPeriodChange: (v: PeriodKey) => void;
    typeFilter: TrackingType | "ALL";
    onTypeChange: (v: TrackingType | "ALL") => void;
    search: string;
    onSearchChange: (v: string) => void;
}

const PERIODS: { value: PeriodKey; label: string }[] = [
    { value: "today", label: "오늘" },
    { value: "7d", label: "이번 주" },
    { value: "30d", label: "이번 달" },
    { value: "all", label: "전체" },
];

const TYPES: { value: TrackingType | "ALL"; label: string }[] = [
    { value: "ALL", label: "전체" },
    { value: "inbound", label: TYPE_LABEL.inbound },
    { value: "outbound", label: TYPE_LABEL.outbound },
    { value: "transfer", label: TYPE_LABEL.transfer },
    { value: "return", label: TYPE_LABEL.return },
];

export default function TrackingFilterBar({
    period,
    onPeriodChange,
    typeFilter,
    onTypeChange,
    search,
    onSearchChange,
}: TrackingFilterBarProps) {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center gap-3">
                {/* 기간 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        기간
                    </label>
                    <div className="flex items-center gap-1 p-1 rounded-md bg-[#f8fafc] border border-[#e2e8f0]">
                        {PERIODS.map((p) => {
                            const active = period === p.value;
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

                {/* 유형 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        유형
                    </label>
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => onTypeChange(e.target.value as TrackingType | "ALL")}
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
                            placeholder="SKU · 품목명 · 담당자 검색"
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
