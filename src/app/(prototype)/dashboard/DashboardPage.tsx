/**
 * @file src/app/(prototype)/dashboard/DashboardPage.tsx
 * @description 화면 2 — 통합 대시보드 (메인) | RFP 2-1 종합
 *              KPI 5종 + 차트 6종 + 안전 재고 알림 위젯 + TOP 회전율 SKU 테이블
 *
 * Phase 1 단계: 골격 placeholder. Phase 2에서 시드 데이터 연결하여 실제 콘텐츠 채움.
 * 화면 전용 sub-component (KpiCard, SectionDonutChart 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function DashboardPage() {
    return (
        <PlaceholderScreen
            title="통합 대시보드"
            subtitle="KPI 5종 + 차트 6종 + 안전 재고 알림 위젯"
            rfpMapping="2-1 종합"
        />
    );
}
