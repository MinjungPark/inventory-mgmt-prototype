/**
 * @file src/app/(prototype)/dashboard/components/WeeklyInOutStack.tsx
 * @description 차트 6 — 일별 신규 입고 vs 출고 (스택 바, 최근 7일)
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
import { TRACKING_EVENTS } from "@/data/seed";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_BLUE_SCALE, CHART_GRID_STROKE, CHART_TICK } from "@/components/ui/chart-theme";

interface DailyPoint {
    day: string;
    inbound: number;
    outbound: number;
}

function buildLast7(): DailyPoint[] {
    const map = new Map<string, DailyPoint>();
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

    TRACKING_EVENTS.forEach((e) => {
        const t = new Date(e.timestamp).getTime();
        if (t < cutoff) return;
        const d = new Date(e.timestamp);
        const key = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
        if (!map.has(key)) {
            map.set(key, { day: key, inbound: 0, outbound: 0 });
        }
        const p = map.get(key)!;
        if (e.type === "inbound") p.inbound += 1;
        else if (e.type === "outbound") p.outbound += 1;
    });

    return Array.from(map.values())
        .sort((a, b) => (a.day < b.day ? -1 : 1))
        .slice(-7);
}

export default function WeeklyInOutStack() {
    const data = buildLast7();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
                <XAxis
                    dataKey="day"
                    tick={CHART_TICK}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
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
                    formatter={(value) => <span className="text-[#4a5568]">{value}</span>}
                />
                <Bar
                    dataKey="inbound"
                    name="입고"
                    stackId="a"
                    fill={CHART_BLUE_SCALE[0]}
                    radius={[0, 0, 0, 0]}
                    maxBarSize={32}
                />
                <Bar
                    dataKey="outbound"
                    name="출고"
                    stackId="a"
                    fill={CHART_BLUE_SCALE[2]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
