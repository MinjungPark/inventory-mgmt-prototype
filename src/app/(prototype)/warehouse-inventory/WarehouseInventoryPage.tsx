/**
 * @file src/app/(prototype)/warehouse-inventory/WarehouseInventoryPage.tsx
 * @description 화면 4 — 창고 재고 | RFP 2-1 ②
 *              3개 창고 카드 (본사·매장 백창고·외부 위탁) + 카테고리 분포 + 드릴다운 트리
 *
 * Phase 1 단계: 골격 placeholder. Phase 2에서 실제 콘텐츠 채움.
 * 화면 전용 sub-component (WarehouseCard, CategoryDrillDownTree 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function WarehouseInventoryPage() {
    return (
        <PlaceholderScreen
            title="창고 재고"
            subtitle="3개 창고 (본사·매장 백창고·외부 위탁) + 카테고리 드릴다운"
            rfpMapping="2-1 ② 창고별 보유 재고 시각화"
        />
    );
}
