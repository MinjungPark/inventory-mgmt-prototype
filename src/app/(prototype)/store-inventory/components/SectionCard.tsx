/**
 * @file src/app/(prototype)/store-inventory/components/SectionCard.tsx
 * @description 매장 섹션 카드 — 7섹션 그리드 단위 카드.
 *              섹션명·층/카테고리·SKU 수·재고 수량·재고 가치 + 재고 상태 색상 코드.
 */

"use client";

import { ChevronRight, Layers, Package } from "lucide-react";
import type { StoreSection } from "@/types/inventory";
import SeverityBadge, { type Severity } from "@/components/ui/SeverityBadge";

interface SectionCardProps {
    section: StoreSection;
    /** 섹션의 매장 부족 SKU 비율(0~1) — 카드 색상 강도에 사용 */
    shortageRatio: number;
    selected: boolean;
    onClick: () => void;
}

const FLOOR_GRADIENT: Record<string, string> = {
    "1F": "from-[#0d47a1] to-[#1976d2]",
    "2F": "from-[#1565c0] to-[#42a5f5]",
    "3F": "from-[#1976d2] to-[#90caf9]",
};

function formatKRW(amount: number): string {
    if (amount >= 100_000_000) {
        return `${(amount / 100_000_000).toFixed(1)}억`;
    }
    return `${Math.round(amount / 10_000).toLocaleString()}만`;
}

export default function SectionCard({
    section,
    shortageRatio,
    selected,
    onClick,
}: SectionCardProps) {
    const gradient = FLOOR_GRADIENT[section.floor] ?? FLOOR_GRADIENT["1F"];

    // 부족률에 따라 의미 색상 결정 — ENERTORK 정통 토큰
    const status: { severity: Severity; label: string } =
        shortageRatio >= 0.15
            ? { severity: "critical", label: "재고 주의" }
            : shortageRatio >= 0.05
                ? { severity: "warning", label: "일부 부족" }
                : { severity: "ok", label: "정상 운영" };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative w-full text-left bg-white border rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 transition-all hover:shadow-[0_2px_8px_rgba(13,71,161,0.10)] ${
                selected
                    ? "border-[#0d47a1] ring-2 ring-[#0d47a1]/20"
                    : "border-[#e2e8f0] hover:border-[#cbd5e1]"
            }`}
        >
            {/* 상단: 층 배지 + 섹션 ID + 셰브론 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center justify-center w-12 h-7 rounded-md bg-gradient-to-br ${gradient} text-white text-[12px] font-bold tracking-tight shadow-sm`}
                    >
                        {section.floor}
                    </span>
                    <span className="text-[12px] font-semibold text-[#4a5568]">
                        {section.id}
                    </span>
                </div>
                <ChevronRight
                    size={16}
                    strokeWidth={2}
                    className={`shrink-0 transition-colors ${
                        selected ? "text-[#0d47a1]" : "text-[#94a3b8] group-hover:text-[#0d47a1]"
                    }`}
                />
            </div>

            {/* 카테고리명 (큰 타이틀) */}
            <h3 className="text-[16px] font-semibold text-[#1a1a1a] tracking-tight mb-1">
                {section.category}
            </h3>
            <p className="text-[12px] text-[#718096] mb-4">
                존 {section.zones.length}개 운영
            </p>

            {/* 통계 3종 */}
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#f1f5f9]">
                <div>
                    <p className="text-[11px] text-[#718096] mb-0.5">SKU</p>
                    <p className="text-[15px] font-bold text-[#1a1a1a] tabular-nums leading-tight">
                        {section.skuCount.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-[#718096] mb-0.5">수량</p>
                    <p className="text-[15px] font-bold text-[#1a1a1a] tabular-nums leading-tight">
                        {section.totalQuantity.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-[#718096] mb-0.5">재고 가치</p>
                    <p className="text-[15px] font-bold text-[#0d47a1] tabular-nums leading-tight">
                        {formatKRW(section.totalValueKRW)}
                    </p>
                </div>
            </div>

            {/* 상태 배지 — ENERTORK 정통 SeverityBadge */}
            <div className="flex items-center justify-between mt-3">
                <SeverityBadge
                    severity={status.severity}
                    icon={<Package size={11} strokeWidth={2.4} />}
                >
                    {status.label}
                </SeverityBadge>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#718096]">
                    <Layers size={11} strokeWidth={2} />
                    부족률 {(shortageRatio * 100).toFixed(1)}%
                </span>
            </div>
        </button>
    );
}
