/**
 * @file src/app/(prototype)/dashboard/components/LowStockAlertWidget.tsx
 * @description 하단 위젯 1 — 안전 재고 알림 상위 5건 (클릭 시 /alerts 이동)
 */

"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { STOCK_ALERTS } from "@/data/seed";
import type { AlertSeverity } from "@/types/inventory";

const SEVERITY_STYLE: Record<AlertSeverity, { bg: string; text: string; border: string; label: string }> = {
    critical: {
        bg: "bg-[#fef2f2]",
        text: "text-[#d32f2f]",
        border: "border-[#fecaca]",
        label: "긴급",
    },
    warning: {
        bg: "bg-[#fffbeb]",
        text: "text-[#f57c00]",
        border: "border-[#fde68a]",
        label: "주의",
    },
    ok: {
        bg: "bg-[#f0fdf4]",
        text: "text-[#388e3c]",
        border: "border-[#bbf7d0]",
        label: "정상",
    },
};

export default function LowStockAlertWidget() {
    const top5 = STOCK_ALERTS
        .filter((a) => a.status === "new")
        .sort((a, b) => {
            // critical 먼저, 그 다음 warning
            const order = { critical: 0, warning: 1, ok: 2 };
            return order[a.severity] - order[b.severity];
        })
        .slice(0, 5);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={14} strokeWidth={2} className="text-[#d32f2f]" />
                    <div className="flex flex-col leading-tight">
                        <h3 className="text-[13px] font-semibold text-[#1a1a1a]">
                            안전 재고 알림
                        </h3>
                        <span className="text-[11px] text-[#718096] mt-0.5">
                            기준 수량 미달 상위 5건
                        </span>
                    </div>
                </div>
                <Link
                    href="/alerts"
                    className="flex items-center gap-1 text-[11px] font-medium text-[#0d47a1] hover:underline"
                >
                    전체 보기
                    <ArrowRight size={12} strokeWidth={2.2} />
                </Link>
            </div>

            <div className="divide-y divide-[#f1f5f9] -mx-2">
                {top5.map((a) => {
                    const sev = SEVERITY_STYLE[a.severity];
                    const ratio = Math.round((a.currentQuantity / a.thresholdQuantity) * 100);
                    return (
                        <div
                            key={a.id}
                            className="px-2 py-2.5 flex items-center gap-3 hover:bg-[#f8fafc] transition-colors rounded-sm"
                        >
                            <span
                                className={`shrink-0 w-12 h-5 rounded-sm border ${sev.bg} ${sev.text} ${sev.border} text-[10px] font-bold flex items-center justify-center`}
                            >
                                {sev.label}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-[#1a1a1a] truncate">
                                    {a.skuName}
                                </p>
                                <p className="text-[10px] text-[#718096] mt-0.5">
                                    {a.storeSectionName ?? "—"} · {a.skuId}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[12px] font-semibold text-[#1a1a1a] tabular-nums">
                                    {a.currentQuantity}
                                    <span className="text-[10px] text-[#94a3b8] font-normal">
                                        {" "}/ {a.thresholdQuantity}
                                    </span>
                                </p>
                                <p className={`text-[10px] font-semibold ${sev.text}`}>{ratio}%</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
