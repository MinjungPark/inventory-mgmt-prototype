/**
 * @file src/app/(prototype)/dashboard/components/LowStockAlertWidget.tsx
 * @description 하단 위젯 1 — 안전 재고 알림 상위 5건 (클릭 시 /alerts 이동)
 */

"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { STOCK_ALERTS } from "@/data/seed";
import type { AlertSeverity } from "@/types/inventory";
import InfoHint from "@/components/ui/InfoHint";

const SEVERITY_STYLE: Record<AlertSeverity, { bg: string; text: string; border: string; label: string }> = {
    critical: {
        bg: "bg-[#fef2f2]",
        text: "text-[#991b1b]",
        border: "border-[#fecaca]",
        label: "긴급",
    },
    warning: {
        bg: "bg-[#fff7ed]",
        text: "text-[#9a3412]",
        border: "border-[#fed7aa]",
        label: "주의",
    },
    ok: {
        bg: "bg-[#f0fdf4]",
        text: "text-[#15803d]",
        border: "border-[#bbf7d0]",
        label: "정상",
    },
};

export default function LowStockAlertWidget() {
    const top10 = STOCK_ALERTS
        .filter((a) => a.status === "new")
        .sort((a, b) => {
            // critical 먼저, 그 다음 warning, 같으면 가장 부족한 (current/threshold ratio 낮은) 순
            const order = { critical: 0, warning: 1, ok: 2 };
            const sev = order[a.severity] - order[b.severity];
            if (sev !== 0) return sev;
            return (a.currentQuantity / a.thresholdQuantity) -
                   (b.currentQuantity / b.thresholdQuantity);
        })
        .slice(0, 10);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} strokeWidth={2} className="text-[#d32f2f]" />
                    <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                                안전 재고 알림
                            </h3>
                            <InfoHint
                                title="안전 재고 알림"
                                definition="설정된 알림 기준 수량보다 매장 재고가 부족한 SKU를 표시합니다."
                                bullets={[
                                    "심각도는 현재 수량을 기준 수량으로 나눈 비율로 자동 분류됩니다.",
                                    "긴급(적색) 30% 이하 · 주의(황색) 30~70% · 정상(녹색) 70% 초과 기준이 적용됩니다.",
                                    "기준 수량은 '재고 알림 설정' 메뉴에서 SKU별 또는 카테고리 일괄로 조정 가능합니다.",
                                ]}
                            />
                        </div>
                        <span className="text-[12px] text-[#718096] mt-0.5">
                            기준 수량 미달 상위 10건
                        </span>
                    </div>
                </div>
                <Link
                    href="/alerts"
                    className="flex items-center gap-1 text-[12px] font-medium text-[#0d47a1] hover:underline"
                >
                    전체 보기
                    <ArrowRight size={12} strokeWidth={2.2} />
                </Link>
            </div>

            <div className="divide-y divide-[#f1f5f9] -mx-2">
                {top10.map((a) => {
                    const sev = SEVERITY_STYLE[a.severity];
                    const ratio = Math.round((a.currentQuantity / a.thresholdQuantity) * 100);
                    return (
                        <div
                            key={a.id}
                            className="px-2 py-3 flex items-center gap-3 hover:bg-[#f8fafc] transition-colors rounded-sm"
                        >
                            <span
                                className={`shrink-0 w-14 h-6 rounded-sm border ${sev.bg} ${sev.text} ${sev.border} text-[11px] font-bold flex items-center justify-center`}
                            >
                                {sev.label}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-[#1a1a1a] truncate">
                                    {a.skuName}
                                </p>
                                <p className="text-[11px] text-[#718096] mt-0.5">
                                    {a.storeSectionName ?? "—"} · {a.skuId}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[13px] font-semibold text-[#1a1a1a] tabular-nums">
                                    {a.currentQuantity}
                                    <span className="text-[11px] text-[#94a3b8] font-normal">
                                        {" "}/ {a.thresholdQuantity}
                                    </span>
                                </p>
                                <p className={`text-[11px] font-semibold ${sev.text}`}>{ratio}%</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
