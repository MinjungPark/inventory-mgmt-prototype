/**
 * @file src/app/(prototype)/api-sync/components/SyncHistoryTable.tsx
 * @description 동기화 이력 테이블 — 시간순 + 페이지네이션.
 */

"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import SeverityBadge, { type Severity } from "@/components/ui/SeverityBadge";
import { SYNC_HISTORY, type SyncResult } from "@/data/seed/api-sync-seed";

const PAGE_SIZE = 15;

const RESULT_TO: Record<SyncResult, { severity: Severity; label: string; variant: "outline" | "solid" }> = {
    success: { severity: "ok",       label: "성공",   variant: "outline" },
    partial: { severity: "warning",  label: "부분",   variant: "outline" },
    failed:  { severity: "critical", label: "실패",   variant: "solid"   },
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

function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const s = ms / 1000;
    if (s < 60) return `${s.toFixed(1)}초`;
    return `${(s / 60).toFixed(1)}분`;
}

export default function SyncHistoryTable() {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(SYNC_HISTORY.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const items = SYNC_HISTORY.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-3 py-2.5">일시</th>
                            <th className="px-3 py-2.5">동기화 유형</th>
                            <th className="px-3 py-2.5 text-center">방향</th>
                            <th className="px-3 py-2.5 text-right">처리 건수</th>
                            <th className="px-3 py-2.5 text-right">소요 시간</th>
                            <th className="px-3 py-2.5 text-center">결과</th>
                            <th className="px-3 py-2.5">사유</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {items.map((log) => {
                            const r = RESULT_TO[log.result];
                            return (
                                <tr key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                                    <td className="px-3 py-2.5 text-[12px] text-[#4a5568] tabular-nums whitespace-nowrap">
                                        {formatDateTime(log.timestamp)}
                                    </td>
                                    <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                        {log.type}
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4a5568]">
                                            {log.direction === "in" ? (
                                                <>
                                                    <ArrowDownLeft size={11} strokeWidth={2.2} className="text-[#0d47a1]" />
                                                    수신
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowUpRight size={11} strokeWidth={2.2} className="text-[#42a5f5]" />
                                                    송신
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#1a1a1a] tabular-nums">
                                        {log.processedCount.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2.5 text-[12px] text-right text-[#4a5568] tabular-nums">
                                        {formatDuration(log.durationMs)}
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                        <SeverityBadge severity={r.severity} variant={r.variant}>
                                            {r.label}
                                        </SeverityBadge>
                                    </td>
                                    <td className="px-3 py-2.5 text-[11px] text-[#94a3b8]">
                                        {log.errorReason ?? "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {SYNC_HISTORY.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                    <span className="text-[12px] text-[#718096]">
                        {(safePage - 1) * PAGE_SIZE + 1}~
                        {Math.min(safePage * PAGE_SIZE, SYNC_HISTORY.length)} / {SYNC_HISTORY.length.toLocaleString()}
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
