/**
 * @file src/app/(prototype)/dashboard/components/DailyTrackingLine.tsx
 * @description 차트 3 — 입출고 추이 (라인 차트 / 30일)
 *              30일 트래킹 시드 데이터를 일별 입고·출고 카운트로 집계.
 */

"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TRACKING_EVENTS } from "@/data/seed";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_BLUE_SCALE, CHART_GRID_STROKE, CHART_TICK } from "@/components/ui/chart-theme";

interface DailyPoint {
    day: string;     // "MM/DD"
    inbound: number;
    outbound: number;
}

function buildDaily(): DailyPoint[] {
    const map = new Map<string, DailyPoint>();
    TRACKING_EVENTS.forEach((e) => {
        const d = new Date(e.timestamp);
        const key = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
        if (!map.has(key)) {
            map.set(key, { day: key, inbound: 0, outbound: 0 });
        }
        const p = map.get(key)!;
        if (e.type === "inbound") p.inbound += e.quantity;
        else if (e.type === "outbound") p.outbound += e.quantity;
    });
    return Array.from(map.values()).sort((a, b) => (a.day < b.day ? -1 : 1));
}

export default function DailyTrackingLine() {
    const data = buildDaily();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
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
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                    content={<ChartTooltip unit="개" />}
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
