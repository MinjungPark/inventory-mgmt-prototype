/**
 * @file src/app/(prototype)/warehouse-inventory/components/WarehouseCard.tsx
 * @description 창고 카드 — 3창고 그리드 단위.
 *              SKU 수 / 재고 수량 / 재고 가치 + 가동률 게이지 + 상태 배지.
 */

"use client";

import { Building2, ChevronRight, MapPin, Warehouse as WarehouseIcon } from "lucide-react";
import type { Warehouse } from "@/types/inventory";
import SeverityBadge, { type Severity } from "@/components/ui/SeverityBadge";
import { utilizationSeverity } from "@/data/seed/warehouse-helpers";

interface WarehouseCardProps {
    warehouse: Warehouse;
    selected: boolean;
    onClick: () => void;
}

const WAREHOUSE_ICON: Record<string, typeof WarehouseIcon> = {
    "WH-1": Building2,
    "WH-2": WarehouseIcon,
    "WH-3": MapPin,
};

const WAREHOUSE_GRADIENT: Record<string, string> = {
    "WH-1": "from-[#0d47a1] to-[#1976d2]",
    "WH-2": "from-[#1565c0] to-[#42a5f5]",
    "WH-3": "from-[#1976d2] to-[#90caf9]",
};

function formatKRW(amount: number): string {
    if (amount >= 100_000_000) {
        return `${(amount / 100_000_000).toFixed(1)}억`;
    }
    return `${Math.round(amount / 10_000).toLocaleString()}만`;
}

const SEVERITY_LABEL: Record<ReturnType<typeof utilizationSeverity>, { severity: Severity; label: string }> = {
    ok:       { severity: "ok",       label: "여유 운영" },
    warning:  { severity: "warning",  label: "보충 필요" },
    critical: { severity: "critical", label: "만재 임박" },
};

export default function WarehouseCard({ warehouse, selected, onClick }: WarehouseCardProps) {
    const Icon = WAREHOUSE_ICON[warehouse.id] ?? WarehouseIcon;
    const gradient = WAREHOUSE_GRADIENT[warehouse.id] ?? WAREHOUSE_GRADIENT["WH-1"];
    const sevKey = utilizationSeverity(warehouse.utilizationPct);
    const sev = SEVERITY_LABEL[sevKey];

    // 게이지 색상
    const gaugeColor =
        sevKey === "critical" ? "#991b1b" :
        sevKey === "warning"  ? "#c2410c" :
                                "#0d47a1";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative w-full text-left bg-white border rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 transition-all hover:shadow-[0_2px_8px_rgba(13,71,161,0.10)] ${
                selected
                    ? "border-[#0d47a1] ring-2 ring-[#0d47a1]/20"
                    : "border-[#e2e8f0] hover:border-[#cbd5e1]"
            }`}
        >
            {/* 상단: 아이콘 + 셰브론 */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center justify-center w-11 h-11 rounded-md bg-gradient-to-br ${gradient} text-white shadow-sm`}
                    >
                        <Icon size={20} strokeWidth={2} />
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-[12px] font-semibold text-[#0d47a1] tracking-wider">
                            {warehouse.id}
                        </span>
                        <h3 className="text-[16px] font-semibold text-[#1a1a1a] tracking-tight">
                            {warehouse.name}
                        </h3>
                        <span className="text-[11px] text-[#718096] mt-0.5">
                            {warehouse.location}
                        </span>
                    </div>
                </div>
                <ChevronRight
                    size={16}
                    strokeWidth={2}
                    className={`shrink-0 transition-colors ${
                        selected ? "text-[#0d47a1]" : "text-[#94a3b8] group-hover:text-[#0d47a1]"
                    }`}
                />
            </div>

            {/* 통계 3종 */}
            <div className="grid grid-cols-3 gap-2 pb-4 border-b border-[#f1f5f9]">
                <div>
                    <p className="text-[11px] text-[#718096] mb-0.5">SKU</p>
                    <p className="text-[16px] font-bold text-[#1a1a1a] tabular-nums leading-tight">
                        {warehouse.skuCount.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-[#718096] mb-0.5">수량</p>
                    <p className="text-[16px] font-bold text-[#1a1a1a] tabular-nums leading-tight">
                        {warehouse.totalQuantity.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-[#718096] mb-0.5">재고 가치</p>
                    <p className="text-[16px] font-bold text-[#0d47a1] tabular-nums leading-tight">
                        {formatKRW(warehouse.totalValueKRW)}
                    </p>
                </div>
            </div>

            {/* 가동률 게이지 */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-[#4a5568]">가동률</span>
                    <span
                        className="text-[14px] font-bold tabular-nums tracking-tight"
                        style={{ color: gaugeColor }}
                    >
                        {warehouse.utilizationPct}%
                    </span>
                </div>
                <div className="relative h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all"
                        style={{
                            width: `${warehouse.utilizationPct}%`,
                            background: gaugeColor,
                        }}
                    />
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <SeverityBadge
                        severity={sev.severity}
                        variant={sev.severity === "critical" ? "solid" : "outline"}
                    >
                        {sev.label}
                    </SeverityBadge>
                    <span className="text-[11px] text-[#718096]">
                        잔여 용량 {(100 - warehouse.utilizationPct).toFixed(0)}%
                    </span>
                </div>
            </div>
        </button>
    );
}
