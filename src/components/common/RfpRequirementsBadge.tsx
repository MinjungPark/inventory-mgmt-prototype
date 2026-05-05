/**
 * @file src/components/common/RfpRequirementsBadge.tsx
 * @description '상세 기능 요구 사항 N-N ①' 배지 + 호버 시 RFP 전체 트리 노출 (위계).
 *              현재 화면이 해당하는 항목/섹션은 굵은 검정 + ▶ 마커로 강조.
 */

"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { RFP_TREE } from "@/data/rfp";

interface RfpRequirementsBadgeProps {
    /** 현재 화면이 해당하는 항목 id 배열 (예: ['2-1-①']) */
    highlightItems?: string[];
    /** 또는 섹션 통째로 강조 (예: '2-1') — 종합 화면용 */
    highlightSection?: string;
    /** 배지에 표시할 짧은 라벨 (예: '2-1 ①', '2-1 종합') */
    badgeLabel: string;
}

export default function RfpRequirementsBadge({
    highlightItems = [],
    highlightSection,
    badgeLabel,
}: RfpRequirementsBadgeProps) {
    const [open, setOpen] = useState(false);
    const itemSet = new Set(highlightItems);

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
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#e8eef6] border border-[#0d47a1]/15 hover:bg-[#dbe6f5] hover:border-[#0d47a1]/30 transition-colors"
            >
                <FileText size={11} strokeWidth={2.2} className="text-[#0d47a1]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d47a1]">
                    상세 기능 요구 사항
                </span>
                <span className="text-[12px] font-semibold text-[#0d47a1]">{badgeLabel}</span>
            </button>

            {open && (
                <span
                    role="tooltip"
                    className="absolute z-50 top-full left-0 mt-2 w-[440px] bg-white border border-[#e0e0e0] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.10)] overflow-hidden"
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
                            const sectionHighlighted = highlightSection === section.id;
                            return (
                                <span key={section.id} className="block">
                                    {/* 중제목 */}
                                    <span
                                        className={`block text-[12px] font-bold mb-1 ${
                                            sectionHighlighted
                                                ? "text-[#1a1a1a]"
                                                : "text-[#0d47a1]"
                                        }`}
                                    >
                                        {sectionHighlighted && (
                                            <span className="text-[#1a1a1a] mr-1">▶</span>
                                        )}
                                        {section.id}. {section.title}
                                    </span>

                                    {/* 항목 */}
                                    <span className="block pl-4 space-y-1">
                                        {section.items.map((item) => {
                                            const itemHighlighted =
                                                itemSet.has(item.id) || sectionHighlighted;
                                            return (
                                                <span
                                                    key={item.id}
                                                    className={`flex gap-1.5 text-[12px] leading-[1.55] ${
                                                        itemHighlighted
                                                            ? "text-[#1a1a1a] font-semibold"
                                                            : "text-[#718096] font-normal"
                                                    }`}
                                                >
                                                    <span className="shrink-0 w-3.5">
                                                        {itemHighlighted ? (
                                                            <span className="text-[#0d47a1]">▶</span>
                                                        ) : (
                                                            <span className="text-[#cbd5e1]">·</span>
                                                        )}
                                                    </span>
                                                    <span className="flex-1">
                                                        <span
                                                            className={`mr-1 font-mono ${
                                                                itemHighlighted
                                                                    ? "text-[#0d47a1]"
                                                                    : "text-[#94a3b8]"
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
