/**
 * @file src/app/(prototype)/api-sync/ApiSyncPage.tsx
 * @description 화면 6 — 데이터 자동 동기화 (API 연동) | RFP 2-2 전체
 *              본사 API 연결 상태 · 동기화 이력 · 수동→자동 전환 통계 · 실패 알림 패널
 *
 * Phase 1 단계: 골격 placeholder. Phase 3에서 실제 콘텐츠 채움.
 * 화면 전용 sub-component (ApiHealthCard, SyncHistoryTable, ManualVsAutoChart 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function ApiSyncPage() {
    return (
        <PlaceholderScreen
            title="데이터 자동 동기화 (API 연동)"
            subtitle="본사 API 연결 상태 · 동기화 이력 · 수동 → 자동 전환 통계"
            rfpMapping="2-2 API 연동 및 자동화 구축"
        />
    );
}
