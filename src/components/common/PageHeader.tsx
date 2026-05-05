/**
 * @file src/components/common/PageHeader.tsx
 * @description 페이지 상단 공용 헤더 — 타이틀 + 서브타이틀 + RFP 위계 배지 + 시스템 구조도 배지 + 액션 슬롯.
 *              모든 9화면에서 일관 사용.
 *
 *  배지 2종:
 *   - RFP 뱃지 (호버 → 트리)        : "RFP 원문이 뭐냐"
 *   - 시스템 구조도 뱃지 (클릭 → 모달) : "우리가 어떻게 이해했냐"
 */

"use client";

import { useState, type ReactNode } from "react";
import { Workflow } from "lucide-react";
import RfpRequirementsBadge from "./RfpRequirementsBadge";
import SystemStructureModal from "./SystemStructureModal";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    /** 현재 화면이 해당하는 RFP 섹션 id (예: '2-2'). 배지 라벨에 자동으로 'X-X. 섹션명' 표시 */
    rfpSection?: string;
    /** 단일 항목 강조 (예: ['2-1-①']) */
    rfpHighlightItems?: string[];
    /** 섹션 종합 화면 — 섹션 모든 항목을 강조 */
    rfpHighlightAll?: boolean;
    actions?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    rfpSection,
    rfpHighlightItems,
    rfpHighlightAll,
    actions,
}: PageHeaderProps) {
    const [structureOpen, setStructureOpen] = useState(false);

    return (
        <div className="border-b border-[#e2e8f0] pb-4 mb-6 flex items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[20px] font-semibold text-[#1a1a1a] tracking-tight">
                        {title}
                    </h1>
                    {rfpSection && (
                        <RfpRequirementsBadge
                            currentSectionId={rfpSection}
                            highlightItems={rfpHighlightItems}
                            highlightAllItemsInSection={rfpHighlightAll}
                        />
                    )}
                    {rfpSection && (
                        <button
                            type="button"
                            onClick={() => setStructureOpen(true)}
                            aria-label="시스템 구조도 보기"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d47a1] hover:bg-[#0a3a8a] active:translate-y-[0.5px] border border-[#0d47a1] shadow-[0_1px_2px_rgba(13,71,161,0.18)] transition-all"
                        >
                            <Workflow size={11} strokeWidth={2.2} className="text-white" />
                            <span className="text-[12px] font-semibold text-white">
                                시스템 구조도
                            </span>
                        </button>
                    )}
                </div>
                {subtitle && (
                    <p className="mt-1 text-[13px] text-[#4a5568]">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}

            {/* 시스템 구조도 모달 */}
            <SystemStructureModal
                open={structureOpen}
                onClose={() => setStructureOpen(false)}
                currentSectionId={rfpSection}
            />
        </div>
    );
}
