/**
 * @file src/app/(prototype)/tracking/components/DailyTrendLine.tsx
 * @description 일별 입출고 추이 — Recharts 라인 차트 (입고 / 출고 2 라인).
 *              기간 prop에 따라 X축 도메인 자동 조정.
 */

"use client";

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import ChartTooltip from "@/components/ui/ChartTooltip";
import {
    CHART_BLUE_SCALE,
    CHART_GRID_STROKE,
    CHART_TICK,
} from "@/components/ui/chart-theme";
import { buildDailyTrend } from "@/data/seed/tracking-helpers";
import { TRACKING_EVENTS } from "@/data/seed";
import type { TrackingEvent } from "@/types/inventory";

interface DailyTrendLineProps {
    /** 표시할 기간 (일 단위). undefined 면 전체. */
    days?: number;
}

function filterByDays(events: TrackingEvent[], days?: number): TrackingEvent[] {
    if (!days) return events;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return events.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
}

export default function DailyTrendLine({ days }: DailyTrendLineProps) {
    const filtered = filterByDays(TRACKING_EVENTS, days);
    const data = buildDailyTrend(filtered);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
                <XAxis
                    dataKey="day"
                    tick={CHART_TICK}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                    interval={Math.max(0, Math.floor(data.length / 8))}
                />
                <YAxis
                    tick={CHART_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.toLocaleString()}
                />
                <Tooltip
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                    content={<ChartTooltip unit="건" />}
                />
                <Legend
                    iconType="circle"
                    iconSize={9}
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    formatter={(value) => <span className="text-[#4a5568]">{value}</span>}
                />
                <Line
                    type="monotone"
                    dataKey="inbound"
                    name="입고"
                    stroke={CHART_BLUE_SCALE[0]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="outbound"
                    name="출고"
                    stroke={CHART_BLUE_SCALE[2]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
