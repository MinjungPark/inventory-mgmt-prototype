/**
 * @file src/app/(prototype)/dashboard/components/KpiCard.tsx
 * @description 통합 대시보드 — KPI 카드 (5종 공용)
 *              ecogeo aqualab `bg-[#111927] border border-white/[0.08] rounded-xl` 패턴의
 *              라이트 톤 미러링.
 */

import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
    label: string;
    value: string;
    unit?: string;
    Icon: LucideIcon;
    /** 강조 톤 — 보통(default) / 위험(critical) / 강조(accent) */
    tone?: "default" | "critical" | "accent";
    /** 전기 대비 추이 */
    trend?: {
        value: number;        // 증감률 (예: 2.4)
        direction: "up" | "down";
        label?: string;       // "전주 대비"
    };
}

const TONE_STYLES: Record<NonNullable<KpiCardProps["tone"]>, {
    valueColor: string;
    iconBg: string;
    iconColor: string;
}> = {
    default: {
        valueColor: "text-[#1a1a1a]",
        iconBg: "bg-[#e8eef6]",
        iconColor: "text-[#0d47a1]",
    },
    accent: {
        valueColor: "text-[#0d47a1]",
        iconBg: "bg-gradient-to-br from-[#0d47a1] to-[#1976d2]",
        iconColor: "text-white",
    },
    critical: {
        valueColor: "text-[#d32f2f]",
        iconBg: "bg-[#fef2f2]",
        iconColor: "text-[#d32f2f]",
    },
};

export default function KpiCard({
    label,
    value,
    unit,
    Icon,
    tone = "default",
    trend,
}: KpiCardProps) {
    const styles = TONE_STYLES[tone];

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(13,71,161,0.08)] hover:border-[#cbd5e1] transition-all group">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-[#718096]">{label}</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-[24px] font-bold tracking-tight ${styles.valueColor}`}>
                            {value}
                        </span>
                        {unit && (
                            <span className="text-[13px] text-[#718096] font-medium">{unit}</span>
                        )}
                    </div>
                </div>

                <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${styles.iconBg}`}
                >
                    <Icon size={18} strokeWidth={2} className={styles.iconColor} />
                </div>
            </div>

            {trend && (
                <div className="mt-3 flex items-center gap-1.5 text-[12px]">
                    {trend.direction === "up" ? (
                        <TrendingUp
                            size={12}
                            strokeWidth={2.2}
                            className={tone === "critical" ? "text-[#d32f2f]" : "text-[#388e3c]"}
                        />
                    ) : (
                        <TrendingDown
                            size={12}
                            strokeWidth={2.2}
                            className={tone === "critical" ? "text-[#388e3c]" : "text-[#d32f2f]"}
                        />
                    )}
                    <span
                        className={`font-semibold ${
                            (trend.direction === "up") === (tone !== "critical")
                                ? "text-[#388e3c]"
                                : "text-[#d32f2f]"
                        }`}
                    >
                        {trend.direction === "up" ? "+" : "−"}
                        {Math.abs(trend.value)}%
                    </span>
                    <span className="text-[#718096]">{trend.label ?? "전주 대비"}</span>
                </div>
            )}
        </div>
    );
}
