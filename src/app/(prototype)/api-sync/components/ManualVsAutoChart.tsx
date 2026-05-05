/**
 * @file src/app/(prototype)/api-sync/components/ManualVsAutoChart.tsx
 * @description 수동 → 자동 전환 비교 차트 — 화면 6의 영업 무기 핵심.
 *
 *  4개 메트릭 비교:
 *   - 처리 건수 (수동 vs 자동)
 *   - 건당 평균 처리 시간 (분)
 *   - 오류율 (%)
 *   - 인건비 (시간)
 *
 *  좌(수동) vs 우(자동)의 명확한 대비 — 한 눈에 자동화 효과 인지.
 */

"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { MANUAL_AUTO_COMPARISON } from "@/data/seed/api-sync-seed";

interface MetricSpec {
    key: keyof typeof MANUAL_AUTO_COMPARISON[number];
    label: string;
    unit: string;
    direction: "higher-better" | "lower-better";
    formatter?: (v: number) => string;
}

const METRICS: MetricSpec[] = [
    {
        key: "processedCount",
        label: "처리 건수",
        unit: "건",
        direction: "higher-better",
        formatter: (v) => v.toLocaleString(),
    },
    {
        key: "avgDurationMin",
        label: "건당 처리 시간",
        unit: "분",
        direction: "lower-better",
        formatter: (v) => v < 1 ? (v * 60).toFixed(0) + "초" : v.toString(),
    },
    {
        key: "errorRate",
        label: "오류율",
        unit: "%",
        direction: "lower-better",
        formatter: (v) => v.toFixed(1),
    },
    {
        key: "laborHours",
        label: "월간 인력 시간",
        unit: "시간",
        direction: "lower-better",
        formatter: (v) => v.toLocaleString(),
    },
];

function changeText(manual: number, auto: number, direction: "higher-better" | "lower-better") {
    if (manual === 0) return "신규";
    const ratio = (auto - manual) / manual;
    const pct = Math.abs(ratio * 100);
    const isImprovement =
        (direction === "higher-better" && auto > manual) ||
        (direction === "lower-better" && auto < manual);
    return {
        improved: isImprovement,
        change: ratio > 0 ? "+" : "",
        pct: pct.toFixed(0),
        label: ratio > 0 ? "증가" : "감소",
    };
}

export default function ManualVsAutoChart() {
    const [manual, auto] = MANUAL_AUTO_COMPARISON;

    return (
        <div className="space-y-4">
            {/* 헤더 — 좌(수동) vs 우(자동) 컬럼 라벨 */}
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                    지표
                </div>
                <div className="col-span-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgba(113,128,150,0.08)] border border-[rgba(113,128,150,0.22)] text-[11px] font-bold text-[#4a5568] uppercase tracking-wider">
                        이전 30일 · 수동
                    </span>
                </div>
                <div className="col-span-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgba(13,71,161,0.08)] border border-[rgba(13,71,161,0.22)] text-[11px] font-bold text-[#0d47a1] uppercase tracking-wider">
                        최근 30일 · 자동
                    </span>
                </div>
                <div className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#718096] text-right">
                    개선 효과
                </div>
            </div>

            {/* 4개 메트릭 비교 행 */}
            {METRICS.map((m) => {
                const manualVal = manual[m.key] as number;
                const autoVal = auto[m.key] as number;
                const max = Math.max(manualVal, autoVal);
                const manualPct = max > 0 ? (manualVal / max) * 100 : 0;
                const autoPct = max > 0 ? (autoVal / max) * 100 : 0;
                const ch = changeText(manualVal, autoVal, m.direction);
                const fmt = m.formatter ?? ((v: number) => v.toLocaleString());

                return (
                    <div
                        key={m.key}
                        className="grid grid-cols-12 gap-3 items-center pb-3 border-b border-[#f1f5f9] last:border-b-0"
                    >
                        {/* 지표명 */}
                        <div className="col-span-3">
                            <p className="text-[13px] font-semibold text-[#1a1a1a]">{m.label}</p>
                            <p className="text-[11px] text-[#718096]">
                                {m.direction === "higher-better" ? "↑ 높을수록 좋음" : "↓ 낮을수록 좋음"}
                            </p>
                        </div>

                        {/* 수동 값 + 막대 */}
                        <div className="col-span-3">
                            <div className="flex items-baseline justify-end gap-1 mb-1">
                                <span className="text-[15px] font-bold text-[#4a5568] tabular-nums">
                                    {fmt(manualVal)}
                                </span>
                                <span className="text-[11px] text-[#94a3b8]">{m.unit}</span>
                            </div>
                            <div className="relative h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                                <div
                                    className="absolute right-0 top-0 h-full rounded-full"
                                    style={{ width: `${manualPct}%`, background: "#94a3b8" }}
                                />
                            </div>
                        </div>

                        {/* 자동 값 + 막대 */}
                        <div className="col-span-3">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-[15px] font-bold text-[#0d47a1] tabular-nums">
                                    {fmt(autoVal)}
                                </span>
                                <span className="text-[11px] text-[#94a3b8]">{m.unit}</span>
                            </div>
                            <div className="relative h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full"
                                    style={{ width: `${autoPct}%`, background: "#0d47a1" }}
                                />
                            </div>
                        </div>

                        {/* 개선 효과 */}
                        <div className="col-span-3 text-right">
                            {typeof ch === "object" && (
                                <div className="inline-flex items-center gap-1.5">
                                    {ch.improved ? (
                                        ch.label === "증가" ? (
                                            <TrendingUp size={13} strokeWidth={2.4} className="text-[#15803d]" />
                                        ) : (
                                            <TrendingDown size={13} strokeWidth={2.4} className="text-[#15803d]" />
                                        )
                                    ) : (
                                        <Minus size={13} strokeWidth={2.4} className="text-[#94a3b8]" />
                                    )}
                                    <span
                                        className={`text-[14px] font-bold tabular-nums ${
                                            ch.improved ? "text-[#15803d]" : "text-[#4a5568]"
                                        }`}
                                    >
                                        {ch.change}
                                        {ch.pct}%
                                    </span>
                                </div>
                            )}
                            {typeof ch === "object" && (
                                <p className="text-[10px] text-[#718096] mt-0.5">
                                    {ch.label} ({ch.improved ? "개선" : "악화"})
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* 종합 인사이트 */}
            <div className="mt-4 p-3 rounded-md bg-[#e8eef6] border border-[#0d47a1]/15">
                <p className="text-[12px] text-[#4a5568] leading-[1.6]">
                    <span className="font-bold text-[#0d47a1]">자동 동기화 도입 효과:</span>{" "}
                    처리량 <span className="font-bold text-[#15803d]">2.3배 증가</span>하면서도
                    인력 시간은 <span className="font-bold text-[#15803d]">95% 절감</span>,
                    오류율은 <span className="font-bold text-[#15803d]">85% 감소</span>했습니다.
                    수동 처리 시 발생하던{" "}
                    <span className="font-semibold">CSV 다운 → 정리 → 업로드 18분 / 건</span>{" "}
                    워크플로우가 <span className="font-semibold">API 호출 24초 / 건</span>으로 압축되었습니다.
                </p>
            </div>
        </div>
    );
}
