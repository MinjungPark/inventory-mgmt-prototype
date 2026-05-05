/**
 * @file src/app/(prototype)/api-sync/ApiSyncPage.tsx
 * @description 화면 6 — 데이터 자동 동기화 (API 연동) | RFP 2-2 전체
 *
 *  메뉴 의도 (종합 지시서 4장 화면 6):
 *    "수동 → 자동 전환을 시각적으로 증명하는 화면"
 *
 *  - 상단 카드 3종 (API 연결 / 다음 동기화 / 누적 자동 처리)
 *  - 수동 vs 자동 비교 차트 (★ 영업 무기 핵심)
 *  - 동기화 이력 테이블 (시간순)
 *  - 동기화 실패 알림 패널 (재시도)
 *
 *  ApiStatusCards는 Date.now()를 컴포넌트 레벨에서 사용 →
 *  Hydration 안전을 위해 dynamic import + ssr: false 적용.
 */

"use client";

import dynamic from "next/dynamic";
import { TrendingUp } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ChartCard from "@/app/(prototype)/dashboard/components/ChartCard";

import ManualVsAutoChart from "./components/ManualVsAutoChart";
import SyncHistorySection from "./components/SyncHistorySection";
import FailedSyncPanel from "./components/FailedSyncPanel";
import FailurePolicyCard from "./components/FailurePolicyCard";
import ExternalIntegrationCard from "./components/ExternalIntegrationCard";

const ApiStatusCards = dynamic(() => import("./components/ApiStatusCards"), {
    ssr: false,
    loading: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-[180px] flex items-center justify-center text-[12px] text-[#94a3b8]"
                >
                    상태 로딩 중...
                </div>
            ))}
        </div>
    ),
});

// formatRelative()가 컴포넌트 렌더링 시점에 Date.now()를 호출하므로
// SSR/CSR mismatch 회피를 위해 ssr:false 처리.
const ApiKeyRbacCard = dynamic(() => import("./components/ApiKeyRbacCard"), {
    ssr: false,
    loading: () => (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-[420px] flex items-center justify-center text-[12px] text-[#94a3b8]">
            API 키 권한 체계 로딩 중...
        </div>
    ),
});

export default function ApiSyncPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="데이터 자동 동기화 (API 연동)"
                subtitle="매장별 발급 API 키로 본사 DB 재고 관리 섹션에 직접 적재 · 수동→자동 전환 효과"
                rfpSection="2-2"
                rfpHighlightAll
            />

            {/* 상단 카드 3종 */}
            <ApiStatusCards />

            {/* API 키 권한 체계 (RBAC) — RFP 2-2 ① 메시지 본진 */}
            <ApiKeyRbacCard />

            {/* 외부 시스템 연동 패턴 — RFP 정합 + 허브 메시지 */}
            <ExternalIntegrationCard />

            {/* 수동 vs 자동 비교 — 영업 무기 핵심 */}
            <ChartCard
                Icon={TrendingUp}
                title="수동 → 자동 전환 효과"
                subtitle="이전 30일 (수동 처리) vs 최근 30일 (자동 처리)"
                infoTitle="수동 → 자동 전환 효과"
                infoDefinition="매장이 보낸 CSV를 본사 직원이 수신·정리·등록하던 일배치 작업을, 매장에 발급된 API 키로 본사 DB 재고 관리 섹션에 직접 적재하도록 전환한 결과입니다."
                infoBullets={[
                    "처리 건수: 매장 운영 확장에 따라 자연 증가합니다.",
                    "건당 처리 시간: 18분(수동 CSV 처리) → 24초(API 직접 적재)로 압축됩니다.",
                    "오류율: 직원 검증·재입력 과정에서 발생하던 휴먼 에러가 대폭 감소합니다.",
                    "월간 인력 시간: 절감분이 매장 응대·발주 의사결정 등 본업으로 환원됩니다.",
                ]}
                heightMode="auto"
            >
                <ManualVsAutoChart />
            </ChartCard>

            {/* 실패 알림 + 처리 정책 — 좌우 1:1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                <FailedSyncPanel />
                <FailurePolicyCard />
            </div>

            {/* 동기화 이력 — 필터 4종 + 시각 피드백 배너 + 테이블 */}
            <SyncHistorySection />
        </div>
    );
}
