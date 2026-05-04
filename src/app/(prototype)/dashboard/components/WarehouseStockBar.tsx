/**
 * @file src/app/(prototype)/dashboard/components/WarehouseStockBar.tsx
 * @description 차트 2 — 창고별 보유 재고 (수직 바 / 3창고)
 */

"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WAREHOUSES } from "@/data/seed";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_BLUE_SCALE, CHART_GRID_STROKE, CHART_TICK } from "@/components/ui/chart-theme";

export default function WarehouseStockBar() {
    const data = WAREHOUSES.map((w) => ({
        name: w.name,
        SKU: w.skuCount,
        utilization: w.utilizationPct,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
                <XAxis
                    dataKey="name"
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
                    content={<ChartTooltip unit="개" />}
                />
                <Bar dataKey="SKU" name="보유 SKU" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {data.map((_, idx) => (
                        <Cell key={idx} fill={CHART_BLUE_SCALE[idx % CHART_BLUE_SCALE.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
