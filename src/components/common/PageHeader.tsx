/**
 * @file src/components/common/PageHeader.tsx
 * @description 페이지 상단 공용 헤더 — 타이틀 + 서브타이틀 + RFP 배지 + 액션 슬롯.
 *              모든 9화면에서 일관 사용.
 */

import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    rfpMapping?: string;
    actions?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    rfpMapping,
    actions,
}: PageHeaderProps) {
    return (
        <div className="border-b border-[#e2e8f0] pb-4 mb-6 flex items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[18px] font-semibold text-[#1a1a1a] tracking-tight">
                        {title}
                    </h1>
                    {rfpMapping && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#e8f0fb] border border-[#0d47a1]/15">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d47a1]">
                                RFP
                            </span>
                            <span className="text-[11px] font-medium text-[#0d47a1]">
                                {rfpMapping}
                            </span>
                        </span>
                    )}
                </div>
                {subtitle && (
                    <p className="mt-1 text-[12px] text-[#4a5568]">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    );
}
