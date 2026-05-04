/**
 * @file src/components/ui/InfoHint.tsx
 * @description 인라인 인포 박스 — 차트/카드/표에 호버 도움말 표시.
 *              ENERTORK 차별화 영역 E "시스템 자체 설명" 패턴.
 */

"use client";

import { Info } from "lucide-react";
import { useState } from "react";

interface InfoHintProps {
    /** 도움말 본문 (한 두 문장 권장) */
    text: string;
    /** 위치: top(기본) / right / bottom / left */
    placement?: "top" | "right" | "bottom" | "left";
    /** 아이콘 크기 (기본 14) */
    size?: number;
}

const PLACEMENT_CLASSES: Record<NonNullable<InfoHintProps["placement"]>, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
};

export default function InfoHint({ text, placement = "top", size = 14 }: InfoHintProps) {
    const [open, setOpen] = useState(false);

    return (
        <span
            className="relative inline-flex items-center"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            <button
                type="button"
                aria-label="자세한 설명"
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#94a3b8] hover:text-[#0d47a1] hover:bg-[#e8eef6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d47a1]/30"
            >
                <Info size={size} strokeWidth={2} />
            </button>

            {open && (
                <span
                    role="tooltip"
                    className={`absolute z-50 ${PLACEMENT_CLASSES[placement]} w-[260px] bg-white border border-[#e0e0e0] rounded-md px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[12px] leading-[1.6] text-[#4a5568] font-normal whitespace-normal`}
                >
                    {text}
                </span>
            )}
        </span>
    );
}
