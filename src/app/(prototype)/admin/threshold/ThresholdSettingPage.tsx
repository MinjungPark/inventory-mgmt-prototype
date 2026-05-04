/**
 * @file src/app/(prototype)/admin/threshold/ThresholdSettingPage.tsx
 * @description 화면 8 — 재고 알림 설정 (관리자 전용) | RFP 2-3 ①
 *              SKU 별 알림 기준 수량 + 카테고리 일괄 설정 + 매장별 차등 + 변경 이력
 *
 * 라우트: /admin/threshold (본사 관리자 전용 — Phase 3 권한 분기 적용 예정)
 * Phase 1 단계: 골격 placeholder. Phase 3에서 실제 콘텐츠 채움.
 * 화면 전용 sub-component (ThresholdRow, BulkApplyDialog, ChangeHistoryList 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function ThresholdSettingPage() {
    return (
        <PlaceholderScreen
            title="재고 알림 설정"
            subtitle="SKU 별 알림 기준 수량 + 카테고리 일괄 설정 + 매장별 차등 + 변경 이력"
            rfpMapping="2-3 ① 관리자 설정 수량 이하 감지"
        />
    );
}
