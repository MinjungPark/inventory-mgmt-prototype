/**
 * @file src/app/(prototype)/alerts/AlertsPage.tsx
 * @description 화면 7 — 재고 알림 | RFP 2-3 ② 감지 시 대시보드 알림 노출
 *
 *  - 상단 KPI 4종 (신규/확인/해결/오늘 발생)
 *  - 30일 알림 발생 추이 (스택 바 — 긴급/주의)
 *  - 매장·카테고리·심각도·상태 필터 + 검색
 *  - 알림 테이블 + 일괄 선택 + 일괄 확인 액션
 */

"use client";

import { useMemo, useState } from "react";
import { Activity, Bell } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ChartCard from "@/app/(prototype)/dashboard/components/ChartCard";
import { STOCK_ALERTS } from "@/data/seed";
import { filterAlerts } from "@/data/seed/alerts-helpers";
import type { AlertSeverity, AlertStatus, ProductCategory } from "@/types/inventory";

import AlertsKpiBar from "./components/AlertsKpiBar";
import AlertTrendChart from "./components/AlertTrendChart";
import AlertsFilterBar from "./components/AlertsFilterBar";
import AlertsTable from "./components/AlertsTable";

export default function AlertsPage() {
    const [sectionId, setSectionId] = useState<string>("ALL");
    const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
    const [severity, setSeverity] = useState<AlertSeverity | "ALL">("ALL");
    const [status, setStatus] = useState<AlertStatus | "ALL">("ALL");
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            filterAlerts(STOCK_ALERTS, {
                storeSectionId: sectionId,
                category,
                severity,
                status,
                search,
            })
                .sort((a, b) => {
                    // 심각도 우선 (critical > warning > ok), 그 다음 발생시각 최신
                    const sevOrder = { critical: 0, warning: 1, ok: 2 };
                    const sev = sevOrder[a.severity] - sevOrder[b.severity];
                    if (sev !== 0) return sev;
                    return a.occurredAt < b.occurredAt ? 1 : -1;
                }),
        [sectionId, category, severity, status, search],
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="재고 알림"
                subtitle="안전 재고 미달 알림의 신규·확인·해결 흐름과 30일 발생 추이"
                rfpMapping="2-3 ② 감지·알림"
            />

            {/* KPI */}
            <AlertsKpiBar />

            {/* 30일 발생 추이 */}
            <ChartCard
                Icon={Activity}
                title="알림 발생 추이"
                subtitle="최근 30일 일별 발생 건수 (긴급 + 주의 스택)"
                infoTitle="알림 발생 추이"
                infoDefinition="최근 30일간 일별 알림 발생 건수를 심각도별로 누적 표시합니다."
                infoBullets={[
                    "주말이 평일보다 발생량이 높은 경향이 자연스럽게 드러납니다.",
                    "긴급(적색) 알림이 누적되는 시점은 즉시 발주 정책 검토가 필요합니다.",
                    "전반적인 추세 상승은 안전 재고 기준 수량 상향 검토 신호입니다.",
                ]}
                height={280}
            >
                <AlertTrendChart />
            </ChartCard>

            {/* 필터 */}
            <AlertsFilterBar
                sectionId={sectionId}
                onSectionChange={setSectionId}
                category={category}
                onCategoryChange={setCategory}
                severity={severity}
                onSeverityChange={setSeverity}
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
            />

            {/* 테이블 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Bell size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">알림 목록</h2>
                    <span className="text-[12px] text-[#718096]">
                        심각도 우선 정렬 · 일괄 선택 후 확인 처리 가능
                    </span>
                </div>
                <AlertsTable alerts={filtered} />
            </div>
        </div>
    );
}
