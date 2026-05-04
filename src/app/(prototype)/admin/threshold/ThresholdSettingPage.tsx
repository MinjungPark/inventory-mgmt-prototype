/**
 * @file src/app/(prototype)/admin/threshold/ThresholdSettingPage.tsx
 * @description 화면 8 — 재고 알림 설정 (관리자 전용) | RFP 2-3 ① 관리자 설정 수량 이하 감지
 *
 *  - 상단 안내 박스
 *  - 카테고리 일괄 설정 (카테고리 + 기준 수량 + 매장별 차등 토글)
 *  - 저장 시 영향 미리보기 배너
 *  - SKU별 알림 기준 설정 테이블 (인라인 편집)
 *  - 변경 이력 패널
 *
 * 프로토타입이므로 실제 저장은 무동작 — 시각·인터랙션 데모 우선.
 */

"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import { SKUS } from "@/data/seed";
import type { ProductCategory } from "@/types/inventory";

import ThresholdInfoBox from "./components/ThresholdInfoBox";
import CategoryBulkApply from "./components/CategoryBulkApply";
import ImpactPreviewBanner from "./components/ImpactPreviewBanner";
import ThresholdTable from "./components/ThresholdTable";
import ChangeHistoryPanel from "./components/ChangeHistoryPanel";

export default function ThresholdSettingPage() {
    /** 변경된 임계값 — Map<skuId, newThreshold> */
    const [overrides, setOverrides] = useState<Map<string, number>>(new Map());
    const [perStoreEnabled, setPerStoreEnabled] = useState<boolean>(false);

    function handleSkuChange(skuId: string, newThreshold: number) {
        setOverrides((prev) => {
            const next = new Map(prev);
            const sku = SKUS.find((s) => s.id === skuId);
            // 원래 값과 같아지면 override 제거
            if (sku && sku.threshold === newThreshold) {
                next.delete(skuId);
            } else {
                next.set(skuId, newThreshold);
            }
            return next;
        });
    }

    function handleSkuReset(skuId: string) {
        setOverrides((prev) => {
            const next = new Map(prev);
            next.delete(skuId);
            return next;
        });
    }

    function handleBulkApply(category: ProductCategory | "ALL", value: number) {
        setOverrides((prev) => {
            const next = new Map(prev);
            const targets = category === "ALL"
                ? SKUS
                : SKUS.filter((s) => s.category === category);
            targets.forEach((s) => {
                if (s.threshold !== value) {
                    next.set(s.id, value);
                } else {
                    next.delete(s.id);
                }
            });
            return next;
        });
    }

    function handleSave() {
        // 프로토타입 — 실제 저장 X. UI 피드백만.
        // 변경 이력 시드(THRESHOLD_HISTORY)에 추가하는 효과는 없음 (시드 정적).
        setOverrides(new Map());
    }

    function handleCancel() {
        setOverrides(new Map());
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="재고 알림 설정"
                subtitle="SKU별 알림 기준 수량 · 카테고리 일괄 설정 · 매장별 차등 · 변경 이력"
                rfpMapping="2-3 ① 관리자 설정 수량"
            />

            {/* 안내 박스 */}
            <ThresholdInfoBox />

            {/* 카테고리 일괄 설정 */}
            <CategoryBulkApply
                perStoreEnabled={perStoreEnabled}
                onPerStoreToggle={setPerStoreEnabled}
                onApply={handleBulkApply}
            />

            {/* 저장 시 영향 미리보기 */}
            <ImpactPreviewBanner
                affectedCount={overrides.size}
                perStoreEnabled={perStoreEnabled}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {/* SKU별 설정 테이블 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <ListChecks size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
                        SKU별 알림 기준 설정
                    </h2>
                    <span className="text-[12px] text-[#718096]">
                        값 직접 수정 또는 카테고리 일괄 설정으로 적용
                    </span>
                </div>
                <ThresholdTable
                    skus={SKUS}
                    overrides={overrides}
                    onChange={handleSkuChange}
                    onReset={handleSkuReset}
                    perStoreEnabled={perStoreEnabled}
                />
            </div>

            {/* 변경 이력 */}
            <ChangeHistoryPanel />
        </div>
    );
}
