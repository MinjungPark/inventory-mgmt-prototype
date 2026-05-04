/**
 * @file src/components/common/PlaceholderScreen.tsx
 * @description Phase 1 골격 — 9개 화면 모두 라우팅 가능한 상태를 만들기 위한 임시 placeholder.
 *              Phase 2/3 에서 각 화면 실제 구현으로 교체.
 */

import { Construction } from "lucide-react";

interface PlaceholderScreenProps {
    title: string;
    subtitle?: string;
    rfpMapping?: string;
}

export default function PlaceholderScreen({
    title,
    subtitle,
    rfpMapping,
}: PlaceholderScreenProps) {
    return (
        <div className="space-y-6">
            {/* 페이지 타이틀 */}
            <div className="border-b border-[#e2e8f0] pb-4">
                <h1 className="text-[20px] font-semibold text-[#1a1a1a] tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-[13px] text-[#4a5568]">{subtitle}</p>
                )}
                {rfpMapping && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#e8f0fb] border border-[#0d47a1]/15">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0d47a1]">
                            RFP
                        </span>
                        <span className="text-[12px] font-medium text-[#0d47a1]">
                            {rfpMapping}
                        </span>
                    </div>
                )}
            </div>

            {/* Placeholder 본문 */}
            <div className="rounded-md border border-dashed border-[#cbd5e1] bg-white p-12 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
                    <Construction size={22} strokeWidth={1.8} className="text-[#718096]" />
                </div>
                <div>
                    <p className="text-[14px] font-semibold text-[#1a1a1a]">
                        화면 골격 준비 완료
                    </p>
                    <p className="mt-1 text-[12px] text-[#718096]">
                        Phase 1 마감 후 본 화면의 콘텐츠가 구성됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
