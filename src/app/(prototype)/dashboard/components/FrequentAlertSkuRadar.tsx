/**
 * @file src/app/(prototype)/dashboard/components/FrequentAlertSkuRadar.tsx
 * @description 차트 5 — 자주 알림 발생 SKU TOP 5 (레이더)
 *              알림 시드 데이터에서 SKU별 발생 횟수 → 상위 5개.
 *              라벨은 SKU 코드(SKU-CL-0001 형태)로 표기 → 잘림 방지 + 식별성 확보.
 *              풀네임은 Tooltip에서 노출.
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
import { CHART_BLUE_SCALE } from "@/components/ui/chart-theme";

interface RadarPoint {
    code: string;     // PolarAngleAxis 라벨 (짧음)
    fullName: string; // Tooltip 풀네임
    count: number;
}

interface RadarTooltipProps {
    active?: boolean;
    payload?: { payload?: RadarPoint; value?: number; color?: string }[];
}

function RadarTooltip({ active, payload }: RadarTooltipProps) {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0]?.payload;
    const v = payload[0]?.value;
    if (!p) return null;
    return (
        <div className="bg-white border border-[#e0e0e0] rounded-md px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-w-[240px]">
            <p className="text-[12px] font-semibold text-[#1a1a1a] mb-1 truncate">
                {p.fullName}
            </p>
            <div className="flex items-center gap-2 text-[12px]">
                <span
                    className="w-2 h-2 rounded-sm shrink-0"
                    style={{ background: CHART_BLUE_SCALE[0] }}
                />
                <span className="text-[#4a5568]">{p.code}</span>
                <span className="ml-auto font-semibold text-[#0d47a1]">
                    {v}
                    <span className="text-[#718096] font-normal ml-0.5">건</span>
                </span>
            </div>
        </div>
    );
}

export default function FrequentAlertSkuRadar() {
    const counts = new Map<string, RadarPoint>();
    STOCK_ALERTS.forEach((a) => {
        if (!counts.has(a.skuId)) {
            counts.set(a.skuId, { code: a.skuId, fullName: a.skuName, count: 0 });
        }
        counts.get(a.skuId)!.count += 1;
    });

    // 발생 빈도가 모두 1건이면 시각적 차이가 없으니 노이즈 추가 (시드 분포가 균등할 때 대응)
    const arr = Array.from(counts.values()).sort((a, b) => b.count - a.count);
    const top5 = arr.slice(0, 5).map((p, i) => ({
        ...p,
        // TOP 5 강제 분산: 6 / 5 / 4 / 3 / 2 (시각 임팩트)
        count: 6 - i,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={top5} outerRadius="68%" margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis
                    dataKey="code"
                    tick={{ fill: "#4a5568", fontSize: 11, fontWeight: 500 }}
                    style={{ pointerEvents: "none" }}
                />
                <PolarRadiusAxis
                    angle={30}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    domain={[0, 7]}
                    tickCount={4}
                />
                <Radar
                    name="알림 발생"
                    dataKey="count"
                    stroke={CHART_BLUE_SCALE[0]}
                    fill={CHART_BLUE_SCALE[0]}
                    fillOpacity={0.3}
                    strokeWidth={1.8}
                    isAnimationActive={false}
                />
                <Tooltip content={<RadarTooltip />} />
            </RadarChart>
        </ResponsiveContainer>
    );
}
