/**
 * @file src/app/(prototype)/admin/threshold/components/ChangeHistoryPanel.tsx
 * @description 변경 이력 패널 — 일시·변경 항목·이전→변경 값·담당자.
 */

"use client";

import { History, ArrowRight } from "lucide-react";
import { THRESHOLD_HISTORY } from "@/data/seed/threshold-history";
import type { ThresholdChangeLog } from "@/data/seed/threshold-history";
import SeverityBadge from "@/components/ui/SeverityBadge";

const SCOPE_LABEL: Record<ThresholdChangeLog["scope"], string> = {
    sku: "SKU",
    category: "카테고리",
    store: "매장",
};

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function ChangeHistoryPanel() {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#e2e8f0]">
                <History size={16} strokeWidth={2} className="text-[#0d47a1]" />
                <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                    설정 변경 이력
                </h3>
                <span className="text-[12px] text-[#718096]">
                    최근 {THRESHOLD_HISTORY.length}건
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-3 py-2.5">일시</th>
                            <th className="px-3 py-2.5 text-center">범위</th>
                            <th className="px-3 py-2.5">변경 항목</th>
                            <th className="px-3 py-2.5 text-right">이전 값</th>
                            <th className="px-3 py-2.5 text-center">→</th>
                            <th className="px-3 py-2.5 text-right">변경 값</th>
                            <th className="px-3 py-2.5">담당자</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {THRESHOLD_HISTORY.map((log) => (
                            <tr key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                                <td className="px-3 py-2.5 text-[12px] text-[#4a5568] tabular-nums whitespace-nowrap">
                                    {formatDateTime(log.timestamp)}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                    <SeverityBadge
                                        severity={log.scope === "sku" ? "info" : log.scope === "category" ? "warning" : "neutral"}
                                    >
                                        {SCOPE_LABEL[log.scope]}
                                    </SeverityBadge>
                                </td>
                                <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                    {log.itemLabel}
                                </td>
                                <td className="px-3 py-2.5 text-[12px] text-right text-[#94a3b8] tabular-nums">
                                    {log.fromValue}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                    <ArrowRight size={12} strokeWidth={2.2} className="inline text-[#94a3b8]" />
                                </td>
                                <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#0d47a1] tabular-nums">
                                    {log.toValue}
                                </td>
                                <td className="px-3 py-2.5 text-[12px] text-[#4a5568]">
                                    {log.operator}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
