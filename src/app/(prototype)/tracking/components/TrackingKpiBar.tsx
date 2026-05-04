/**
 * @file src/app/(prototype)/tracking/components/TrackingKpiBar.tsx
 * @description 입출고 트래킹 상단 KPI 4종.
 */

"use client";

import { ArrowDownToLine, ArrowUpFromLine, BarChart3, CalendarDays } from "lucide-react";
import KpiCard from "@/app/(prototype)/dashboard/components/KpiCard";
import { computeTrackingKpi } from "@/data/seed/tracking-helpers";

export default function TrackingKpiBar() {
    const kpi = computeTrackingKpi();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                label="오늘 입고"
                value={kpi.todayInbound.toLocaleString()}
                unit="건"
                Icon={ArrowDownToLine}
                tone="accent"
                info="당일 0시부터 현재까지 발생한 입고 트래킹 건수입니다. 신규 발주 도착·재발주 도착·신상 입고가 포함됩니다."
            />
            <KpiCard
                label="오늘 출고"
                value={kpi.todayOutbound.toLocaleString()}
                unit="건"
                Icon={ArrowUpFromLine}
                info="당일 0시부터 현재까지 발생한 출고 트래킹 건수입니다. 매장 보충·프로모션 차감·정기 출고가 포함됩니다."
            />
            <KpiCard
                label="7일 평균"
                value={kpi.weekAvg.toLocaleString()}
                unit="건/일"
                Icon={CalendarDays}
                info="최근 7일간 일평균 입출고 합계 건수입니다. 평일·주말의 운영 패턴 차이를 반영한 평균값입니다."
            />
            <KpiCard
                label="30일 누적"
                value={kpi.total30.toLocaleString()}
                unit="건"
                Icon={BarChart3}
                info="최근 30일간 발생한 입고·출고 트래킹의 총 건수입니다. 카테고리·창고 간 이동량 평가에 활용됩니다."
            />
        </div>
    );
}
