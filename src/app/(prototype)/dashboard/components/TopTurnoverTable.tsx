/**
 * @file src/app/(prototype)/dashboard/components/TopTurnoverTable.tsx
 * @description 하단 위젯 2 — TOP 회전율 SKU 10건 테이블
 */

"use client";

import { TrendingUp } from "lucide-react";
import { SKUS } from "@/data/seed";

export default function TopTurnoverTable() {
    const top10 = [...SKUS]
        .sort((a, b) => b.turnoverRate - a.turnoverRate)
        .slice(0, 10);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <div className="flex flex-col leading-tight">
                        <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                            TOP 회전율 SKU
                        </h3>
                        <span className="text-[12px] text-[#718096] mt-0.5">
                            일평균 회전율 상위 10건
                        </span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#e2e8f0] text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-2 py-2.5 w-8 text-center">#</th>
                            <th className="px-2 py-2.5">품목명</th>
                            <th className="px-2 py-2.5">카테고리</th>
                            <th className="px-2 py-2.5 text-right">회전율</th>
                            <th className="px-2 py-2.5 text-right">재고</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {top10.map((s, idx) => (
                            <tr key={s.id} className="hover:bg-[#f8fafc] transition-colors">
                                <td className="px-2 py-2.5 text-center">
                                    <span
                                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                                            idx < 3
                                                ? "bg-[#0d47a1] text-white"
                                                : "bg-[#f1f5f9] text-[#4a5568]"
                                        }`}
                                    >
                                        {idx + 1}
                                    </span>
                                </td>
                                <td className="px-2 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                    {s.name}
                                </td>
                                <td className="px-2 py-2.5 text-[12px] text-[#4a5568]">
                                    {s.category}
                                </td>
                                <td className="px-2 py-2.5 text-[12px] text-right font-semibold text-[#0d47a1] tabular-nums">
                                    {s.turnoverRate.toFixed(2)}
                                </td>
                                <td className="px-2 py-2.5 text-[12px] text-right text-[#4a5568] tabular-nums">
                                    {(s.storeQuantity + s.warehouseQuantity).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
