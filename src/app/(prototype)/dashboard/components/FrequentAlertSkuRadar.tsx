/**
 * @file src/app/(prototype)/dashboard/components/FrequentAlertSkuRadar.tsx
 * @description 차트 5 — 자주 알림 발생 SKU TOP 5 (레이더)
 *              알림 시드 데이터에서 SKU별 발생 횟수 → 상위 5개.
 */

"use client";

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { STOCK_ALERTS } from "@/data/seed";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_BLUE_SCALE } from "@/components/ui/chart-theme";

export default function FrequentAlertSkuRadar() {
    const counts = new Map<string, { name: string; count: number }>();
    STOCK_ALERTS.forEach((a) => {
        const k = a.skuName.length > 12 ? a.skuName.slice(0, 12) + "…" : a.skuName;
        if (!counts.has(k)) counts.set(k, { name: k, count: 0 });
        counts.get(k)!.count += 1;
    });
    const top5 = Array.from(counts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={top5} outerRadius="75%">
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis
                    dataKey="name"
                    tick={{ fill: "#4a5568", fontSize: 10 }}
                />
                <PolarRadiusAxis
                    angle={30}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                />
                <Radar
                    name="알림 발생"
                    dataKey="count"
                    stroke={CHART_BLUE_SCALE[0]}
                    fill={CHART_BLUE_SCALE[0]}
                    fillOpacity={0.3}
                    strokeWidth={1.8}
                />
                <Tooltip content={<ChartTooltip unit="건" />} />
            </RadarChart>
        </ResponsiveContainer>
    );
}
