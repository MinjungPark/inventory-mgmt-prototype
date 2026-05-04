/**
 * @file src/app/(prototype)/store-inventory/components/ZoneDistributionStack.tsx
 * @description 선택 섹션의 존(Zone)별 재고 분포 — 가로 100% 스택 바.
 */

"use client";

import type { StoreSection } from "@/types/inventory";
import { CHART_BLUE_SCALE } from "@/components/ui/chart-theme";

interface ZoneDistributionStackProps {
    section: StoreSection;
}

export default function ZoneDistributionStack({ section }: ZoneDistributionStackProps) {
    const total = section.zones.reduce((sum, z) => sum + z.quantity, 0);
    if (total === 0) return null;

    return (
        <div className="space-y-3">
            {/* 100% 스택 바 */}
            <div className="flex w-full h-7 rounded-md overflow-hidden border border-[#e2e8f0]">
                {section.zones.map((zone, idx) => {
                    const pct = (zone.quantity / total) * 100;
                    return (
                        <div
                            key={zone.id}
                            className="flex items-center justify-center text-[11px] font-semibold text-white transition-all"
                            style={{
                                width: `${pct}%`,
                                background: CHART_BLUE_SCALE[idx % CHART_BLUE_SCALE.length],
                            }}
                            title={`${zone.name}: ${zone.quantity.toLocaleString()}개 (${pct.toFixed(1)}%)`}
                        >
                            {pct >= 12 && `${pct.toFixed(0)}%`}
                        </div>
                    );
                })}
            </div>

            {/* 존별 통계 행 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.zones.map((zone, idx) => (
                    <div
                        key={zone.id}
                        className="flex items-start gap-2 p-3 rounded-md bg-[#f8fafc] border border-[#e2e8f0]"
                    >
                        <span
                            className="shrink-0 w-3 h-3 rounded-sm mt-1"
                            style={{ background: CHART_BLUE_SCALE[idx % CHART_BLUE_SCALE.length] }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1a1a1a]">
                                {zone.name}
                            </p>
                            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
                                <span className="text-[11px] text-[#718096]">SKU</span>
                                <span className="text-[12px] font-semibold text-[#1a1a1a] tabular-nums text-right">
                                    {zone.skuCount}
                                </span>
                                <span className="text-[11px] text-[#718096]">수량</span>
                                <span className="text-[12px] font-semibold text-[#1a1a1a] tabular-nums text-right">
                                    {zone.quantity.toLocaleString()}
                                </span>
                                <span className="text-[11px] text-[#718096]">가치</span>
                                <span className="text-[12px] font-semibold text-[#0d47a1] tabular-nums text-right">
                                    {(zone.valueKRW / 10_000_000).toFixed(1)}천만
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
