/**
 * @file src/app/(prototype)/dashboard/components/CategoryTurnoverBar.tsx
 * @description 차트 4 — 카테고리별 재고 회전율 (수평 바, 5 카테고리)
 *
 *  - 본질: 카테고리(의류·신발·잡화·화장품·라이프스타일) 평균 회전율 비교.
 *  - TOP 회전율 SKU 테이블과 명확히 구분 (그쪽은 개별 SKU 순위).
 *  - 카테고리 안에서의 SKU 회전율 평균을 계산해 막대로 시각화.
 */

"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { SKUS } from "@/data/seed";
import type { ProductCategory } from "@/types/inventory";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_BLUE_SCALE, CHART_GRID_STROKE, CHART_TICK } from "@/components/ui/chart-theme";

const CATEGORY_ORDER: ProductCategory[] = [
    "화장품",
    "의류",
    "잡화",
    "신발",
    "라이프스타일",
];

export default function CategoryTurnoverBar() {
    // 카테고리별 평균 회전율 계산
    const data = CATEGORY_ORDER.map((cat) => {
        const items = SKUS.filter((s) => s.category === cat);
        const avg = items.length
            ? items.reduce((sum, s) => sum + s.turnoverRate, 0) / items.length
            : 0;
        return {
            name: cat,
            value: +avg.toFixed(2),
            count: items.length,
        };
    }).sort((a, b) => b.value - a.value);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 8, bottom: 5 }}
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
                    tick={{ ...CHART_TICK, fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={88}
                />
                <Tooltip
                    cursor={{ fill: "rgba(13,71,161,0.05)" }}
                    content={<ChartTooltip unit="회/월" />}
                />
                <Bar dataKey="value" name="평균 회전율" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    {data.map((_, idx) => (
                        <Cell
                            key={idx}
                            fill={CHART_BLUE_SCALE[idx % CHART_BLUE_SCALE.length]}
                        />
                    ))}
                    <LabelList
                        dataKey="value"
                        position="right"
                        fill="#0d47a1"
                        fontSize={12}
                        fontWeight={600}
                        formatter={(v) => Number(v).toFixed(2)}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
