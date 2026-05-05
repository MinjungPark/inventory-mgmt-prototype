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
import { History, TrendingUp } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ChartCard from "@/app/(prototype)/dashboard/components/ChartCard";

import ManualVsAutoChart from "./components/ManualVsAutoChart";
import SyncHistoryTable from "./components/SyncHistoryTable";
import FailedSyncPanel from "./components/FailedSyncPanel";

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

export default function ApiSyncPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="데이터 자동 동기화 (API 연동)"
                subtitle="본사 ERP와의 실시간 연동 · 수동 → 자동 전환 효과"
                rfpBadgeLabel="2-2 종합"
                rfpHighlightSection="2-2"
            />

            {/* 상단 카드 3종 */}
            <ApiStatusCards />

            {/* 수동 vs 자동 비교 — 영업 무기 핵심 */}
            <ChartCard
                Icon={TrendingUp}
                title="수동 → 자동 전환 효과"
                subtitle="이전 30일 (수동 처리) vs 최근 30일 (자동 처리)"
                infoTitle="수동 → 자동 전환 효과"
                infoDefinition="기존 직원이 CSV 다운로드·정리·업로드로 수행하던 동기화를 본사 API 직접 연동으로 전환한 결과입니다."
                infoBullets={[
                    "처리 건수: 매장 운영 확장에 따라 자연 증가",
                    "건당 처리 시간: 18분(수동) → 24초(자동)로 압축",
                    "오류율: CSV 작업 중 발생하던 휴먼 에러 대폭 감소",
                    "월간 인력 시간: 절감분이 매장 직원의 본업(고객 응대)으로 환원",
                ]}
                heightMode="auto"
            >
                <ManualVsAutoChart />
            </ChartCard>

            {/* 실패 알림 패널 */}
            <FailedSyncPanel />

            {/* 동기화 이력 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <History size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
                        동기화 이력
                    </h2>
                    <span className="text-[12px] text-[#718096]">
                        시간순 (최근 7일 · 시간당 1회 자동 주기)
                    </span>
                </div>
                <SyncHistoryTable />
            </div>
        </div>
    );
}
