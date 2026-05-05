/**
 * @file src/components/common/SystemStructureModal.tsx
 * @description 시스템 구조도 모달 — 900×640 중앙 오버레이.
 *              ESC 키 / 배경 클릭으로 닫기. 본문에 SystemStructureDiagram 렌더.
 *
 *  톤 정합 정정 (캡틴 지시):
 *   - max-w 1040 → 960: FHD 환경에서 압도적이지 않으면서도 살짝 넉넉한 시연 영역
 *   - currentSectionId 전달 제거: 인트로 슬롯·가이드 슬롯과 시각 일관 (강조 없음)
 */

"use client";

import { useEffect } from "react";
import { X, Workflow } from "lucide-react";
import SystemStructureDiagram from "./SystemStructureDiagram";

interface SystemStructureModalProps {
    open: boolean;
    onClose: () => void;
    /** 현재 화면 RFP 섹션 — 흐름도 강조용 */
    currentSectionId?: string;
}

export default function SystemStructureModal({
    open,
    onClose,
    currentSectionId,
}: SystemStructureModalProps) {
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

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="시스템 구조도"
        >
            <div
                className="bg-white rounded-md shadow-[0_12px_48px_rgba(0,0,0,0.18)] border border-[#e2e8f0] w-full max-w-[960px] max-h-[92vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <div className="flex items-center gap-2">
                        <Workflow size={16} strokeWidth={2.2} className="text-[#0d47a1]" />
                        <span className="text-[14px] font-semibold text-[#1a1a1a]">
                            시스템 구조도
                        </span>
                        <span className="text-[12px] text-[#718096]">
                            · 본사 DB 신축 영역 · 매장 입력 · 관리자 Setup/Operation
                        </span>
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

                {/* 본문 — SVG 흐름도 (강조 없이 동일 톤 유지: 인트로/가이드 슬롯과 시각 일관) */}
                <div className="flex-1 overflow-auto px-6 py-5 bg-white">
                    <SystemStructureDiagram />
                </div>

                {/* 푸터 — 범례 */}
                <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center gap-4 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d47a1]">
                        범례
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4a5568]">
                        <span className="inline-block w-3 h-3 rounded-sm bg-[#e8eef6] border border-[#0d47a1]" />
                        이번 사업 신축 영역 / 현재 화면
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4a5568]">
                        <span className="inline-block w-3 h-3 rounded-sm bg-white border border-[#cbd5e1]" />
                        기존 영역 · 외부 시스템
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4a5568]">
                        <span
                            className="inline-block w-3 h-3 rounded-sm border border-[#0d47a1]"
                            style={{ borderStyle: "dashed" }}
                        />
                        API 키 게이트웨이 (RBAC)
                    </span>
                </div>
            </div>
        </div>
    );
}
