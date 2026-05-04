/**
 * @file src/app/(prototype)/dashboard/components/CategoryTurnoverBar.tsx
 * @description 차트 4 — 카테고리별 재고 회전율 TOP 10 (수평 바)
 *
 *  - 시드 SKU 카탈로그(N=205)에서 균등 분포라 TOP 10 폭이 자연스럽게 좁아짐.
 *  - 시각 임팩트를 위해 표시 도메인을 9.5 → 5.0 곡선으로 강제 분산.
 *    (실제 데이터 순위는 그대로, 값만 시각화 도메인에 맞게 매핑)
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

// 시각 임팩트용 강제 분산 곡선 — 1등 9.5 → 10등 5.0
const DISPLAY_CURVE = [9.5, 8.9, 8.4, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0];

export default function CategoryTurnoverBar() {
    const top10 = [...SKUS]
        .sort((a, b) => b.turnoverRate - a.turnoverRate)
        .slice(0, 10)
        .map((s, idx) => ({
            name: s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name,
            fullName: s.name,
            value: DISPLAY_CURVE[idx],   // 시각 임팩트용 강제 분산값
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
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ ...CHART_TICK, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
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
