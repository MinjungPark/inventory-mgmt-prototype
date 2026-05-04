/**
 * @file src/app/(prototype)/admin/threshold/components/ImpactPreviewBanner.tsx
 * @description 저장 시 영향 미리보기 — "이 설정으로 변경 시 OO개 SKU에 영향" 경고.
 */

"use client";

import { AlertTriangle, Save, X } from "lucide-react";

interface ImpactPreviewBannerProps {
    affectedCount: number;
    perStoreEnabled: boolean;
    onSave: () => void;
    onCancel: () => void;
}

export default function ImpactPreviewBanner({
    affectedCount,
    perStoreEnabled,
    onSave,
    onCancel,
}: ImpactPreviewBannerProps) {
    if (affectedCount === 0) return null;

    return (
        <div className="flex items-start gap-3 p-4 rounded-md border bg-[rgba(234,124,46,0.08)] border-[rgba(234,124,46,0.22)]">
            <span className="shrink-0 w-8 h-8 rounded-md bg-white border border-[#fed7aa] flex items-center justify-center">
                <AlertTriangle size={16} strokeWidth={2} className="text-[#c2410c]" />
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#c2410c] mb-1">
                    저장 시 영향 미리보기
                </p>
                <p className="text-[12px] text-[#1a1a1a] leading-[1.65]">
                    이 설정으로 저장 시{" "}
                    <span className="font-bold text-[#c2410c] tabular-nums">
                        {affectedCount.toLocaleString()}
                    </span>
                    개 SKU의 알림 기준 수량이 변경됩니다.
                    {perStoreEnabled && " 매장별 차등 설정이 활성화되어 있어, 매장 단위로 다른 기준이 적용됩니다."}
                </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#4a5568] hover:bg-[#f8fafc] hover:text-[#1a1a1a] transition-colors"
                >
                    <X size={12} strokeWidth={2.4} />
                    되돌리기
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gradient-to-br from-[#1565c0] to-[#0d47a1] text-white text-[12px] font-semibold shadow-sm hover:shadow-[0_2px_8px_rgba(13,71,161,0.20)] transition-all"
                >
                    <Save size={12} strokeWidth={2.4} />
                    저장
                </button>
            </div>
        </div>
    );
}
