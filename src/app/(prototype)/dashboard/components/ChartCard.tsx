/**
 * @file src/app/(prototype)/dashboard/components/ChartCard.tsx
 * @description 차트 카드 공용 래퍼 — 흰색 배경 + 6px 라운드 + 미세 그림자 + 헤더(아이콘 + 타이틀 + 서브)
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ChartCardProps {
    Icon: LucideIcon;
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    /** 차트 영역 높이 (px) */
    height?: number;
    children: ReactNode;
    /** col-span 제어용 외부 클래스 */
    className?: string;
}

export default function ChartCard({
    Icon,
    title,
    subtitle,
    actions,
    height = 280,
    children,
    className = "",
}: ChartCardProps) {
    return (
        <div
            className={`bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Icon size={14} strokeWidth={2} className="text-[#0d47a1]" />
                    <div className="flex flex-col leading-tight">
                        <h3 className="text-[13px] font-semibold text-[#1a1a1a]">{title}</h3>
                        {subtitle && (
                            <span className="text-[11px] text-[#718096] mt-0.5">{subtitle}</span>
                        )}
                    </div>
                </div>
                {actions && <div className="flex items-center gap-1.5">{actions}</div>}
            </div>
            <div style={{ height }} className="w-full">
                {children}
            </div>
        </div>
    );
}
