/**
 * @file src/app/(prototype)/alerts/components/AlertsKpiBar.tsx
 * @description 재고 알림 상단 KPI 4종.
 */

"use client";

import { Bell, BellRing, CheckCircle2, AlertTriangle } from "lucide-react";
import KpiCard from "@/app/(prototype)/dashboard/components/KpiCard";
import { computeAlertsKpi } from "@/data/seed/alerts-helpers";

export default function AlertsKpiBar() {
    const kpi = computeAlertsKpi();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                label="신규 알림"
                value={kpi.new.toLocaleString()}
                unit="건"
                Icon={BellRing}
                tone="critical"
                infoTitle="신규 알림"
                infoDefinition="아직 확인되지 않은 안전 재고 알림 건수입니다."
                infoBullets={[
                    "본사·매장 관리자가 즉시 검토 후 '확인됨' 처리해야 합니다.",
                    "확인 후 발주 또는 재고 조정 등 후속 조치가 필요합니다.",
                ]}
            />
            <KpiCard
                label="확인됨"
                value={kpi.acknowledged.toLocaleString()}
                unit="건"
                Icon={Bell}
                info="담당자가 확인하여 검토 단계로 넘어간 알림입니다. 후속 조치(발주·재고 조정) 완료 시 '해결됨'으로 전환됩니다."
            />
            <KpiCard
                label="해결됨"
                value={kpi.resolved.toLocaleString()}
                unit="건"
                Icon={CheckCircle2}
                info="후속 조치가 완료되어 매장 재고가 기준 수량 이상으로 회복된 알림입니다."
            />
            <KpiCard
                label="오늘 발생"
                value={kpi.today.toLocaleString()}
                unit="건"
                Icon={AlertTriangle}
                info="당일 0시부터 현재까지 새로 발생한 알림의 건수입니다."
            />
        </div>
    );
}
