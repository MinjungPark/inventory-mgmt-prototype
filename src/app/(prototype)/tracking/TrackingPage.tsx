/**
 * @file src/app/(prototype)/tracking/TrackingPage.tsx
 * @description 화면 5 — 입출고 트래킹 | RFP 2-1 ③ 매장·창고 간 입출고 트래킹·추이 리스트
 *
 *  - 상단 KPI 4종 (오늘 입고·오늘 출고·7일 평균·30일 누적)
 *  - 기간 필터 (오늘 / 이번 주 / 이번 달 / 전체) — 차트·이력 모두 연동
 *  - 일별 입출고 추이 라인 차트 (선택 기간 자동 반영)
 *  - 매장 ↔ 창고 흐름 SVG 정공형 Sankey (선택 기간 자동 반영)
 *  - 입출고 이력 테이블 (최근 100건)
 */

"use client";

import { useMemo, useState } from "react";
import { CalendarRange, LineChart as LineIcon, Network, ListOrdered } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ChartCard from "@/app/(prototype)/dashboard/components/ChartCard";
import { TRACKING_EVENTS } from "@/data/seed";

import TrackingKpiBar from "./components/TrackingKpiBar";
import DailyTrendLine from "./components/DailyTrendLine";
import FlowSankey from "./components/FlowSankey";
import TrackingFilterBar, { type PeriodKey } from "./components/TrackingFilterBar";
import TrackingHistoryTable from "./components/TrackingHistoryTable";
import type { TrackingType } from "@/types/inventory";

const HISTORY_LIMIT = 100;

const PERIOD_LABEL: Record<PeriodKey, string> = {
    today: "오늘",
    "7d": "이번 주",
    "30d": "이번 달",
    all: "전체 기간 (60일)",
};

function periodToDays(period: PeriodKey): number | undefined {
    if (period === "today") return 1;
    if (period === "7d") return 7;
    if (period === "30d") return 30;
    return undefined; // all
}

function periodCutoff(period: PeriodKey): number {
    const now = Date.now();
    if (period === "today") {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }
    if (period === "7d") return now - 7 * 24 * 60 * 60 * 1000;
    if (period === "30d") return now - 30 * 24 * 60 * 60 * 1000;
    return 0; // all
}

export default function TrackingPage() {
    const [period, setPeriod] = useState<PeriodKey>("7d");
    const [typeFilter, setTypeFilter] = useState<TrackingType | "ALL">("ALL");
    const [search, setSearch] = useState("");

    // 기간 + 유형 + 검색 모두 적용된 필터링 — 통계용
    const periodFilteredAll = useMemo(() => {
        const cutoff = periodCutoff(period);
        return TRACKING_EVENTS.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
    }, [period]);

    // 이력 테이블용 — 추가 필터 적용
    const historyEvents = useMemo(() => {
        const q = search.trim().toLowerCase();
        return periodFilteredAll
            .filter((e) => typeFilter === "ALL" || e.type === typeFilter)
            .filter((e) => {
                if (!q) return true;
                return (
                    e.skuId.toLowerCase().includes(q) ||
                    e.skuName.toLowerCase().includes(q) ||
                    e.operatorName.toLowerCase().includes(q)
                );
            })
            .slice(0, HISTORY_LIMIT);
    }, [periodFilteredAll, typeFilter, search]);

    const days = periodToDays(period);
    const periodLabel = PERIOD_LABEL[period];
    const periodTotalCount = periodFilteredAll.length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="입출고 트래킹"
                subtitle="매장·창고 간 입출고 흐름과 추이 · 100건 이력"
                rfpMapping="2-1 ③ 입출고 트래킹"
            />

            {/* 상단 KPI */}
            <TrackingKpiBar />

            {/* 기간/유형/검색 필터 — 차트와 이력 모두 연동 */}
            <TrackingFilterBar
                period={period}
                onPeriodChange={setPeriod}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                search={search}
                onSearchChange={setSearch}
            />

            {/* 기간 시각 피드백 — 클릭 신호를 명확하게 */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-md bg-[#e8eef6] border border-[#0d47a1]/15">
                <CalendarRange size={14} strokeWidth={2} className="text-[#0d47a1]" />
                <span className="text-[12px] font-semibold text-[#0d47a1]">
                    현재 표시 기간: {periodLabel}
                </span>
                <span className="text-[12px] text-[#4a5568]">
                    · 이 기간 내 입출고{" "}
                    <span className="font-semibold text-[#1a1a1a] tabular-nums">
                        {periodTotalCount.toLocaleString()}
                    </span>
                    건
                </span>
            </div>

            {/* 일별 입출고 추이 — 기간 prop으로 자동 도메인 조정 */}
            <ChartCard
                Icon={LineIcon}
                title="일별 입출고 추이"
                subtitle={`${periodLabel} 일별 입고 / 출고 건수`}
                info="선택한 기간의 일별 입고·출고 건수를 라인 차트로 비교합니다. 기간 필터를 변경하면 차트 X축 범위도 함께 조정됩니다."
                height={300}
            >
                <DailyTrendLine days={days} />
            </ChartCard>

            {/* 매장 ↔ 창고 흐름 Sankey — 기간 prop 연동 */}
            <ChartCard
                Icon={Network}
                title="매장 ↔ 창고 흐름"
                subtitle={`${periodLabel} 출발지 · 도착지 간 유량 시각화 (Sankey)`}
                infoTitle="매장↔창고 흐름 (Sankey)"
                infoDefinition="선택한 기간의 출발지에서 도착지로 이동한 SKU 수량을 흐름 띠로 시각화합니다."
                infoBullets={[
                    "띠의 두께가 두꺼울수록 유량(이동 수량)이 많음을 의미합니다.",
                    "색상은 입출고 유형을 구분하며 상단 필터로 단일 유형만 강조 가능합니다.",
                    "기간 필터를 변경하면 흐름 데이터도 함께 재계산됩니다.",
                ]}
                heightMode="auto"
            >
                <FlowSankey days={days} />
            </ChartCard>

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <ListOrdered size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
                        입출고 이력
                    </h2>
                    <span className="text-[12px] text-[#718096]">
                        {periodLabel} · 표시{" "}
                        <span className="font-semibold text-[#1a1a1a]">
                            {historyEvents.length.toLocaleString()}
                        </span>
                        건 (최대 {HISTORY_LIMIT}건)
                    </span>
                </div>
                <TrackingHistoryTable events={historyEvents} />
            </div>
        </div>
    );
}
