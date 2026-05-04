/**
 * @file src/app/(prototype)/alerts/components/AlertsTable.tsx
 * @description 재고 알림 테이블 — 일괄 선택 + 일괄 확인 액션 + 페이지네이션.
 */

"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import type { StockAlert } from "@/types/inventory";
import SeverityBadge, { type Severity } from "@/components/ui/SeverityBadge";
import { SEVERITY_LABEL, STATUS_LABEL } from "@/data/seed/alerts-helpers";

interface AlertsTableProps {
    alerts: StockAlert[];
    /** 선택된 알림 id를 일괄 확인 처리. 부모가 status를 'acknowledged'로 변경. */
    onAcknowledge: (ids: string[]) => void;
}

const PAGE_SIZE = 20;

const SEVERITY_TO: Record<StockAlert["severity"], Severity> = {
    critical: "critical",
    warning: "warning",
    ok: "ok",
};

const STATUS_TO: Record<StockAlert["status"], Severity> = {
    new: "info",
    acknowledged: "warning",
    resolved: "ok",
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

export default function AlertsTable({ alerts, onAcknowledge }: AlertsTableProps) {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const totalPages = Math.max(1, Math.ceil(alerts.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = alerts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const allSelected = pageItems.length > 0 && pageItems.every((a) => selected.has(a.id));
    const someSelected = pageItems.some((a) => selected.has(a.id)) && !allSelected;

    // 'new' 상태인 항목만 일괄 확인 가능 — 이미 처리된 알림은 제외
    const acknowledgable = Array.from(selected).filter((id) => {
        const a = alerts.find((x) => x.id === id);
        return a?.status === "new";
    });

    function toggleAll() {
        const next = new Set(selected);
        if (allSelected) pageItems.forEach((a) => next.delete(a.id));
        else pageItems.forEach((a) => next.add(a.id));
        setSelected(next);
    }
    function toggleOne(id: string) {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    }
    function handleBulkAck() {
        if (acknowledgable.length === 0) return;
        onAcknowledge(acknowledgable);
        setSelected(new Set());
    }

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* 액션바 */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <div className="text-[12px] text-[#4a5568]">
                    선택{" "}
                    <span className="font-semibold text-[#0d47a1] tabular-nums">
                        {selected.size}
                    </span>
                    건 / 전체{" "}
                    <span className="font-semibold text-[#1a1a1a] tabular-nums">
                        {alerts.length.toLocaleString()}
                    </span>
                    건
                </div>
                <button
                    type="button"
                    onClick={handleBulkAck}
                    disabled={acknowledgable.length === 0}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#0d47a1] hover:bg-[#e8eef6] hover:border-[#0d47a1]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={
                        acknowledgable.length > 0
                            ? `선택한 신규 알림 ${acknowledgable.length}건을 일괄 확인 처리합니다`
                            : "신규 상태의 알림을 선택해 주세요"
                    }
                >
                    <CheckCheck size={13} strokeWidth={2.2} />
                    선택 일괄 확인
                    {acknowledgable.length > 0 && (
                        <span className="ml-0.5 px-1.5 rounded-full bg-[#0d47a1] text-white text-[10px] font-bold tabular-nums">
                            {acknowledgable.length}
                        </span>
                    )}
                </button>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-3 py-2.5 w-10 text-center">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected;
                                    }}
                                    onChange={toggleAll}
                                    className="w-4 h-4 accent-[#0d47a1] cursor-pointer"
                                />
                            </th>
                            <th className="px-3 py-2.5">발생 일시</th>
                            <th className="px-3 py-2.5">SKU</th>
                            <th className="px-3 py-2.5">품목명</th>
                            <th className="px-3 py-2.5">매장</th>
                            <th className="px-3 py-2.5 text-right">현재 / 기준</th>
                            <th className="px-3 py-2.5 text-center">심각도</th>
                            <th className="px-3 py-2.5 text-center">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-3 py-12 text-center text-[13px] text-[#718096]">
                                    조건에 맞는 알림이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((a) => {
                                const ratio = Math.round((a.currentQuantity / a.thresholdQuantity) * 100);
                                return (
                                    <tr key={a.id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-3 py-2.5 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(a.id)}
                                                onChange={() => toggleOne(a.id)}
                                                className="w-4 h-4 accent-[#0d47a1] cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568] tabular-nums whitespace-nowrap">
                                            {formatDateTime(a.occurredAt)}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] font-mono text-[#4a5568]">
                                            {a.skuId}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                            {a.skuName}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568] whitespace-nowrap">
                                            {a.storeSectionName ?? "—"}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-right tabular-nums">
                                            <span className="font-semibold text-[#1a1a1a]">{a.currentQuantity}</span>
                                            <span className="text-[#94a3b8]"> / {a.thresholdQuantity}</span>
                                            <span className="ml-2 text-[11px] font-semibold text-[#c2410c]">
                                                {ratio}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <SeverityBadge
                                                severity={SEVERITY_TO[a.severity]}
                                                variant={a.severity === "critical" ? "solid" : "outline"}
                                            >
                                                {SEVERITY_LABEL[a.severity]}
                                            </SeverityBadge>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <SeverityBadge severity={STATUS_TO[a.status]}>
                                                {STATUS_LABEL[a.status]}
                                            </SeverityBadge>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {alerts.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                    <span className="text-[12px] text-[#718096]">
                        {(safePage - 1) * PAGE_SIZE + 1}~
                        {Math.min(safePage * PAGE_SIZE, alerts.length)} / {alerts.length.toLocaleString()}
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
