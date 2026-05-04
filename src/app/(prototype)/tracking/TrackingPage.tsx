/**
 * @file src/app/(prototype)/tracking/TrackingPage.tsx
 * @description 화면 5 — 입출고 트래킹 | RFP 2-1 ③
 *              30일 추이 라인 차트 + 매장↔창고 흐름 + 최근 100건 이력 + 기간/유형 필터
 *
 * Phase 1 단계: 골격 placeholder. Phase 2에서 실제 콘텐츠 채움.
 * 화면 전용 sub-component (TrackingTimeline, FlowSankey, EventHistoryTable 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function TrackingPage() {
    return (
        <PlaceholderScreen
            title="입출고 트래킹"
            subtitle="30일 추이 라인 차트 + 매장↔창고 흐름 + 최근 100건 이력"
            rfpMapping="2-1 ③ 입출고 트래킹 데이터 및 추이"
        />
    );
}
