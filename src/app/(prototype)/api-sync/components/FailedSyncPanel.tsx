/**
 * @file src/app/(prototype)/api-sync/components/FailedSyncPanel.tsx
 * @description 동기화 실패 알림 패널 — SKU·실패 사유·재시도 버튼.
 */

"use client";

import { AlertOctagon, RotateCw } from "lucide-react";
import { FAILED_SYNCS } from "@/data/seed/api-sync-seed";

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function FailedSyncPanel() {
    if (FAILED_SYNCS.length === 0) {
        return (
            <div className="text-center py-8 bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.22)] rounded-md">
                <p className="text-[13px] font-semibold text-[#15803d]">
                    최근 동기화 실패 없음
                </p>
                <p className="text-[11px] text-[#4a5568] mt-1">
                    모든 동기화가 정상적으로 완료되었습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                <AlertOctagon size={16} strokeWidth={2} className="text-[#991b1b]" />
                <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                    동기화 실패 알림
                </h3>
                <span className="text-[12px] text-[#718096]">
                    {FAILED_SYNCS.length}건 — 재시도 또는 본사 관리자 문의가 필요합니다.
                </span>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
                {FAILED_SYNCS.map((f) => (
                    <div
                        key={f.id}
                        className="px-5 py-3 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[13px] font-semibold text-[#1a1a1a]">
                                    {f.skuName}
                                </span>
                                <span className="text-[11px] font-mono text-[#94a3b8]">
                                    {f.skuId}
                                </span>
                            </div>
                            <p className="text-[12px] text-[#c2410c]">{f.reason}</p>
                            <p className="text-[11px] text-[#718096] mt-0.5">
                                {formatDateTime(f.occurredAt)} · 재시도 {f.retryCount}회
                            </p>
                        </div>
                        <button
                            type="button"
                            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#0d47a1] hover:bg-[#e8eef6] hover:border-[#0d47a1]/30 transition-colors"
                        >
                            <RotateCw size={12} strokeWidth={2.2} />
                            재시도
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
