/**
 * @file src/app/(prototype)/dashboard/components/CategoryTurnoverBar.tsx
 * @description 차트 4 — 카테고리별 재고 회전율 TOP 10 (수평 바)
 */

"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { SKUS } from "@/data/seed";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_BLUE_SCALE, CHART_GRID_STROKE, CHART_TICK } from "@/components/ui/chart-theme";

export default function CategoryTurnoverBar() {
    const top10 = [...SKUS]
        .sort((a, b) => b.turnoverRate - a.turnoverRate)
        .slice(0, 10)
        .map((s) => ({
            name: s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name,
            fullName: s.name,
            value: s.turnoverRate,
        }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={top10}
                layout="vertical"
                margin={{ top: 5, right: 24, left: 8, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} horizontal={false} />
                <XAxis
                    type="number"
                    tick={CHART_TICK}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ ...CHART_TICK, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                />
                <Tooltip
                    cursor={{ fill: "rgba(13,71,161,0.05)" }}
                    content={<ChartTooltip unit="회/일" />}
                />
                <Bar dataKey="value" name="회전율" radius={[0, 4, 4, 0]} maxBarSize={14}>
                    {top10.map((_, idx) => (
                        <Cell
                            key={idx}
                            fill={
                                idx < 3
                                    ? CHART_BLUE_SCALE[0]
                                    : idx < 6
                                        ? CHART_BLUE_SCALE[1]
                                        : CHART_BLUE_SCALE[2]
                            }
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
