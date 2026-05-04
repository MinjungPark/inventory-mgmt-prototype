/**
 * @file src/app/(prototype)/store-inventory/StoreInventoryPage.tsx
 * @description 화면 3 — 매장 재고 | RFP 2-1 ①
 *              5개 섹션 카드 (의류·신발·잡화·화장품·라이프스타일)
 *              섹션 클릭 → 우측 상세 패널 (존 분포·SKU 상세 테이블)
 *
 * Phase 1 단계: 골격 placeholder. Phase 2에서 실제 콘텐츠 채움.
 * 화면 전용 sub-component (SectionCard, ZoneStackBar 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function StoreInventoryPage() {
    return (
        <PlaceholderScreen
            title="매장 재고"
            subtitle="5개 섹션 (의류·신발·잡화·화장품·라이프스타일) + 존(Zone) 분포"
            rfpMapping="2-1 ① 매장 구역·존 잔여 재고 시각화"
        />
    );
}
