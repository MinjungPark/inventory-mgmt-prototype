/**
 * @file src/app/(prototype)/admin/threshold/components/ThresholdInfoBox.tsx
 * @description 상단 안내 박스 — 알림 기준 동작 원리 설명.
 */

"use client";

import { Info } from "lucide-react";

export default function ThresholdInfoBox() {
    return (
        <div className="flex items-start gap-3 p-4 rounded-md bg-[#e8eef6] border border-[#0d47a1]/15">
            <span className="shrink-0 w-8 h-8 rounded-md bg-white border border-[#0d47a1]/20 flex items-center justify-center">
                <Info size={16} strokeWidth={2} className="text-[#0d47a1]" />
            </span>
            <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#0d47a1] mb-1">
                    재고 알림 동작 안내
                </p>
                <p className="text-[12px] text-[#1a1a1a] leading-[1.7]">
                    SKU별로 설정된 알림 기준 수량 이하로 매장 재고가 떨어지면 자동으로 알림이
                    발생합니다. 카테고리 일괄 설정으로 다수 SKU를 한 번에 조정할 수 있으며,
                    매장별 차등 설정을 활성화하면 매장 특성에 맞춘 기준 수량을 운영할 수 있습니다.
                </p>
            </div>
        </div>
    );
}
