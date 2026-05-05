/**
 * @file src/components/common/PageHeader.tsx
 * @description 페이지 상단 공용 헤더 — 타이틀 + 서브타이틀 + RFP 위계 배지 + 액션 슬롯.
 *              모든 9화면에서 일관 사용.
 */

import type { ReactNode } from "react";
import RfpRequirementsBadge from "./RfpRequirementsBadge";

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
                </div>
                {subtitle && (
                    <p className="mt-1 text-[13px] text-[#4a5568]">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    );
}
