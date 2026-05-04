/**
 * @file src/app/(prototype)/tracking/components/FlowSankey.tsx
 * @description 매장 ↔ 창고 흐름 SVG Sankey — 정공형 (캡틴 명시: 시각적으로 가장 강렬).
 *
 *  좌측: 출발지(공급사 + 본사 창고 + 외부 위탁 창고 + 매장 섹션)
 *  우측: 도착지(매장 섹션 + 본사 창고 + 매장 백창고)
 *  곡선 띠: 두께 = 유량(quantity) 비례, 색 = 입고/출고/이동/반품 유형
 */

"use client";

import { useMemo, useState } from "react";
import type { TrackingLocation, TrackingType } from "@/types/inventory";
import {
    buildFlowLinks,
    labelForLocation,
    TYPE_COLOR,
    TYPE_LABEL,
} from "@/data/seed/tracking-helpers";

// ─── 노드 카테고리 정의 ────────────────────────────────────────────────────

const SOURCE_ORDER: TrackingLocation[] = [
    "VENDOR",
    "WH-1",
    "WH-2",
    "WH-3",
    "1F-A", "1F-B", "1F-C", "2F-A", "2F-B", "2F-C", "3F-A",
];
const TARGET_ORDER: TrackingLocation[] = [
    "WH-1",
    "WH-2",
    "1F-A", "1F-B", "1F-C", "2F-A", "2F-B", "2F-C", "3F-A",
];

// ─── 레이아웃 상수 ─────────────────────────────────────────────────────────

const VIEW_W = 920;
const VIEW_H = 560;
const NODE_W = 10;
const NODE_GAP = 8;
const PADDING_TOP = 32;
const PADDING_BOTTOM = 24;
const LEFT_LABEL_W = 180;
const RIGHT_LABEL_W = 180;
const LEFT_X = LEFT_LABEL_W;
const RIGHT_X = VIEW_W - RIGHT_LABEL_W - NODE_W;

// ─── Sankey 데이터 가공 ────────────────────────────────────────────────────

interface NodePos {
    id: TrackingLocation;
    label: string;
    x: number;
    y: number;
    height: number;
    side: "source" | "target";
    totalValue: number;
    cursorIn: number;   // target 측에서 입력 누적 y
    cursorOut: number;  // source 측에서 출력 누적 y
}

interface RenderLink {
    source: NodePos;
    target: NodePos;
    value: number;
    type: TrackingType;
    sy0: number; // source 측 띠 시작 y
    sy1: number; // source 측 띠 끝 y
    ty0: number; // target 측 띠 시작 y
    ty1: number; // target 측 띠 끝 y
}

function layoutNodes(
    order: TrackingLocation[],
    side: "source" | "target",
    totalsById: Map<TrackingLocation, number>,
    grandTotal: number,
): NodePos[] {
    const present = order.filter((id) => (totalsById.get(id) ?? 0) > 0);
    if (present.length === 0) return [];

    const totalValue = present.reduce((s, id) => s + (totalsById.get(id) ?? 0), 0);
    const availableH = VIEW_H - PADDING_TOP - PADDING_BOTTOM - (present.length - 1) * NODE_GAP;
    const x = side === "source" ? LEFT_X : RIGHT_X;

    let cursor = PADDING_TOP;
    const nodes: NodePos[] = [];
    present.forEach((id) => {
        const v = totalsById.get(id) ?? 0;
        const h = Math.max(8, (v / totalValue) * availableH);
        nodes.push({
            id,
            label: labelForLocation(id),
            x,
            y: cursor,
            height: h,
            side,
            totalValue: v,
            cursorIn: cursor,
            cursorOut: cursor,
        });
        cursor += h + NODE_GAP;
    });

    // grandTotal 변수는 외부 비율 표시용, 함수 내부에서는 미사용
    void grandTotal;
    return nodes;
}

function computeLinks(
    sources: NodePos[],
    targets: NodePos[],
    rawLinks: { source: TrackingLocation; target: TrackingLocation; value: number; type: TrackingType }[],
): RenderLink[] {
    const sMap = new Map(sources.map((n) => [n.id, n]));
    const tMap = new Map(targets.map((n) => [n.id, n]));

    // 링크를 source 측 → target 측 순서대로 정렬해 누적 y 계산
    const sorted = [...rawLinks]
        .filter((l) => sMap.has(l.source) && tMap.has(l.target))
        .sort((a, b) => {
            const sa = sources.findIndex((n) => n.id === a.source);
            const sb = sources.findIndex((n) => n.id === b.source);
            if (sa !== sb) return sa - sb;
            const ta = targets.findIndex((n) => n.id === a.target);
            const tb = targets.findIndex((n) => n.id === b.target);
            return ta - tb;
        });

    const result: RenderLink[] = [];
    sorted.forEach((l) => {
        const s = sMap.get(l.source)!;
        const t = tMap.get(l.target)!;
        // source / target 노드 높이 비례 분배
        const sShare = s.totalValue > 0 ? (l.value / s.totalValue) * s.height : 0;
        const tShare = t.totalValue > 0 ? (l.value / t.totalValue) * t.height : 0;

        const sy0 = s.cursorOut;
        const sy1 = sy0 + sShare;
        s.cursorOut = sy1;

        const ty0 = t.cursorIn;
        const ty1 = ty0 + tShare;
        t.cursorIn = ty1;

        result.push({
            source: s,
            target: t,
            value: l.value,
            type: l.type,
            sy0, sy1, ty0, ty1,
        });
    });

    return result;
}

