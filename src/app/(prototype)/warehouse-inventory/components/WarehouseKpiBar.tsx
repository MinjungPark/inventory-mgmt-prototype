/**
 * @file src/app/(prototype)/warehouse-inventory/components/WarehouseKpiBar.tsx
 * @description 창고 재고 상단 KPI 4종.
 *              - 총 보유 SKU
 *              - 총 재고 가치
 *              - 평균 가동률
 *              - 외부 위탁 비중
 */

"use client";

import { Boxes, PackageCheck, Activity, ExternalLink } from "lucide-react";
import KpiCard from "@/app/(prototype)/dashboard/components/KpiCard";
import {
    AVG_UTILIZATION,
    EXTERNAL_VENDOR_RATIO,
    TOTAL_WAREHOUSE_VALUE_AGG,
} from "@/data/seed/warehouse-helpers";
import { TOTAL_WAREHOUSE_SKU } from "@/data/seed";

function formatKRW(amount: number): string {
    if (amount >= 100_000_000) return (amount / 100_000_000).toFixed(1).replace(/\.0$/, "");
    return Math.round(amount / 10_000).toLocaleString();
}
function unitForKRW(amount: number): string {
    return amount >= 100_000_000 ? "억원" : "만원";
}

export default function WarehouseKpiBar() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                label="총 보유 SKU"
                value={TOTAL_WAREHOUSE_SKU.toLocaleString()}
                unit="개"
                Icon={Boxes}
                infoTitle="창고 보유 SKU"
                infoDefinition="3개 창고(본사·매장 백창고·외부 위탁)에 보관 중인 활성 SKU의 총합입니다."
                infoBullets={[
                    "본사 창고는 마스터 재고로 가장 많은 SKU를 보유합니다.",
                    "매장 백창고는 즉시 보충용으로 핵심 SKU만 운영됩니다.",
                    "외부 위탁 창고는 시즌 비축 또는 대량 보관 용도입니다.",
                ]}
            />
            <KpiCard
                label="총 재고 가치"
                value={formatKRW(TOTAL_WAREHOUSE_VALUE_AGG)}
                unit={unitForKRW(TOTAL_WAREHOUSE_VALUE_AGG)}
                Icon={PackageCheck}
                tone="accent"
                info="3개 창고에 보유 중인 전체 재고의 단가 × 수량 합산 가치입니다."
            />
            <KpiCard
                label="평균 가동률"
                value={AVG_UTILIZATION.toFixed(1)}
                unit="%"
                Icon={Activity}
                infoTitle="창고 가동률"
                infoDefinition="창고 보관 용량 대비 현재 점유율의 평균값입니다."
                infoBullets={[
                    "70% 미만은 여유 운영 구간에 해당합니다.",
                    "70~85% 구간은 신규 입고 계획 수립이 권장됩니다.",
                    "85% 이상은 만재에 근접하여 즉시 분산 또는 출고가 필요합니다.",
                ]}
            />
            <KpiCard
                label="외부 위탁 비중"
                value={EXTERNAL_VENDOR_RATIO.toFixed(1)}
                unit="%"
                Icon={ExternalLink}
                info="전체 재고 가치 중 외부 위탁 창고가 차지하는 비율입니다. 자체 보관 vs 외부 위탁의 운영 효율을 판단하는 지표입니다."
            />
        </div>
    );
}
