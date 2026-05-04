/**
 * @file src/app/(prototype)/alerts/AlertsPage.tsx
 * @description 화면 7 — 재고 알림 | RFP 2-3 ② 감지 시 대시보드 알림 노출
 *
 *  - 상단 KPI 4종 (신규/확인/해결/오늘 발생)
 *  - 30일 알림 발생 추이 (스택 바 — 긴급/주의)
 *  - 매장·카테고리·심각도·상태 필터 + 검색
 *  - 알림 테이블 + 일괄 선택 + 일괄 확인 액션 (로컬 상태 변경 + 토스트)
 *
 * 프로토타입 인터랙션:
 *  - 일괄 확인 시 status: 'new' → 'acknowledged' 로컬 변경
 *  - 부드러운 토스트로 시각 피드백
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Bell, CheckCircle2 } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ChartCard from "@/app/(prototype)/dashboard/components/ChartCard";
import SeverityRulesCard from "@/components/ui/SeverityRulesCard";
import { STOCK_ALERTS } from "@/data/seed";
import { filterAlerts } from "@/data/seed/alerts-helpers";
import type { AlertSeverity, AlertStatus, ProductCategory, StockAlert } from "@/types/inventory";

import AlertsKpiBar from "./components/AlertsKpiBar";
import AlertTrendChart from "./components/AlertTrendChart";
import AlertsFilterBar from "./components/AlertsFilterBar";
import AlertsTable from "./components/AlertsTable";

const STOCK_RULES = [
    {
        severity: "critical" as const,
        label: "긴급",
        threshold: "≤ 30%",
        description: "결품 임박 — 즉시 발주가 필요한 SKU.",
    },
    {
        severity: "warning" as const,
        label: "주의",
        threshold: "30 ~ 70%",
        description: "곧 부족 예상 — 발주 계획 수립이 필요합니다.",
    },
    {
        severity: "ok" as const,
        label: "정상",
        threshold: "> 70%",
        description: "여유 운영 — 즉시 조치는 필요하지 않습니다.",
    },
];

export default function AlertsPage() {
    // 시드 알림을 로컬 상태로 가져와 이후 인터랙션(일괄 확인) 반영.
    const [alerts, setAlerts] = useState<StockAlert[]>(() =>
        STOCK_ALERTS.map((a) => ({ ...a })),
    );

    const [sectionId, setSectionId] = useState<string>("ALL");
    const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
    const [severity, setSeverity] = useState<AlertSeverity | "ALL">("ALL");
    const [status, setStatus] = useState<AlertStatus | "ALL">("ALL");
    const [search, setSearch] = useState("");

    // 토스트 (간이 — 자동 사라짐)
    const [toast, setToast] = useState<string | null>(null);
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2400);
        return () => clearTimeout(t);
    }, [toast]);

    const filtered = useMemo(
        () =>
            filterAlerts(alerts, {
                storeSectionId: sectionId,
                category,
                severity,
                status,
                search,
            }).sort((a, b) => {
                // 심각도 우선 (critical > warning > ok), 그 다음 발생시각 최신
                const sevOrder = { critical: 0, warning: 1, ok: 2 };
                const sev = sevOrder[a.severity] - sevOrder[b.severity];
                if (sev !== 0) return sev;
                return a.occurredAt < b.occurredAt ? 1 : -1;
            }),
        [alerts, sectionId, category, severity, status, search],
    );

    function handleAcknowledge(ids: string[]) {
        const idSet = new Set(ids);
        let changedCount = 0;
        setAlerts((prev) =>
            prev.map((a) => {
                if (idSet.has(a.id) && a.status === "new") {
                    changedCount += 1;
                    return { ...a, status: "acknowledged" };
                }
                return a;
            }),
        );
        if (changedCount > 0) {
            setToast(`${changedCount}건이 확인 처리되었습니다.`);
        }
    }

    return (
        <div className="space-y-6 relative">
            <PageHeader
                title="재고 알림"
                subtitle="안전 재고 미달 알림의 신규·확인·해결 흐름과 30일 발생 추이"
                rfpMapping="2-3 ② 감지·알림"
            />

            {/* KPI */}
            <AlertsKpiBar />

            {/* 분류 기준 안내 */}
            <SeverityRulesCard
                title="알림 분류 기준 — 현재 수량 ÷ 알림 기준 수량"
                rules={STOCK_RULES}
            />

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
                        심각도 우선 정렬 · 신규 알림만 일괄 확인 처리 가능
                    </span>
                </div>
                <AlertsTable alerts={filtered} onAcknowledge={handleAcknowledge} />
            </div>

            {/* 토스트 */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-md bg-white border border-[#0d47a1]/20 shadow-[0_4px_16px_rgba(13,71,161,0.14)] animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 size={16} strokeWidth={2.2} className="text-[#15803d]" />
                    <span className="text-[13px] font-semibold text-[#1a1a1a]">{toast}</span>
                </div>
            )}
        </div>
    );
}
