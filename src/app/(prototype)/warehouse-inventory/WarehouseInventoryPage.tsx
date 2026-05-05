/**
 * @file src/app/(prototype)/warehouse-inventory/WarehouseInventoryPage.tsx
 * @description 화면 4 — 창고 재고 | RFP 2-1 ② 창고별 보유 재고·품목 현황 시각화
 *
 *  - 상단 KPI 4종 (총 SKU·총 가치·평균 가동률·외부 위탁 비중)
 *  - 3창고 카드 (본사·매장 백창고·외부 위탁) + 가동률 게이지
 *  - 선택 창고 → 카테고리 분포 100% 스택 바
 *  - 전체 SKU 테이블 — 검색·필터·정렬·페이지네이션
 */

"use client";

import { useMemo, useState } from "react";
import { Boxes, Layers } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SeverityRulesCard from "@/components/ui/SeverityRulesCard";
import { SKUS, WAREHOUSES } from "@/data/seed";
import {
    findWarehouse,
    getCategoryAggregateByWarehouse,
} from "@/data/seed/warehouse-helpers";
import type { WarehouseId } from "@/types/inventory";

import WarehouseKpiBar from "./components/WarehouseKpiBar";
import WarehouseCard from "./components/WarehouseCard";
import CategoryDistributionStack from "./components/CategoryDistributionStack";
import WarehouseSkuTable from "./components/WarehouseSkuTable";

const UTILIZATION_RULES = [
    {
        severity: "ok" as const,
        label: "여유 운영",
        threshold: "< 70%",
        description: "보관 용량 여유 — 즉시 조치 필요 없음.",
    },
    {
        severity: "warning" as const,
        label: "보충 필요",
        threshold: "70 ~ 85%",
        description: "곧 만재 — 신규 입고 계획 수립이 권장됩니다.",
    },
    {
        severity: "critical" as const,
        label: "만재 임박",
        threshold: "≥ 85%",
        description: "신규 입고 어려움 — 즉시 분산 또는 출고가 필요합니다.",
    },
];

export default function WarehouseInventoryPage() {
    // 선택 창고 (기본 = 본사 창고)
    const [selectedId, setSelectedId] = useState<WarehouseId>("WH-1");

    const selectedWarehouse = findWarehouse(selectedId) ?? WAREHOUSES[0];

    // 선택 창고의 카테고리 분포
    const aggregates = useMemo(
        () => getCategoryAggregateByWarehouse(SKUS, selectedId),
        [selectedId],
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="창고 재고"
                subtitle="3개 창고의 보유 재고 현황 · 카테고리 분포 · 전체 SKU 드릴다운"
                rfpBadgeLabel="2-1 ②"
                rfpHighlightItems={["2-1-②"]}
            />

            {/* 상단 KPI 4종 */}
            <WarehouseKpiBar />

            {/* 가동률 분류 기준 */}
            <SeverityRulesCard
                title="가동률 분류 기준 — 보관 용량 대비 점유율"
                rules={UTILIZATION_RULES}
            />

            {/* 3창고 카드 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Boxes size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">창고</h2>
                    <span className="text-[12px] text-[#718096]">(3개)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {WAREHOUSES.map((w) => (
                        <WarehouseCard
                            key={w.id}
                            warehouse={w}
                            selected={w.id === selectedId}
                            onClick={() => setSelectedId(w.id)}
                        />
                    ))}
                </div>
            </div>

            {/* 선택 창고 카테고리 분포 */}
            <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-5">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
                    <div>
                        <p className="text-[11px] text-[#0d47a1] font-semibold uppercase tracking-wider mb-1">
                            선택 창고 상세
                        </p>
                        <h3 className="text-[18px] font-semibold text-[#1a1a1a]">
                            {selectedWarehouse.name}
                        </h3>
                        <p className="text-[12px] text-[#4a5568] mt-0.5">
                            {selectedWarehouse.location} · 보유 SKU{" "}
                            {selectedWarehouse.skuCount.toLocaleString()}개 · 가동률{" "}
                            {selectedWarehouse.utilizationPct}%
                        </p>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Layers size={14} strokeWidth={2} className="text-[#0d47a1]" />
                        <h4 className="text-[13px] font-semibold text-[#1a1a1a]">
                            카테고리별 재고 분포
                        </h4>
                    </div>
                    <CategoryDistributionStack aggregates={aggregates} />
                </div>
            </div>

            {/* 전체 SKU 테이블 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Boxes size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
                        전체 SKU
                    </h2>
                    <span className="text-[12px] text-[#718096]">
                        검색·카테고리 필터·정렬·페이지네이션
                    </span>
                </div>
                <WarehouseSkuTable skus={SKUS} />
            </div>
        </div>
    );
}
