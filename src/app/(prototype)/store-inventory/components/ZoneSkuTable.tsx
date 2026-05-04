/**
 * @file src/app/(prototype)/store-inventory/components/ZoneSkuTable.tsx
 * @description 선택 섹션의 SKU 상세 테이블 — 존(Zone)별 그루핑 + 재고 상태.
 */

"use client";

import type { Sku, StoreSection } from "@/types/inventory";
import { getStockStatus, getZoneIdForSku } from "@/data/seed/store-helpers";
import type { StockStatus } from "@/data/seed/store-helpers";

interface ZoneSkuTableProps {
    section: StoreSection;
    skus: Sku[];
    /** 필터된 결과 노출용 — undefined 면 전체 */
    statusFilter?: StockStatus | "ALL";
}

const STATUS_BADGE: Record<StockStatus, { bg: string; text: string; border: string; label: string }> = {
    sufficient: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]", border: "border-[#bbf7d0]", label: "충분" },
    warning:    { bg: "bg-[#fff7ed]", text: "text-[#9a3412]", border: "border-[#fed7aa]", label: "주의" },
    shortage:   { bg: "bg-[#fef2f2]", text: "text-[#991b1b]", border: "border-[#fecaca]", label: "부족" },
};

export default function ZoneSkuTable({ section, skus, statusFilter = "ALL" }: ZoneSkuTableProps) {
    const filtered = skus
        .map((sku) => ({
            ...sku,
            zoneId: getZoneIdForSku(sku, section),
            status: getStockStatus(sku),
        }))
        .filter((s) => statusFilter === "ALL" || s.status === statusFilter)
        .sort((a, b) => {
            // 존 정렬 → 부족 우선 → SKU id
            if (a.zoneId !== b.zoneId) return a.zoneId.localeCompare(b.zoneId);
            const order = { shortage: 0, warning: 1, sufficient: 2 };
            if (a.status !== b.status) return order[a.status] - order[b.status];
            return a.id.localeCompare(b.id);
        })
        .slice(0, 30); // 매장 화면용 — 상위 30건만 노출 (성능)

    if (filtered.length === 0) {
        return (
            <div className="text-center py-12 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-md">
                <p className="text-[13px] text-[#718096]">조건에 맞는 SKU가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto -mx-2 border border-[#e2e8f0] rounded-md">
            <table className="w-full text-left">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                        <th className="px-3 py-2.5 w-12 text-center">존</th>
                        <th className="px-3 py-2.5">SKU</th>
                        <th className="px-3 py-2.5">품목명</th>
                        <th className="px-3 py-2.5 text-right">매장 재고</th>
                        <th className="px-3 py-2.5 text-right">기준</th>
                        <th className="px-3 py-2.5 text-center">상태</th>
                        <th className="px-3 py-2.5 text-right">단가</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                    {filtered.map((sku) => {
                        const badge = STATUS_BADGE[sku.status];
                        return (
                            <tr key={sku.id} className="hover:bg-[#f8fafc] transition-colors">
                                <td className="px-3 py-2.5 text-center">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#e8eef6] text-[11px] font-bold text-[#0d47a1]">
                                        {sku.zoneId}
                                    </span>
                                </td>
                                <td className="px-3 py-2.5 text-[12px] font-mono text-[#4a5568]">
                                    {sku.id}
                                </td>
                                <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                    {sku.name}
                                </td>
                                <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#1a1a1a] tabular-nums">
                                    {sku.storeQuantity.toLocaleString()}
                                </td>
                                <td className="px-3 py-2.5 text-[12px] text-right text-[#94a3b8] tabular-nums">
                                    {sku.threshold}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                    <span
                                        className={`inline-flex items-center justify-center px-2 h-5 rounded-md border text-[11px] font-bold ${badge.bg} ${badge.text} ${badge.border}`}
                                    >
                                        {badge.label}
                                    </span>
                                </td>
                                <td className="px-3 py-2.5 text-[12px] text-right text-[#4a5568] tabular-nums">
                                    {sku.unitPriceKRW.toLocaleString()}원
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {skus.length > 30 && (
                <div className="px-3 py-2 text-[11px] text-[#94a3b8] bg-[#f8fafc] border-t border-[#e2e8f0]">
                    상위 30건 표시 · 전체 {skus.length}건
                </div>
            )}
        </div>
    );
}
