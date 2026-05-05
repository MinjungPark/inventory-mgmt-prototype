/**
 * @file src/app/(prototype)/api-sync/components/FailureCauseModal.tsx
 * @description 동기화 실패 원인 분석 모달 — 600px 중앙 오버레이.
 *
 *  콘텐츠: 발생 정보 / 오류 원인 (받은값·기대값·검증룰) / 해결 방안 / 관련 정책
 *  영업 메시지: "검증 룰까지 설계했다" — 받은값 + 기대 룰을 명시적으로 노출.
 *  액션: [닫기] / [매장 담당자에게 안내 메일 발송] (토스트 모킹).
 */

"use client";

import { useEffect, useState } from "react";
import { X, Search, Mail, AlertCircle, FileText, ListChecks, Send } from "lucide-react";

import { FAILURE_CATEGORY_LABEL, type FailedSyncItem } from "@/data/seed/api-sync-seed";

interface FailureCauseModalProps {
    open: boolean;
    onClose: () => void;
    item: FailedSyncItem | null;
}

// 분류 배지 — 모든 분류 muted 통일.
//   강조 대상은 *오류 원인* 박스(주황)이지 분류 라벨이 아니므로 시선 경쟁 제거.
const CATEGORY_TONE = "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]";

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function FailureCauseModal({ open, onClose, item }: FailureCauseModalProps) {
    const [toast, setToast] = useState<string | null>(null);

    // ESC 닫기
    useEffect(() => {
        if (!open) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // 스크롤 잠금
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // 토스트 자동 사라짐
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2400);
        return () => clearTimeout(t);
    }, [toast]);

    if (!open || !item) return null;

    const catLabel = FAILURE_CATEGORY_LABEL[item.category];

    function handleSendMail() {
        if (!item) return;
        setToast(`${item.senderHolder} 담당자에게 안내 메일이 발송되었습니다.`);
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="원인 분석"
        >
            <div
                className="bg-white rounded-md shadow-[0_12px_48px_rgba(0,0,0,0.18)] border border-[#e2e8f0] w-full max-w-[600px] max-h-[92vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <div className="flex items-center gap-2">
                        <Search size={16} strokeWidth={2.2} className="text-[#0d47a1]" />
                        <span className="text-[14px] font-semibold text-[#1a1a1a]">원인 분석</span>
                        <span className="text-[12px] text-[#718096]">· 동기화 실패 상세 정보</span>
                    </div>
                    <button
                        type="button"
                        aria-label="닫기"
                        onClick={onClose}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-[#e2e8f0] transition-colors"
                    >
                        <X size={16} strokeWidth={2.2} className="text-[#4a5568]" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                    {/* SKU + 분류 배지 */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
                        <div>
                            <div className="text-[15px] font-bold text-[#1a1a1a]">{item.skuName}</div>
                            <div className="text-[11px] font-mono text-[#64748b] mt-0.5">{item.skuId}</div>
                        </div>
                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${CATEGORY_TONE}`}>
                            {catLabel}
                        </span>
                    </div>

                    {/* 발생 정보 */}
                    <section>
                        <div className="flex items-center gap-1.5 mb-2">
                            <FileText size={13} strokeWidth={2.2} className="text-[#0d47a1]" />
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#0d47a1]">발생 정보</h3>
                        </div>
                        <dl className="space-y-1.5 text-[12px]">
                            <div className="flex">
                                <dt className="w-24 shrink-0 text-[#64748b]">발생 시각</dt>
                                <dd className="text-[#1a1a1a] tabular-nums">{formatDateTime(item.occurredAt)}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 shrink-0 text-[#64748b]">보낸 측</dt>
                                <dd className="text-[#1a1a1a]">
                                    <span className="font-semibold">{item.senderHolder}</span>
                                    <span className="ml-2 font-mono text-[11px] text-[#64748b]">{item.senderKey}</span>
                                </dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 shrink-0 text-[#64748b]">자동 재시도</dt>
                                <dd className="text-[#1a1a1a]">
                                    <span className="tabular-nums">{item.retryCount}</span>회 시도 후 영구 처리
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {/* 오류 원인 */}
                    <section className="rounded-md border border-[#fed7aa] bg-[#fff7ed] p-3.5">
                        <div className="flex items-center gap-1.5 mb-2">
                            <AlertCircle size={13} strokeWidth={2.2} className="text-[#c2410c]" />
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#c2410c]">오류 원인</h3>
                        </div>
                        <dl className="space-y-1.5 text-[12px]">
                            <div className="flex">
                                <dt className="w-24 shrink-0 text-[#64748b]">사유</dt>
                                <dd className="text-[#1a1a1a] font-semibold">{item.reason}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 shrink-0 text-[#64748b]">받은 값</dt>
                                <dd className="text-[#1a1a1a]">
                                    <code className="font-mono text-[11px] bg-white border border-[#fed7aa] rounded px-1.5 py-0.5">
                                        {item.receivedValue}
                                    </code>
                                </dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 shrink-0 text-[#64748b]">검증 룰</dt>
                                <dd className="text-[#1a1a1a]">
                                    <code className="font-mono text-[11px] bg-white border border-[#fed7aa] rounded px-1.5 py-0.5">
                                        {item.expectedRule}
                                    </code>
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {/* 해결 방안 */}
                    <section>
                        <div className="flex items-center gap-1.5 mb-2">
                            <ListChecks size={13} strokeWidth={2.2} className="text-[#0d47a1]" />
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#0d47a1]">해결 방안</h3>
                        </div>
                        <ol className="space-y-1.5">
                            {item.resolutionSteps.map((step, i) => (
                                <li key={i} className="flex gap-2 text-[12px] leading-[1.65] text-[#1a1a1a]">
                                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#e8eef6] text-[#0d47a1] text-[11px] font-bold border border-[#0d47a1]/25">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1 pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* 관련 정책 */}
                    <section className="text-[11px] text-[#64748b] border-t border-[#f1f5f9] pt-3">
                        <span className="font-semibold text-[#0d47a1]">관련 정책 — </span>
                        본 페이지 우측 <span className="font-semibold text-[#1a1a1a]">실패 처리 정책</span> 카드의{" "}
                        <span className="font-semibold text-[#1a1a1a]">『{catLabel}』</span> 분류를 참조하십시오.
                    </section>
                </div>

                {/* 푸터 — 액션 */}
                <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 px-4 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a] transition-colors"
                    >
                        닫기
                    </button>
                    <button
                        type="button"
                        onClick={handleSendMail}
                        className="h-9 px-4 rounded-md bg-[#0d47a1] hover:bg-[#0a3a8a] active:translate-y-[0.5px] text-[12px] font-semibold text-white inline-flex items-center gap-1.5 shadow-[0_1px_2px_rgba(13,71,161,0.18)] transition-all"
                    >
                        <Mail size={13} strokeWidth={2.2} />
                        매장 담당자에게 안내 메일 발송
                    </button>
                </div>
            </div>

            {/* 토스트 — 모달 내부에서 발송된 결과 */}
            {toast && (
                <div
                    className="fixed bottom-6 right-6 z-[110] inline-flex items-center gap-2 px-4 py-3 rounded-md bg-white border border-[#0d47a1]/20 shadow-[0_4px_16px_rgba(13,71,161,0.14)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Send size={14} strokeWidth={2.2} className="text-[#0d47a1]" />
                    <span className="text-[13px] font-semibold text-[#1a1a1a]">{toast}</span>
                </div>
            )}
        </div>
    );
}
