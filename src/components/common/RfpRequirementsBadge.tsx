/**
 * @file src/components/common/RfpRequirementsBadge.tsx
 * @description '상세 기능 요구 사항 : N-N. 섹션명' 배지 + 호버 시 RFP 트리 전체.
 *              현재 화면 해당 섹션은 Primary 블루로, 그 항목은 검정으로 강조.
 *              다른 섹션은 회색(중제목 #4a5568) / 옅은 회색(항목 #94a3b8)으로 배경화.
 */

"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { RFP_TREE } from "@/data/rfp";

interface RfpRequirementsBadgeProps {
    /** 현재 화면이 해당하는 섹션 id (예: '2-2'). 항상 필요 */
    currentSectionId: string;
    /** 현재 화면이 해당하는 항목 id 배열 (예: ['2-1-①']) — 단일 항목 화면용 */
    highlightItems?: string[];
    /** 섹션 통째로 강조 (모든 항목 검정으로) — 종합 화면용 */
    highlightAllItemsInSection?: boolean;
}

export default function RfpRequirementsBadge({
    currentSectionId,
    highlightItems = [],
    highlightAllItemsInSection = false,
}: RfpRequirementsBadgeProps) {
    const [open, setOpen] = useState(false);
    const itemSet = new Set(highlightItems);

    // 배지 라벨 — 'X-X. 섹션명' 풀 형태
    const currentSection = RFP_TREE.find((s) => s.id === currentSectionId);
    const badgeText = currentSection
        ? `${currentSection.id}. ${currentSection.title}`
        : currentSectionId;

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
                aria-label="상세 기능 요구 사항 보기"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e8eef6] border border-[#0d47a1]/15 hover:bg-[#dbe6f5] hover:border-[#0d47a1]/30 transition-colors"
            >
                <FileText size={11} strokeWidth={2.2} className="text-[#0d47a1]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d47a1]">
                    상세 기능 요구 사항
                </span>
                <span className="text-[11px] text-[#0d47a1]/40">:</span>
                <span className="text-[12px] font-semibold text-[#0d47a1]">{badgeText}</span>
            </button>

            {open && (
                <span
                    role="tooltip"
                    className="absolute z-50 top-full left-0 mt-2 w-[480px] bg-white border border-[#e0e0e0] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.10)] overflow-hidden"
                >
                    {/* 헤더 띠 */}
                    <span className="block px-3.5 py-2 bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0d47a1]">
                            RFP · 2. 상세 기능 요구 사항
                        </span>
                    </span>

                    {/* 트리 */}
                    <span className="block px-3.5 py-3 space-y-3 max-h-[480px] overflow-y-auto">
                        {RFP_TREE.map((section) => {
                            const isCurrentSection = section.id === currentSectionId;
                            return (
                                <span key={section.id} className="block">
                                    {/* 중제목 */}
                                    <span
                                        className={`block text-[12px] mb-1.5 ${
                                            isCurrentSection
                                                ? "font-bold text-[#0d47a1]"
                                                : "font-semibold text-[#4a5568]"
                                        }`}
                                    >
                                        {section.id}. {section.title}
                                    </span>

                                    {/* 항목 */}
                                    <span className="block pl-4 space-y-1">
                                        {section.items.map((item) => {
                                            const isItemHighlight =
                                                isCurrentSection &&
                                                (highlightAllItemsInSection ||
                                                    itemSet.has(item.id));
                                            return (
                                                <span
                                                    key={item.id}
                                                    className={`flex gap-1.5 text-[12px] leading-[1.6] ${
                                                        isItemHighlight
                                                            ? "text-[#1a1a1a] font-semibold"
                                                            : isCurrentSection
                                                                ? "text-[#4a5568] font-normal"
                                                                : "text-[#94a3b8] font-normal"
                                                    }`}
                                                >
                                                    <span className="shrink-0 w-3.5">
                                                        {isItemHighlight ? (
                                                            <span className="text-[#0d47a1]">▶</span>
                                                        ) : (
                                                            <span className="text-[#cbd5e1]">·</span>
                                                        )}
                                                    </span>
                                                    <span className="flex-1">
                                                        <span
                                                            className={`mr-1 font-mono ${
                                                                isItemHighlight
                                                                    ? "text-[#0d47a1]"
                                                                    : "text-[#cbd5e1]"
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </span>
                                                        {item.text}
                                                    </span>
                                                </span>
                                            );
                                        })}
                                    </span>
                                </span>
                            );
                        })}
                    </span>
                </span>
            )}
        </span>
    );
}
