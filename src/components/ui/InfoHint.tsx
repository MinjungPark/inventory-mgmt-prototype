/**
 * @file src/components/ui/InfoHint.tsx
 * @description 인라인 인포 박스 — 차트/카드/표에 호버 도움말 표시.
 *
 *  두 가지 사용 패턴:
 *   1) 단순 한 줄 설명 → text prop
 *   2) 구조화된 개념 설명 → title + definition + bullets
 *      (시니어 글쓰기 3원칙 위계: 헤더 → 정의 한 줄 → 도트 디테일)
 */

"use client";

import { Info } from "lucide-react";
import { useState } from "react";

interface InfoHintProps {
    /** 단순 한 줄 도움말. text 또는 title 둘 중 하나만 사용. */
    text?: string;
    /** 구조화 — 굵은 헤더 (예: "SKU (Stock Keeping Unit)") */
    title?: string;
    /** 구조화 — 정의 한 줄 (예: "재고 관리의 가장 작은 식별 단위.") */
    definition?: string;
    /** 구조화 — 푸른 도트 bullet 라인 */
    bullets?: string[];
    /** 위치: top(기본) / right / bottom / left */
    placement?: "top" | "right" | "bottom" | "left";
    /** 아이콘 크기 (기본 14) */
    size?: number;
    /** 툴팁 박스 너비 (px) — 콘텐츠 분량에 따라 호출자가 조정. 디폴트 320 */
    width?: number;
}

const PLACEMENT_CLASSES: Record<NonNullable<InfoHintProps["placement"]>, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
};

export default function InfoHint({
    text,
    title,
    definition,
    bullets,
    placement = "top",
    size = 14,
    width = 320,
}: InfoHintProps) {
    const [open, setOpen] = useState(false);

    const isStructured = !!(title || definition || (bullets && bullets.length > 0));

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
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#0d47a1]/60 hover:text-[#0d47a1] hover:bg-[#e8eef6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d47a1]/30"
            >
                <Info size={size} strokeWidth={2.2} />
            </button>

            {open && (
                <span
                    role="tooltip"
                    style={{ width: `${width}px` }}
                    className={`absolute z-50 ${PLACEMENT_CLASSES[placement]} bg-white border border-[#e0e0e0] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.10)] font-normal text-left whitespace-normal overflow-hidden`}
                >
                    {isStructured ? (
                        <span className="block">
                            {title && (
                                <span className="block px-3.5 pt-3 pb-2 border-b border-[#e2e8f0] bg-[#f8fafc]">
                                    <span className="text-[13px] font-bold text-[#0d47a1] tracking-tight">
                                        {title}
                                    </span>
                                </span>
                            )}
                            <span className="block px-3.5 py-3">
                                {definition && (
                                    <span className="block text-[12px] leading-[1.7] text-[#1a1a1a] font-medium mb-2">
                                        {definition}
                                    </span>
                                )}
                                {bullets && bullets.length > 0 && (
                                    <ul className="space-y-1.5 mt-1">
                                        {bullets.map((b, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-2 text-[12px] leading-[1.65] text-[#4a5568]"
                                            >
                                                <span
                                                    className="shrink-0 mt-[7px] w-[5px] h-[5px] rounded-full bg-[#0d47a1]"
                                                    aria-hidden="true"
                                                />
                                                <span className="flex-1">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </span>
                        </span>
                    ) : (
                        <span className="block px-3.5 py-2.5 text-[12px] leading-[1.7] text-[#4a5568]">
                            {text}
                        </span>
                    )}
                </span>
            )}
        </span>
    );
}
