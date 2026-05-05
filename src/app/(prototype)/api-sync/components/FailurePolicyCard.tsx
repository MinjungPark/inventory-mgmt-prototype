/**
 * @file src/app/(prototype)/api-sync/components/FailurePolicyCard.tsx
 * @description 동기화 실패 처리 정책 카드 — 5분류별 현실 시나리오 안내.
 *
 *  [실패 분류]
 *   (가) 일시 네트워크 — 자동 재시도로 자동 복구
 *   (나) 인증 만료/회수 — 즉시 알림, 관리자 키 갱신
 *   (다) 첨부 파일 오류 (CSV) — 매장 재업로드
 *   (라) 데이터 검증 실패 — 보낸 측 점검 후 재전송
 *   (마) 권한·범위 위반 — 키 권한 재정의
 */

"use client";

import {
    ShieldCheck,
    KeyRound,
    FileWarning,
    CheckCircle2,
    Ban,
    RotateCw,
} from "lucide-react";

interface PolicyCategory {
    Icon: typeof KeyRound;
    iconTone: string;
    title: string;
    examples: string[];
    action: string;
}

const POLICY_CATEGORIES: PolicyCategory[] = [
    {
        Icon: KeyRound,
        iconTone: "text-[#0d47a1] bg-[#e8eef6] border-[#0d47a1]/25",
        title: "인증 만료 · 키 회수",
        examples: [
            "키 만료일 도래 (예: ak_live_xxxx**** 만료 D-7)",
            "키 회수됨 — 폐점 매장 자동 차단",
            "토큰 갱신 누락 — 본사 정책 변경 미반영",
        ],
        action: "관리자 콘솔에서 키 갱신·재발급 (5분 내 복구)",
    },
    {
        Icon: FileWarning,
        iconTone: "text-[#c2410c] bg-[#fff7ed] border-[#c2410c]/25",
        title: "첨부 파일 오류",
        examples: [
            "파일 누락 — 업로드 본문이 비어 있음",
            "허용 외 확장자 — 사전 정의된 확장자 외 차단",
            "헤더 불일치 — 'sku_id' 등 필수 컬럼 누락",
            "인코딩 오류 — UTF-8 권장 (그 외 자동 변환 시도)",
            "파일 크기 초과 — 사전 정의된 한도 초과 시 분할 업로드 필요",
        ],
        action: "보낸 측 양식 점검 후 재전송",
    },
    {
        Icon: CheckCircle2,
        iconTone: "text-[#15803d] bg-[#ecfdf5] border-[#15803d]/25",
        title: "데이터 검증 실패",
        examples: [
            "SKU 코드 형식 불일치 (정규식 위반)",
            "음수 단가 · 음수 재고 수량 차단",
            "필수 필드 누락 (skuId · quantity 등)",
            "참조 무결성 위반 (존재하지 않는 매장 ID)",
        ],
        action: "보낸 측 점검 후 재전송",
    },
    {
        Icon: Ban,
        iconTone: "text-[#b34530] bg-[#fef2f2] border-[#b34530]/25",
        title: "권한 · 범위 위반",
        examples: [
            "권한 외 매장 데이터 요청 — 키 범위 초과",
            "R(읽기) 키로 W(쓰기) 호출 시도",
            "타사 데이터 조회 시도 — 격리 정책 위반",
        ],
        action: "키 권한 재정의 또는 호출 로직 수정",
    },
];

export default function FailurePolicyCard() {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full flex flex-col">
            {/* 헤더 */}
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-start gap-2">
                <ShieldCheck size={16} strokeWidth={2.2} className="text-[#0d47a1] mt-[2px]" />
                <div>
                    <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                        실패 처리 정책
                    </h3>
                    <p className="text-[12px] text-[#4a5568] mt-0.5">
                        일시 오류는 자동 복구 · 그 외는 분류별 즉시 알림
                    </p>
                </div>
            </div>

            {/* 자동 재시도 정책 (별도 강조) */}
            <div className="px-5 py-3.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
                <div className="flex items-start gap-2">
                    <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#e8eef6] text-[#0d47a1] border border-[#0d47a1]/25">
                        <RotateCw size={14} strokeWidth={2.2} />
                    </span>
                    <div className="flex-1">
                        <div className="text-[12px] font-bold text-[#0d47a1] mb-0.5">
                            자동 재시도 — 일시 네트워크 오류
                        </div>
                        <div className="text-[11px] text-[#4a5568] leading-[1.6]">
                            1차 30초 후 → 2차 5분 후 → 3차 30분 후 단계 재시도.
                            본사 API 응답 시간 초과 · 일시 연결 끊김은 자동 복구되어 좌측 알림에 노출되지 않습니다.
                        </div>
                    </div>
                </div>
            </div>

            {/* 영구 오류 4분류 */}
            <div className="flex-1 px-5 py-3 space-y-3 overflow-y-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-1">
                    영구 오류 4분류 — 3회 재시도 후에도 실패한 경우
                </div>
                {POLICY_CATEGORIES.map((cat) => (
                    <div key={cat.title} className="flex items-start gap-2.5">
                        <span
                            className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md border ${cat.iconTone}`}
                        >
                            <cat.Icon size={14} strokeWidth={2.2} />
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-[#1a1a1a]">{cat.title}</div>
                            <ul className="mt-1 space-y-0.5">
                                {cat.examples.map((ex, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-1.5 text-[11px] leading-[1.6] text-[#4a5568]"
                                    >
                                        <span className="shrink-0 w-3 text-[#cbd5e1]">·</span>
                                        <span className="flex-1">{ex}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-1 inline-flex items-center px-1.5 py-[2px] rounded-md text-[11px] font-semibold bg-[#e8eef6] text-[#0d47a1] border border-[#0d47a1]/25">
                                → {cat.action}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 데이터 무결성 보장 — 푸터 */}
            <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                <div className="text-[11px] leading-[1.65] text-[#4a5568]">
                    <span className="font-bold text-[#0d47a1]">데이터 무결성 — </span>
                    실패 건은 본사 DB 미적재 (부분 / 누락 적재 없음). 3회 재시도 후에도 실패 시 좌측 알림 패널에 즉시 노출됩니다.
                </div>
            </div>
        </div>
    );
}
