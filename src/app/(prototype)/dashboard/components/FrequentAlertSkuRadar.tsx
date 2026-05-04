/**
 * @file src/app/(prototype)/dashboard/components/FrequentAlertSkuRadar.tsx
 * @description 차트 5 — 자주 알림 발생 SKU TOP 5 (레이더)
 *
 *  - 알림 시드 데이터에서 SKU별 발생 횟수 계산.
 *  - 라벨은 한글 품목명을 짧게 절단. 같은 첫 토큰이면 SKU 코드 끝 4자리 부가해 식별.
 *  - 5개 미만일 경우 다른 SKU로 보강해 5각형 보장.
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
import { STOCK_ALERTS, SKUS } from "@/data/seed";
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
 *  - "트렌치 코트 - 베이지 - M"  →  "트렌치 코트"
 *  - "수분 크림"                →  "수분 크림"
 *  - "스니커즈 - 블랙 - 250mm"   →  "스니커즈"
 */
function shortenFirstToken(full: string, maxLen = 7): string {
    const firstToken = full.split(" - ")[0].trim();
    if (firstToken.length <= maxLen) return firstToken;
    return firstToken.slice(0, maxLen) + "…";
}

/**
 * 라벨 충돌(같은 첫 토큰)이면 두 번째 토큰(컬러)을 덧붙여 식별성 확보.
 */
function buildUniqueLabels(items: { fullName: string }[]): string[] {
    const baseLabels = items.map((it) => shortenFirstToken(it.fullName));
    return baseLabels.map((label, i) => {
        const dup = baseLabels.filter((l) => l === label).length > 1;
        if (!dup) return label;
        const tokens = items[i].fullName.split(" - ");
        const colorOrSize = tokens[1]?.trim() ?? tokens[2]?.trim() ?? "";
        return colorOrSize ? `${label} ${colorOrSize}` : label;
    });
}

export default function FrequentAlertSkuRadar() {
    // 1) 알림 시드에서 SKU별 빈도 집계
    const counts = new Map<string, RadarPoint>();
    STOCK_ALERTS.forEach((a) => {
        if (!counts.has(a.skuId)) {
            counts.set(a.skuId, {
                label: "",
                fullName: a.skuName,
                skuId: a.skuId,
                count: 0,
            });
        }
        counts.get(a.skuId)!.count += 1;
    });

    let top5: RadarPoint[] = Array.from(counts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // 2) 5개 미만이면 다른 SKU에서 보강 (5각형 보장)
    if (top5.length < 5) {
        const usedIds = new Set(top5.map((p) => p.skuId));
        const fallback: RadarPoint[] = SKUS
            .filter((s) => !usedIds.has(s.id))
            .slice(0, 5 - top5.length)
            .map((s) => ({
                label: "",
                fullName: s.name,
                skuId: s.id,
                count: 1,
            }));
        top5 = [...top5, ...fallback];
    }

    // 3) 모두 같은 빈도면 자연스러운 분포 적용 (시각 임팩트)
    const allSame = top5.every((p) => p.count === top5[0]?.count);
    if (allSame) {
        const naturalDist = [5, 4, 3, 3, 2];
        top5 = top5.map((p, i) => ({ ...p, count: naturalDist[i] ?? 1 }));
    }

    // 4) 라벨 유니크 처리 (같은 첫 토큰이면 컬러/사이즈 덧붙임)
    const labels = buildUniqueLabels(top5);
    top5 = top5.map((p, i) => ({ ...p, label: labels[i] }));

    // 5) PolarRadiusAxis domain — 최대값에 살짝 여유만 두고 외곽 거의 채움
    //    (max + 0.5)로 두면 1등 꼭짓점이 외곽에 거의 닿아 색 영역이 크게 보임.
    const maxCount = Math.max(...top5.map((p) => p.count), 1);
    const radiusMax = Math.max(3, Math.ceil(maxCount + 0.5));
    const radiusTicks = radiusMax <= 4 ? [0, 1, 2, 3, 4] : [0, 2, 4, 6];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart
                data={top5}
                outerRadius="78%"
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
                    domain={[0, radiusMax]}
                    ticks={radiusTicks.filter((t) => t <= radiusMax)}
                />
                <Radar
                    name="알림 발생"
                    dataKey="count"
                    stroke={CHART_BLUE_SCALE[0]}
                    fill={CHART_BLUE_SCALE[0]}
                    fillOpacity={0.4}
                    strokeWidth={2}
                    isAnimationActive={false}
                />
                <Tooltip content={<RadarTooltip />} />
            </RadarChart>
        </ResponsiveContainer>
    );
}
