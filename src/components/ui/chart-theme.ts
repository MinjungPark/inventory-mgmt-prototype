/**
 * @file src/components/ui/chart-theme.ts
 * @description Recharts 공용 차트 디자인 토큰 — 종합 지시서 8장 룰 적용.
 *              Primary `#0d47a1` 기준 모노톤 블루 + 의미 색상(적/황/녹).
 */

// ─── 색상 팔레트 ────────────────────────────────────────────────────────────

export const CHART_PRIMARY = "#0d47a1";

export const CHART_BLUE_SCALE = [
    "#0d47a1", // primary
    "#1976d2",
    "#42a5f5",
    "#90caf9",
    "#bbdefb",
] as const;

export const CHART_CATEGORICAL = [
    "#0d47a1", // 의류
    "#1976d2", // 신발
    "#42a5f5", // 잡화
    "#90caf9", // 화장품
    "#5e92f3", // 라이프스타일
] as const;

// ENERTORK 톤 — 텍스트/배지용 dark 단계 (배경 위 가독성)
export const CHART_SEVERITY = {
    critical: "#991b1b",
    warning: "#c2410c",
    ok: "#15803d",
} as const;

/**
 * 차트 fill 전용 base 톤 — 누적/스택 차트에서 구분 명확.
 *  - critical : #b34530 (차분한 벽돌-크림슨)
 *  - warning  : #fdba74 (옅은 살구 — 배지 살구 hue와 동일 계열, 채도 한 톤 다운)
 *  - ok       : #22c55e
 */
export const CHART_SEVERITY_BASE = {
    critical: "#b34530",
    warning: "#fdba74",
    ok: "#22c55e",
} as const;

// ─── 축 / 그리드 / 폰트 ─────────────────────────────────────────────────────

export const CHART_GRID_STROKE = "#e0e0e0";
export const CHART_AXIS_STROKE = "#cbd5e1";

export const CHART_TICK = {
    fill: "#718096",
    fontSize: 12,
} as const;

export const CHART_LABEL = {
    fill: "#4a5568",
    fontSize: 13,
} as const;

// ─── 카드 / 컨테이너 ────────────────────────────────────────────────────────

export const CHART_CARD =
    "bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

export const CHART_CARD_HEADER =
    "flex items-center gap-2 mb-4";

export const CHART_CARD_TITLE =
    "text-[13px] font-semibold text-[#1a1a1a]";

export const CHART_CARD_SUBTITLE =
    "text-[11px] text-[#718096]";
