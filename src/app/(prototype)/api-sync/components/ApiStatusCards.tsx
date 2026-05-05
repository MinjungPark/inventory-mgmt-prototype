/**
 * @file src/app/(prototype)/api-sync/components/ApiStatusCards.tsx
 * @description 화면 6 상단 카드 3종 — API 연결 / 다음 동기화 / 누적 처리.
 */

"use client";

import { CheckCircle2, Clock, Database, AlertOctagon } from "lucide-react";
import { API_HEALTH } from "@/data/seed/api-sync-seed";
import SeverityBadge from "@/components/ui/SeverityBadge";
import InfoHint from "@/components/ui/InfoHint";

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

function relativeTime(iso: string, fromMs: number): string {
    const t = new Date(iso).getTime();
    const diffMin = Math.round((t - fromMs) / 60000);
    if (diffMin === 0) return "방금";
    if (diffMin > 0) {
        if (diffMin < 60) return `${diffMin}분 후`;
        const h = Math.round(diffMin / 60);
        return `${h}시간 후`;
    }
    const ago = Math.abs(diffMin);
    if (ago < 60) return `${ago}분 전`;
    const h = Math.round(ago / 60);
    return `${h}시간 전`;
}

export default function ApiStatusCards() {
    const h = API_HEALTH;
    // 상대 시간 계산은 SEED 시점이 아닌 모듈 로드 1회 평가가 필요한데,
    // 이 컴포넌트는 ssr:false dynamic import로 끌어올 예정이라 클라이언트 시각 사용 OK.
    const nowMs = Date.now();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 본사 API 연결 상태 */}
            <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Database size={16} strokeWidth={2} className="text-[#0d47a1]" />
                        <h3 className="text-[13px] font-semibold text-[#1a1a1a]">
                            본사 API 연결 상태
                        </h3>
                        <InfoHint
                            title="본사 API 연결 상태"
                            definition="본사 ERP와의 실시간 연결 건강성 지표입니다."
                            bullets={[
                                "정상: 응답 시간 200ms 이하 + 최근 1시간 내 성공",
                                "지연: 응답 시간 200~1000ms",
                                "오류: 응답 시간 초과 또는 인증 실패",
                            ]}
                        />
                    </div>
                    <SeverityBadge
                        severity={h.status === "ok" ? "ok" : h.status === "degraded" ? "warning" : "critical"}
                        variant={h.status === "error" ? "solid" : "outline"}
                        icon={
                            h.status === "ok" ? (
                                <CheckCircle2 size={11} strokeWidth={2.4} />
                            ) : h.status === "error" ? (
                                <AlertOctagon size={11} strokeWidth={2.4} />
                            ) : null
                        }
                    >
                        {h.status === "ok" ? "정상" : h.status === "degraded" ? "지연" : "오류"}
                    </SeverityBadge>
                </div>

                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-[12px] text-[#718096]">최근 성공</span>
                        <div className="text-right">
                            <p className="text-[14px] font-semibold text-[#1a1a1a] tabular-nums">
                                {formatDateTime(h.lastSuccessAt)}
                            </p>
                            <p className="text-[11px] text-[#15803d] font-semibold">
                                {relativeTime(h.lastSuccessAt, nowMs)}
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-[#f1f5f9] flex items-baseline justify-between">
                        <span className="text-[12px] text-[#718096]">평균 응답</span>
                        <p className="text-[14px] font-semibold text-[#0d47a1] tabular-nums">
                            {h.avgResponseMs.toLocaleString()}
                            <span className="text-[11px] text-[#718096] font-normal ml-0.5">ms</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. 다음 동기화 예정 시각 */}
            <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h3 className="text-[13px] font-semibold text-[#1a1a1a]">
                        다음 동기화 예정
                    </h3>
                    <InfoHint
                        title="자동 동기화 주기"
                        definition="본사 API와의 자동 동기화 다음 실행 시각입니다."
                        bullets={[
                            "재고 일괄 / SKU 마스터: 1시간 주기",
                            "가격 정책 / 안전 재고 기준: 본사 변경 시 즉시 푸시",
                            "관리자가 '즉시 동기화' 버튼으로 수동 트리거 가능",
                        ]}
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-[24px] font-bold text-[#0d47a1] tracking-tight tabular-nums leading-tight">
                        {formatDateTime(h.nextSyncAt).slice(11)}
                    </p>
                    <p className="text-[12px] text-[#4a5568]">
                        {formatDateTime(h.nextSyncAt).slice(0, 10)} ·{" "}
                        <span className="font-semibold text-[#1a1a1a]">
                            {relativeTime(h.nextSyncAt, nowMs)}
                        </span>
                    </p>
                    <button
                        type="button"
                        className="mt-2 w-full h-8 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#0d47a1] hover:bg-[#e8eef6] hover:border-[#0d47a1]/30 transition-colors"
                    >
                        즉시 동기화
                    </button>
                </div>
            </div>

            {/* 3. 누적 자동 처리 건수 */}
            <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                    <Database size={16} strokeWidth={2} className="text-[#0d47a1]" />
                    <h3 className="text-[13px] font-semibold text-[#1a1a1a]">
                        누적 자동 처리
                    </h3>
                    <InfoHint
                        title="누적 자동 처리 건수"
                        definition="이번 달 자동 동기화로 처리된 SKU 변경의 누적 건수입니다."
                        bullets={[
                            "수동 처리 시 평균 18분 / 건당. 자동은 24초 / 건당.",
                            "이번 달 4,250건 처리 = 약 28시간의 인력 시간 절감",
                            "오류율 12.4% (수동) → 1.8% (자동)으로 정합성 개선",
                        ]}
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-1.5">
                        <p className="text-[28px] font-bold text-[#0d47a1] tracking-tight tabular-nums leading-none">
                            {h.monthlyAutoProcessed.toLocaleString()}
                        </p>
                        <p className="text-[14px] text-[#718096] font-medium">건</p>
                    </div>
                    <p className="text-[12px] text-[#4a5568]">
                        이번 달 ·{" "}
                        <span className="font-semibold text-[#15803d]">+ 약 28시간 절감</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
