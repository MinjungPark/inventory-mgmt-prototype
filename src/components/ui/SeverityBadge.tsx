/**
 * @file src/components/ui/SeverityBadge.tsx
 * @description 의미 색상 배지 — ENERTORK 베스트셀러 배지 정통 스펙 미러링.
 *
 *  DevTools 추출값 (font-size 10 → 11 IOM 룰 준수):
 *    bg:           rgba(seed, 0.08)
 *    border:       rgba(seed, 0.22)
 *    color:        진한 hex
 *    font-size:    11px (IOM 최소 데이터 폰트 룰)
 *    letter-spacing: 0.2px
 *    border-radius: 5px
 *    padding:      2px 6px
 *    font-weight:  700
 *    line-height:  1.4
 */

import type { ReactNode } from "react";

export type Severity = "critical" | "warning" | "ok" | "info" | "neutral";

interface SeverityBadgeProps {
    severity: Severity;
    children: ReactNode;
    /** 좌측 아이콘 (lucide 등) */
    icon?: ReactNode;
    /** 추가 클래스 (예: 위치 조정) */
    className?: string;
}

const STYLES: Record<Severity, { bg: string; border: string; color: string }> = {
    critical: {
        bg: "rgba(220, 38, 38, 0.08)",
        border: "rgba(220, 38, 38, 0.22)",
        color: "#991b1b",
    },
    warning: {
        // ENERTORK 정통 베스트셀러 톤
        bg: "rgba(234, 124, 46, 0.08)",
        border: "rgba(234, 124, 46, 0.22)",
        color: "#c2410c",
    },
    ok: {
        bg: "rgba(34, 197, 94, 0.08)",
        border: "rgba(34, 197, 94, 0.22)",
        color: "#15803d",
    },
    info: {
        bg: "rgba(13, 71, 161, 0.08)",
        border: "rgba(13, 71, 161, 0.22)",
        color: "#0d47a1",
    },
    neutral: {
        bg: "rgba(113, 128, 150, 0.08)",
        border: "rgba(113, 128, 150, 0.22)",
        color: "#4a5568",
    },
};

export default function SeverityBadge({
    severity,
    children,
    icon,
    className = "",
}: SeverityBadgeProps) {
    const s = STYLES[severity];
    return (
        <span
            className={`inline-flex items-center gap-1 font-bold text-[11px] leading-[1.4] ${className}`}
            style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
                borderRadius: 5,
                padding: "2px 6px",
                letterSpacing: "0.2px",
            }}
        >
            {icon}
            {children}
        </span>
    );
}
