/**
 * @file src/app/(prototype)/warehouse-inventory/components/CategoryDistributionStack.tsx
 * @description 선택 창고의 카테고리별 재고 수량 분포 — 100% 가로 스택 바.
 */

"use client";

import type { CategoryAggregate } from "@/data/seed/warehouse-helpers";
import { CHART_CATEGORICAL } from "@/components/ui/chart-theme";

interface CategoryDistributionStackProps {
    aggregates: CategoryAggregate[];
}

export default function CategoryDistributionStack({ aggregates }: CategoryDistributionStackProps) {
    const total = aggregates.reduce((sum, a) => sum + a.quantity, 0);

    if (total === 0 || aggregates.length === 0) {
        return (
            <div className="text-center py-10 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-md">
                <p className="text-[13px] text-[#718096]">
                    해당 창고에 등록된 SKU가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* 100% 스택 바 */}
            <div className="flex w-full h-7 rounded-md overflow-hidden border border-[#e2e8f0]">
                {aggregates.map((agg, idx) => {
                    const pct = (agg.quantity / total) * 100;
                    return (
                        <div
                            key={agg.category}
                            className="flex items-center justify-center text-[11px] font-semibold text-white transition-all"
                            style={{
                                width: `${pct}%`,
                                background: CHART_CATEGORICAL[idx % CHART_CATEGORICAL.length],
                            }}
                            title={`${agg.category}: ${agg.quantity.toLocaleString()}개 (${pct.toFixed(1)}%)`}
                        >
                            {pct >= 10 && `${pct.toFixed(0)}%`}
                        </div>
                    );
                })}
            </div>

            {/* 카테고리별 통계 (그리드) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {aggregates.map((agg, idx) => (
                    <div
                        key={agg.category}
                        className="flex items-start gap-2 p-3 rounded-md bg-[#f8fafc] border border-[#e2e8f0]"
                    >
                        <span
                            className="shrink-0 w-3 h-3 rounded-sm mt-1"
                            style={{ background: CHART_CATEGORICAL[idx % CHART_CATEGORICAL.length] }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                                {agg.category}
                            </p>
                            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
                                <span className="text-[11px] text-[#718096]">SKU</span>
                                <span className="text-[12px] font-semibold text-[#1a1a1a] tabular-nums text-right">
                                    {agg.skuCount}
                                </span>
                                <span className="text-[11px] text-[#718096]">수량</span>
                                <span className="text-[12px] font-semibold text-[#1a1a1a] tabular-nums text-right">
                                    {agg.quantity.toLocaleString()}
                                </span>
                                <span className="text-[11px] text-[#718096]">가치</span>
                                <span className="text-[12px] font-semibold text-[#0d47a1] tabular-nums text-right">
                                    {(agg.valueKRW / 10_000_000).toFixed(1)}천만
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
