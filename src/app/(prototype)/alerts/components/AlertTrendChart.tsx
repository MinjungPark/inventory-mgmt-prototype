/**
 * @file src/app/(prototype)/alerts/components/AlertTrendChart.tsx
 * @description 30일 알림 발생 추이 — 스택 바 (긴급 + 주의).
 */

"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import ChartTooltip from "@/components/ui/ChartTooltip";
import {
    CHART_GRID_STROKE,
    CHART_TICK,
} from "@/components/ui/chart-theme";
import { buildAlertTrend } from "@/data/seed/alerts-helpers";

// 차트 톤은 outline 배지와 동일 (캡틴 명시) — 배지 배경 + 보더 그대로 차트 fill·stroke로 사용
const WARNING_FILL   = "rgba(234, 124, 46, 0.08)";
const WARNING_STROKE = "rgba(234, 124, 46, 0.45)";   // 보더보다 진하게 (8%→45%)
const CRITICAL_FILL   = "rgba(220, 38, 38, 0.08)";
const CRITICAL_STROKE = "rgba(220, 38, 38, 0.45)";

export default function AlertTrendChart() {
    const data = buildAlertTrend();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
                <XAxis
                    dataKey="day"
                    tick={CHART_TICK}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                    interval={Math.max(1, Math.floor(data.length / 8))}
                />
                <YAxis
                    tick={CHART_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.toLocaleString()}
                />
                <Tooltip
                    cursor={{ fill: "rgba(13,71,161,0.05)" }}
                    content={<ChartTooltip unit="건" />}
                />
                <Legend
                    iconType="circle"
                    iconSize={9}
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    formatter={(value) => {
                        const isCritical = value === "긴급";
                        return (
                            <span style={{ color: isCritical ? "#991b1b" : "#c2410c", fontWeight: 600 }}>
                                {value}
                            </span>
                        );
                    }}
                />
                <Bar
                    dataKey="warning"
                    name="주의"
                    stackId="a"
                    fill={WARNING_FILL}
                    stroke={WARNING_STROKE}
                    strokeWidth={1}
                    radius={[0, 0, 0, 0]}
                    maxBarSize={14}
                />
                <Bar
                    dataKey="critical"
                    name="긴급"
                    stackId="a"
                    fill={CRITICAL_FILL}
                    stroke={CRITICAL_STROKE}
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={14}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
