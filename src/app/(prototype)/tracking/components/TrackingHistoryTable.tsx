/**
 * @file src/app/(prototype)/tracking/components/TrackingHistoryTable.tsx
 * @description 입출고 이력 테이블 — 컬럼: 일시·SKU·품목명·카테고리·출발지·도착지·수량·담당자·메모.
 *              페이지네이션 포함.
 */

"use client";

import { useState } from "react";
import type { TrackingEvent } from "@/types/inventory";
import SeverityBadge, { type Severity } from "@/components/ui/SeverityBadge";
import {
    labelForLocation,
    TYPE_LABEL,
} from "@/data/seed/tracking-helpers";

interface TrackingHistoryTableProps {
    events: TrackingEvent[];
}

const PAGE_SIZE = 20;

const TYPE_TO_SEVERITY: Record<TrackingEvent["type"], Severity> = {
    inbound: "info",       // 푸른
    outbound: "neutral",   // 회색
    transfer: "info",      // 푸른
    return: "warning",     // 주황
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

export default function TrackingHistoryTable({ events }: TrackingHistoryTableProps) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = events.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-3 py-2.5">일시</th>
                            <th className="px-3 py-2.5">SKU</th>
                            <th className="px-3 py-2.5">품목명</th>
                            <th className="px-3 py-2.5">카테고리</th>
                            <th className="px-3 py-2.5 text-center">유형</th>
                            <th className="px-3 py-2.5">출발지</th>
                            <th className="px-3 py-2.5">도착지</th>
                            <th className="px-3 py-2.5 text-right">수량</th>
                            <th className="px-3 py-2.5">담당자</th>
                            <th className="px-3 py-2.5">메모</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-3 py-12 text-center text-[13px] text-[#718096]">
                                    조건에 맞는 이력이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((e) => {
                                const sev = TYPE_TO_SEVERITY[e.type];
                                return (
                                    <tr key={e.id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568] tabular-nums whitespace-nowrap">
                                            {formatDateTime(e.timestamp)}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] font-mono text-[#4a5568]">
                                            {e.skuId}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                            {e.skuName}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568]">
                                            {e.category}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <SeverityBadge severity={sev}>
                                                {TYPE_LABEL[e.type]}
                                            </SeverityBadge>
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568] whitespace-nowrap">
                                            {labelForLocation(e.fromLocation)}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#1a1a1a] whitespace-nowrap">
                                            {labelForLocation(e.toLocation)}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#0d47a1] tabular-nums">
                                            {e.quantity.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568]">
                                            {e.operatorName}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#94a3b8]">
                                            {e.memo ?? "—"}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {events.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                    <span className="text-[12px] text-[#718096]">
                        {(safePage - 1) * PAGE_SIZE + 1}~{Math.min(safePage * PAGE_SIZE, events.length)} / {events.length.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="px-3 h-8 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            이전
                        </button>
                        <span className="px-3 h-8 inline-flex items-center text-[12px] font-semibold text-[#1a1a1a] tabular-nums">
                            {safePage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className="px-3 h-8 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
