/**
 * @file src/components/ui/SeverityBadge.tsx
 * @description 의미 색상 배지 — ENERTORK 베스트셀러 배지 정통 스펙 미러링.
 *
 *  variant:
 *   - outline (기본) : 옅은 배경 + 보더 + 진한 텍스트  (베스트셀러 스타일)
 *   - solid          : 진한 배경 + 흰 텍스트          (강조용)
 *
 *  스펙 (ENERTORK DevTools 추출, font-size IOM 룰로 11px 적용):
 *    font-size:      11px
 *    letter-spacing: 0.2px
 *    border-radius:  5px
 *    padding:        2px 6px
 *    font-weight:    700
 *    line-height:    1.4
 */

import type { ReactNode } from "react";

export type Severity = "critical" | "warning" | "ok" | "info" | "neutral";
export type SeverityVariant = "outline" | "solid";

interface SeverityBadgeProps {
    severity: Severity;
    variant?: SeverityVariant;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}

interface ToneSpec {
    bg: string;
    border: string;
    color: string;
}

const OUTLINE_STYLES: Record<Severity, ToneSpec> = {
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

const SOLID_STYLES: Record<Severity, ToneSpec> = {
    critical: {
        bg: "#b34530",       // 차분한 벽돌-크림슨 (캡틴 캡쳐 톤)
        border: "#b34530",
        color: "#ffffff",
    },
    warning: {
        bg: "#ea7c2e",       // ENERTORK --brand-orange
        border: "#ea7c2e",
        color: "#ffffff",
    },
    ok: {
        bg: "#22c55e",
        border: "#22c55e",
        color: "#ffffff",
    },
    info: {
        bg: "#0d47a1",
        border: "#0d47a1",
        color: "#ffffff",
    },
    neutral: {
        bg: "#64748b",
        border: "#64748b",
        color: "#ffffff",
    },
};

export default function SeverityBadge({
    severity,
    variant = "outline",
    children,
    icon,
    className = "",
}: SeverityBadgeProps) {
    const s = variant === "solid" ? SOLID_STYLES[severity] : OUTLINE_STYLES[severity];
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
