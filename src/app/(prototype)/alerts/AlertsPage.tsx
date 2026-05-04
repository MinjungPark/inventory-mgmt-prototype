/**
 * @file src/app/(prototype)/alerts/AlertsPage.tsx
 * @description 화면 7 — 재고 알림 | RFP 2-3 ②
 *              신규/확인/해결 KPI + 심각도 색상 코드 + 30일 발생 추이 + 일괄 확인 액션
 *
 * Phase 1 단계: 골격 placeholder. Phase 3에서 실제 콘텐츠 채움.
 * 화면 전용 sub-component (SeverityBadge, AlertTable, AlertTrendChart 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function AlertsPage() {
    return (
        <PlaceholderScreen
            title="재고 알림"
            subtitle="신규/확인/해결 KPI + 심각도 색상 코드 + 30일 발생 추이"
            rfpMapping="2-3 ② 감지 시 대시보드 알림 노출"
        />
    );
}
