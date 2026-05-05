/**
 * @file src/app/(prototype)/store-inventory/StoreInventoryPage.tsx
 * @description 화면 3 — 매장 재고 | RFP 2-1 ① 오프라인 매장 구역·존 잔여 재고 시각화
 *
 *  - 7섹션 카드 그리드 (의류·신발·언더웨어·잡화·화장품·주얼리·라이프스타일)
 *  - 섹션 선택 → 우측/하단 상세 패널 (존 분포 스택 바 + SKU 테이블)
 *  - 상단 필터바: 카테고리·존·재고 수준 + 검색
 */

"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SeverityRulesCard from "@/components/ui/SeverityRulesCard";
import { STORE_SECTIONS, SKUS } from "@/data/seed";
import {
    getSkusBySection,
    getStockStatus,
    getZoneIdForSku,
    type StockStatus,
} from "@/data/seed/store-helpers";
import type { ProductCategory, StoreSection } from "@/types/inventory";

import StoreFilterBar from "./components/StoreFilterBar";
import SectionCard from "./components/SectionCard";
import ZoneDistributionStack from "./components/ZoneDistributionStack";
import ZoneSkuTable from "./components/ZoneSkuTable";

const STOCK_RULES = [
    {
        severity: "critical" as const,
        label: "부족",
        threshold: "≤ 30%",
        description: "결품 임박 — 즉시 발주 필요.",
    },
    {
        severity: "warning" as const,
        label: "주의",
        threshold: "30 ~ 70%",
        description: "곧 부족 예상 — 발주 계획 수립.",
    },
    {
        severity: "ok" as const,
        label: "충분",
        threshold: "> 70%",
        description: "여유 운영.",
    },
];

export default function StoreInventoryPage() {
    // ─── 필터 상태 ─────────────────────────────────────────────────────────
    const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
    const [zone, setZone] = useState<string>("ALL");
    const [status, setStatus] = useState<StockStatus | "ALL">("ALL");
    const [search, setSearch] = useState<string>("");

    // ─── 선택 섹션 (기본 = 첫 섹션) ────────────────────────────────────────
    const [selectedSectionId, setSelectedSectionId] = useState<string>(
        STORE_SECTIONS[0].id,
    );

    // ─── 필터링된 섹션 ─────────────────────────────────────────────────────
    const filteredSections: StoreSection[] = useMemo(() => {
        if (category === "ALL") return STORE_SECTIONS;
        return STORE_SECTIONS.filter((s) => s.category === category);
    }, [category]);

    // ─── 섹션별 부족률 계산 ────────────────────────────────────────────────
    const shortageRatioMap = useMemo(() => {
        const map = new Map<string, number>();
        STORE_SECTIONS.forEach((s) => {
            const skus = getSkusBySection(SKUS, s.id);
            if (skus.length === 0) {
                map.set(s.id, 0);
                return;
            }
            const shortage = skus.filter((sku) => getStockStatus(sku) === "shortage").length;
            map.set(s.id, shortage / skus.length);
        });
        return map;
    }, []);

    // ─── 선택 섹션의 SKU (필터 적용) ──────────────────────────────────────
    const selectedSection = useMemo(
        () => STORE_SECTIONS.find((s) => s.id === selectedSectionId) ?? STORE_SECTIONS[0],
        [selectedSectionId],
    );

    const selectedSectionSkus = useMemo(() => {
        let list = getSkusBySection(SKUS, selectedSection.id);

        // 존 필터
        if (zone !== "ALL") {
            list = list.filter((sku) => getZoneIdForSku(sku, selectedSection) === zone);
        }
        // 검색
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                (sku) =>
                    sku.id.toLowerCase().includes(q) ||
                    sku.name.toLowerCase().includes(q),
            );
        }
        return list;
    }, [selectedSection, zone, search]);

    // ─── 첫 필터된 섹션 자동 선택 (현재 선택이 필터 밖이면) ───────────────
    const selectedInFilter = filteredSections.some((s) => s.id === selectedSectionId);
    const effectiveSelectedId =
        selectedInFilter ? selectedSectionId : filteredSections[0]?.id ?? STORE_SECTIONS[0].id;
    const effectiveSection =
        STORE_SECTIONS.find((s) => s.id === effectiveSelectedId) ?? STORE_SECTIONS[0];

    return (
        <div className="space-y-6">
            <PageHeader
                title="매장 재고"
                subtitle="플래그십 매장 7개 섹션의 잔여 재고 수량 및 존(Zone) 단위 시각화"
                rfpSection="2-1"
                rfpHighlightItems={["2-1-①"]}
            />

            {/* 분류 기준 안내 */}
            <SeverityRulesCard
                title="재고 분류 기준 — 매장 재고 ÷ 알림 기준 수량"
                rules={STOCK_RULES}
            />

            {/* ─── 필터바 ─── */}
            <StoreFilterBar
                category={category}
                onCategoryChange={setCategory}
                zone={zone}
                onZoneChange={setZone}
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
            />

            {/* ─── 섹션 카드 그리드 (7섹션) ─── */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <LayoutGrid size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
                        매장 섹션
                    </h2>
                    <span className="text-[12px] text-[#718096]">
                        ({filteredSections.length}개)
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSections.map((s) => (
                        <SectionCard
                            key={s.id}
                            section={s}
                            shortageRatio={shortageRatioMap.get(s.id) ?? 0}
                            selected={s.id === effectiveSelectedId}
                            onClick={() => setSelectedSectionId(s.id)}
                        />
                    ))}
                </div>
            </div>

            {/* ─── 상세 패널 (선택 섹션) ─── */}
            <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-5">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
                    <div>
                        <p className="text-[11px] text-[#0d47a1] font-semibold uppercase tracking-wider mb-1">
                            선택 섹션 상세
                        </p>
                        <h3 className="text-[18px] font-semibold text-[#1a1a1a]">
                            {effectiveSection.name}
                        </h3>
                        <p className="text-[12px] text-[#4a5568] mt-0.5">
                            {effectiveSection.floor} · 존 {effectiveSection.zones.length}개 ·{" "}
                            SKU {effectiveSection.skuCount.toLocaleString()}개
                        </p>
                    </div>
                </div>

                {/* 존 분포 스택 바 */}
                <div>
                    <h4 className="text-[13px] font-semibold text-[#1a1a1a] mb-3">
                        존(Zone)별 재고 분포
                    </h4>
                    <ZoneDistributionStack section={effectiveSection} />
                </div>

                {/* SKU 테이블 */}
                <div>
                    <h4 className="text-[13px] font-semibold text-[#1a1a1a] mb-3">
                        SKU 상세
                        {(zone !== "ALL" || status !== "ALL" || search.trim()) && (
                            <span className="ml-2 text-[11px] text-[#0d47a1] font-medium">
                                · 필터 적용
                            </span>
                        )}
                    </h4>
                    <ZoneSkuTable
                        section={effectiveSection}
                        skus={selectedSectionSkus}
                        statusFilter={status}
                    />
                </div>
            </div>
        </div>
    );
}
