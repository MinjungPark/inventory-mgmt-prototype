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
    /** 배지에 표시할 라벨 (예: '2-1 ①', '2-1 종합') */
    rfpBadgeLabel?: string;
    /** 배지 호버 시 굵은 검정으로 강조할 항목 id 배열 (예: ['2-1-①']) */
    rfpHighlightItems?: string[];
    /** 또는 섹션 통째로 강조 — 종합 화면용 (예: '2-1') */
    rfpHighlightSection?: string;
    /** @deprecated rfpBadgeLabel 사용 — 하위 호환 */
    rfpMapping?: string;
    actions?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    rfpBadgeLabel,
    rfpHighlightItems,
    rfpHighlightSection,
    rfpMapping,
    actions,
}: PageHeaderProps) {
    const badgeLabel = rfpBadgeLabel ?? rfpMapping;
    const showBadge = !!badgeLabel;

    return (
        <div className="border-b border-[#e2e8f0] pb-4 mb-6 flex items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[20px] font-semibold text-[#1a1a1a] tracking-tight">
                        {title}
                    </h1>
                    {showBadge && (
                        <RfpRequirementsBadge
                            badgeLabel={badgeLabel as string}
                            highlightItems={rfpHighlightItems}
                            highlightSection={rfpHighlightSection}
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
