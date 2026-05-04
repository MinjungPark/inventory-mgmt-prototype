/**
 * @file src/app/(prototype)/tracking/TrackingPage.tsx
 * @description 화면 5 — 입출고 트래킹 | RFP 2-1 ③ 매장·창고 간 입출고 트래킹·추이 리스트
 *
 *  - 상단 KPI 4종 (오늘 입고·오늘 출고·7일 평균·30일 누적)
 *  - 30일 일별 입출고 추이 라인 차트
 *  - 매장 ↔ 창고 흐름 SVG 정공형 Sankey (캡틴 명시: 시각적 임팩트)
 *  - 입출고 이력 테이블 (최근 100건) + 기간/유형/검색 필터
 */

"use client";

import { useMemo, useState } from "react";
import { LineChart as LineIcon, Network, ListOrdered } from "lucide-react";

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

    const filteredEvents = useMemo(() => {
        const cutoff = periodCutoff(period);
        const q = search.trim().toLowerCase();
        return TRACKING_EVENTS
            .filter((e) => new Date(e.timestamp).getTime() >= cutoff)
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
    }, [period, typeFilter, search]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="입출고 트래킹"
                subtitle="매장·창고 간 입출고 흐름과 30일 추이 · 100건 이력"
                rfpMapping="2-1 ③ 입출고 트래킹"
            />

            {/* 상단 KPI */}
            <TrackingKpiBar />

            {/* 30일 추이 라인 차트 */}
            <ChartCard
                Icon={LineIcon}
                title="일별 입출고 추이"
                subtitle="최근 30일 일별 입고 건수 / 출고 건수"
                info="최근 30일간 일별 입고·출고 건수를 라인 차트로 비교합니다. 평일·주말의 운영 패턴 차이가 자연스럽게 드러납니다."
                height={300}
            >
                <DailyTrendLine />
            </ChartCard>

            {/* 매장 ↔ 창고 흐름 Sankey */}
            <ChartCard
                Icon={Network}
                title="매장 ↔ 창고 흐름"
                subtitle="출발지 · 도착지 간 유량 시각화 (Sankey)"
                infoTitle="매장↔창고 흐름 (Sankey)"
                infoDefinition="출발지에서 도착지로 이동한 SKU 수량을 흐름 띠로 시각화합니다."
                infoBullets={[
                    "띠의 두께가 두꺼울수록 유량(이동 수량)이 많음을 의미합니다.",
                    "색상은 입출고 유형을 구분하며 상단 필터로 단일 유형만 강조 가능합니다.",
                    "흐름 위에 마우스를 올리면 해당 흐름이 강조되며 출발지·도착지·수량이 표시됩니다.",
                ]}
                height={580}
            >
                <FlowSankey />
            </ChartCard>

            {/* 이력 필터 + 테이블 */}
            <TrackingFilterBar
                period={period}
                onPeriodChange={setPeriod}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                search={search}
                onSearchChange={setSearch}
            />

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <ListOrdered size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
                        입출고 이력
                    </h2>
                    <span className="text-[12px] text-[#718096]">
                        최근 {HISTORY_LIMIT}건 한도 · 필터 적용 시 조건 내
                    </span>
                </div>
                <TrackingHistoryTable events={filteredEvents} />
            </div>
        </div>
    );
}
