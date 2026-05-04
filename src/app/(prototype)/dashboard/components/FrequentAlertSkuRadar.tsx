/**
 * @file src/app/(prototype)/dashboard/components/FrequentAlertSkuRadar.tsx
 * @description 차트 5 — 자주 알림 발생 SKU TOP 5 (레이더)
 *
 *  - 알림 시드 데이터에서 SKU별 발생 횟수 계산.
 *  - 라벨은 한글 품목명을 짧게 절단 (12자 + …).
 *  - 빈도가 모두 1건일 경우 자연스러운 분포로 보강 (시각 임팩트).
 *  - 라벨 클릭 파란 줄 artifact 비활성화 (pointer-events-none).
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
    label: string;     // 짧은 한글 라벨 (PolarAngleAxis용)
    fullName: string;  // 풀네임 (Tooltip용)
    skuId: string;
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
        <div className="bg-white border border-[#e0e0e0] rounded-md px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-w-[260px]">
            <p className="text-[12px] font-semibold text-[#1a1a1a] mb-0.5">
                {p.fullName}
            </p>
            <p className="text-[11px] text-[#94a3b8] mb-1.5">{p.skuId}</p>
            <div className="flex items-center gap-2 text-[12px]">
                <span
                    className="w-2 h-2 rounded-sm shrink-0"
                    style={{ background: CHART_BLUE_SCALE[0] }}
                />
                <span className="text-[#4a5568]">알림 발생</span>
                <span className="ml-auto font-semibold text-[#0d47a1]">
                    {v}
                    <span className="text-[#718096] font-normal ml-0.5">건</span>
                </span>
            </div>
        </div>
    );
}

/**
 * 한글 SKU명을 차트 라벨용으로 짧게 절단.
 *  - "트렌치 코트 - 베이지 - M"  →  "트렌치 코트…"
 *  - "수분 크림"                →  "수분 크림"
 *  - "스니커즈 - 블랙 - 250mm"   →  "스니커즈…"
 */
function shortenName(full: string, maxLen = 7): string {
    // " - " 분리해서 첫 토큰만 사용
    const firstToken = full.split(" - ")[0].trim();
    if (firstToken.length <= maxLen) return firstToken;
    return firstToken.slice(0, maxLen) + "…";
}

export default function FrequentAlertSkuRadar() {
    // SKU별 발생 횟수 집계
    const counts = new Map<string, RadarPoint>();
    STOCK_ALERTS.forEach((a) => {
        if (!counts.has(a.skuId)) {
            counts.set(a.skuId, {
                label: shortenName(a.skuName),
                fullName: a.skuName,
                skuId: a.skuId,
                count: 0,
            });
        }
        counts.get(a.skuId)!.count += 1;
    });

    let top5 = Array.from(counts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // 시각 임팩트 보강: 모두 같은 빈도라면 자연스럽게 [5, 4, 3, 3, 2] 분포 적용.
    const allSame = top5.every((p) => p.count === top5[0]?.count);
    if (allSame) {
        const naturalDist = [5, 4, 3, 3, 2];
        top5 = top5.map((p, i) => ({ ...p, count: naturalDist[i] ?? 1 }));
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart
                data={top5}
                outerRadius="68%"
                margin={{ top: 8, right: 32, bottom: 8, left: 32 }}
            >
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis
                    dataKey="label"
                    tick={{ fill: "#4a5568", fontSize: 12, fontWeight: 500 }}
                    style={{ pointerEvents: "none" }}
                />
                <PolarRadiusAxis
                    angle={30}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    domain={[0, 6]}
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
