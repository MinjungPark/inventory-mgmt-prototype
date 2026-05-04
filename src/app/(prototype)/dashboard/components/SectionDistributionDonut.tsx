/**
 * @file src/app/(prototype)/dashboard/components/SectionDistributionDonut.tsx
 * @description 차트 1 — 매장 섹션별 재고 분포 (도넛 / 5섹션)
 */

"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { STORE_SECTIONS } from "@/data/seed";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_CATEGORICAL } from "@/components/ui/chart-theme";

export default function SectionDistributionDonut() {
    const data = STORE_SECTIONS.map((s) => ({
        name: s.category,
        value: s.skuCount,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={92}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={1.5}
                    labelLine={false}
                >
                    {data.map((_, idx) => (
                        <Cell key={idx} fill={CHART_CATEGORICAL[idx % CHART_CATEGORICAL.length]} />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltip unit="개" />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                        <span className="text-[11px] text-[#4a5568] ml-1">{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