function ribbonPath(l: RenderLink): string {
    const x0 = l.source.x + NODE_W;
    const x1 = l.target.x;
    const cx0 = x0 + (x1 - x0) * 0.5;
    const cx1 = x1 - (x1 - x0) * 0.5;
    return [
        `M ${x0},${l.sy0}`,
        `C ${cx0},${l.sy0} ${cx1},${l.ty0} ${x1},${l.ty0}`,
        `L ${x1},${l.ty1}`,
        `C ${cx1},${l.ty1} ${cx0},${l.sy1} ${x0},${l.sy1}`,
        `Z`,
    ].join(" ");
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function FlowSankey() {
    const links = useMemo(() => buildFlowLinks(), []);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<TrackingType | "ALL">("ALL");

    const filtered = useMemo(
        () => (filterType === "ALL" ? links : links.filter((l) => l.type === filterType)),
        [links, filterType],
    );

    // 노드별 합계 (source/target 각각)
    const { sourceTotals, targetTotals, grandTotal } = useMemo(() => {
        const s = new Map<TrackingLocation, number>();
        const t = new Map<TrackingLocation, number>();
        let total = 0;
        filtered.forEach((l) => {
            s.set(l.source, (s.get(l.source) ?? 0) + l.value);
            t.set(l.target, (t.get(l.target) ?? 0) + l.value);
            total += l.value;
        });
        return { sourceTotals: s, targetTotals: t, grandTotal: total };
    }, [filtered]);

    const sources = useMemo(
        () => layoutNodes(SOURCE_ORDER, "source", sourceTotals, grandTotal),
        [sourceTotals, grandTotal],
    );
    const targets = useMemo(
        () => layoutNodes(TARGET_ORDER, "target", targetTotals, grandTotal),
        [targetTotals, grandTotal],
    );

    const renderLinks = useMemo(
        () => computeLinks(sources, targets, filtered),
        [sources, targets, filtered],
    );

    if (renderLinks.length === 0 || grandTotal === 0) {
        return (
            <div className="text-center py-12 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-md">
                <p className="text-[13px] text-[#718096]">표시할 흐름 데이터가 없습니다.</p>
            </div>
        );
    }

    const FILTER_OPTIONS: { value: TrackingType | "ALL"; label: string }[] = [
        { value: "ALL", label: "전체" },
        { value: "inbound", label: TYPE_LABEL.inbound },
        { value: "outbound", label: TYPE_LABEL.outbound },
        { value: "transfer", label: TYPE_LABEL.transfer },
        { value: "return", label: TYPE_LABEL.return },
    ];

    return (
        <div className="space-y-4">
            {/* 필터 + 범례 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 rounded-md bg-[#f8fafc] border border-[#e2e8f0]">
                    {FILTER_OPTIONS.map((opt) => {
                        const active = filterType === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setFilterType(opt.value)}
                                className={`h-7 px-3 rounded-sm text-[12px] font-medium transition-colors ${
                                    active
                                        ? "bg-white text-[#0d47a1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0]"
                                        : "text-[#4a5568] hover:text-[#1a1a1a]"
                                }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    {(["inbound", "outbound", "transfer", "return"] as TrackingType[]).map((t) => (
                        <span key={t} className="inline-flex items-center gap-1.5 text-[11px] text-[#4a5568]">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: TYPE_COLOR[t] }} />
                            {TYPE_LABEL[t]}
                        </span>
                    ))}
                </div>
            </div>

            {/* SVG Sankey */}
            <div className="relative w-full overflow-x-auto bg-[#f8fafc] border border-[#e2e8f0] rounded-md">
                <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    className="w-full h-auto block"
                    style={{ minWidth: 720 }}
                >
                    {/* 컬럼 라벨 */}
                    <text
                        x={LEFT_X - 8}
                        y={16}
                        fontSize={11}
                        fontWeight={700}
                        fill="#0d47a1"
                        letterSpacing={1}
                        textAnchor="end"
                    >
                        출발지
                    </text>
                    <text
                        x={RIGHT_X + NODE_W + 8}
                        y={16}
                        fontSize={11}
                        fontWeight={700}
                        fill="#0d47a1"
                        letterSpacing={1}
                        textAnchor="start"
                    >
                        도착지
                    </text>

                    {/* 링크 (먼저 그려서 노드 아래 깔림) */}
                    {renderLinks.map((l, i) => {
                        const key = `${l.source.id}-${l.target.id}-${l.type}-${i}`;
                        const isHover = hoveredKey === key;
                        const isOther = hoveredKey !== null && !isHover;
                        return (
                            <path
                                key={key}
                                d={ribbonPath(l)}
                                fill={TYPE_COLOR[l.type]}
                                fillOpacity={isHover ? 0.85 : isOther ? 0.18 : 0.55}
                                stroke="none"
                                onMouseEnter={() => setHoveredKey(key)}
                                onMouseLeave={() => setHoveredKey(null)}
                                style={{ cursor: "pointer", transition: "fill-opacity 0.18s ease" }}
                            >
                                <title>
                                    {labelForLocation(l.source.id)} → {labelForLocation(l.target.id)} ·{" "}
                                    {TYPE_LABEL[l.type]} · {l.value.toLocaleString()}개
                                </title>
                            </path>
                        );
                    })}

                    {/* 출발지 노드 + 라벨 */}
                    {sources.map((n) => {
                        const cy = n.y + n.height / 2;
                        // 작은 노드는 라벨 한 줄(인라인), 큰 노드는 두 줄
                        const stacked = n.height >= 30;
                        return (
                            <g key={`s-${n.id}`}>
                                <rect
                                    x={n.x}
                                    y={n.y}
                                    width={NODE_W}
                                    height={n.height}
                                    rx={2}
                                    fill="#0d47a1"
                                />
                                {stacked ? (
                                    <>
                                        <text
                                            x={n.x - 8}
                                            y={cy - 1}
                                            fontSize={11}
                                            fontWeight={600}
                                            fill="#1a1a1a"
                                            textAnchor="end"
                                            dominantBaseline="alphabetic"
                                        >
                                            {n.label}
                                        </text>
                                        <text
                                            x={n.x - 8}
                                            y={cy + 12}
                                            fontSize={10}
                                            fill="#718096"
                                            textAnchor="end"
                                            dominantBaseline="alphabetic"
                                            style={{ fontVariantNumeric: "tabular-nums" }}
                                        >
                                            {n.totalValue.toLocaleString()}개
                                        </text>
                                    </>
                                ) : (
                                    <text
                                        x={n.x - 8}
                                        y={cy}
                                        fontSize={11}
                                        fontWeight={500}
                                        fill="#1a1a1a"
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                    >
                                        <tspan>{n.label}</tspan>
                                        <tspan
                                            dx={6}
                                            fontSize={10}
                                            fill="#94a3b8"
                                            style={{ fontVariantNumeric: "tabular-nums" }}
                                        >
                                            {n.totalValue.toLocaleString()}
                                        </tspan>
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* 도착지 노드 + 라벨 */}
                    {targets.map((n) => {
                        const cy = n.y + n.height / 2;
                        const stacked = n.height >= 30;
                        return (
                            <g key={`t-${n.id}`}>
                                <rect
                                    x={n.x}
                                    y={n.y}
                                    width={NODE_W}
                                    height={n.height}
                                    rx={2}
                                    fill="#1976d2"
                                />
                                {stacked ? (
                                    <>
                                        <text
                                            x={n.x + NODE_W + 8}
                                            y={cy - 1}
                                            fontSize={11}
                                            fontWeight={600}
                                            fill="#1a1a1a"
                                            textAnchor="start"
                                            dominantBaseline="alphabetic"
                                        >
                                            {n.label}
                                        </text>
                                        <text
                                            x={n.x + NODE_W + 8}
                                            y={cy + 12}
                                            fontSize={10}
                                            fill="#718096"
                                            textAnchor="start"
                                            dominantBaseline="alphabetic"
                                            style={{ fontVariantNumeric: "tabular-nums" }}
                                        >
                                            {n.totalValue.toLocaleString()}개
                                        </text>
                                    </>
                                ) : (
                                    <text
                                        x={n.x + NODE_W + 8}
                                        y={cy}
                                        fontSize={11}
                                        fontWeight={500}
                                        fill="#1a1a1a"
                                        textAnchor="start"
                                        dominantBaseline="middle"
                                    >
                                        <tspan>{n.label}</tspan>
                                        <tspan
                                            dx={6}
                                            fontSize={10}
                                            fill="#94a3b8"
                                            style={{ fontVariantNumeric: "tabular-nums" }}
                                        >
                                            {n.totalValue.toLocaleString()}
                                        </tspan>
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
