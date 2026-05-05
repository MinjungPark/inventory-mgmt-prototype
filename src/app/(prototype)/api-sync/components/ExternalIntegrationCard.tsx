/**
 * @file src/app/(prototype)/api-sync/components/ExternalIntegrationCard.tsx
 * @description 화면 6 — 외부 시스템 연동 패턴 카드 (영업 무기).
 *
 *  RFP 정합:
 *   - 본 IOM이 *허브*로 작동함을 명시. 본사 ERP·물류사·PLM·POS·내부 DB 5종 연동 패턴.
 *   - 도입 상태 (필수/권장/선택) + RFP 근거 hint를 함께 노출하여
 *     발주처가 "이 친구들이 RFP를 깊이 읽고 사전 설계했다"는 인상을 받도록.
 *
 *  영업 메시지: "본사 환경에 따라 다음 시스템과 연동 가능합니다 (예시 — 본사 협의)"
 */

"use client";

import { Network, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Database } from "lucide-react";
import InfoHint from "@/components/ui/InfoHint";
import {
    EXTERNAL_SYSTEMS,
    INTEGRATION_DIRECTION_LABEL,
    INTEGRATION_STATUS_LABEL,
    type ExternalSystem,
} from "@/data/seed/external-systems";

const STATUS_TONE: Record<ExternalSystem["status"], string> = {
    required:    "bg-[#e8eef6] text-[#0d47a1] border-[#0d47a1]/30",
    recommended: "bg-[#f1f5f9] text-[#475569] border-[#94a3b8]/30",
    optional:    "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
};

function DirectionIcon({ direction }: { direction: ExternalSystem["direction"] }) {
    if (direction === "in") return <ArrowDownLeft size={12} strokeWidth={2.2} className="text-[#0d47a1]" />;
    if (direction === "out") return <ArrowUpRight size={12} strokeWidth={2.2} className="text-[#42a5f5]" />;
    if (direction === "both") return <ArrowLeftRight size={12} strokeWidth={2.2} className="text-[#0d47a1]" />;
    return <Database size={12} strokeWidth={2.2} className="text-[#64748b]" />;
}

export default function ExternalIntegrationCard() {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* 헤더 */}
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-start gap-2">
                <Network size={16} strokeWidth={2.2} className="text-[#0d47a1] mt-[2px]" />
                <div>
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                            외부 시스템 연동 패턴
                        </h3>
                        <InfoHint
                            title="외부 시스템 연동 패턴 (예시)"
                            definition="본 IOM은 단순 재고 대시보드가 아닌, 본사가 보유한 시스템과 매장·외부사를 통합하는 허브로 설계되었습니다. 아래 5종은 본사 환경에 따라 연동 가능한 외부 시스템 예시이며, 실제 연동 항목과 방식은 본사와 협의하여 결정됩니다."
                            bullets={[
                                "필수 — RFP 명시 시스템 (본사 ERP · 본사 통합 DB 내부 영역).",
                                "권장 — 운영 상식상 표준 연동 (외부 물류사).",
                                "선택 — 본사 환경에 따라 연동 결정 (PLM · 매장 POS).",
                            ]}
                            placement="bottom"
                            width={400}
                        />
                    </div>
                    <p className="text-[12px] text-[#4a5568] mt-0.5">
                        본사 환경에 따라 다음 시스템과 연동 가능합니다 <span className="text-[#94a3b8]">(예시 — 실제 항목은 본사 협의)</span>
                    </p>
                </div>
            </div>

            {/* 5종 시스템 표 */}
            <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-[#64748b]">
                            <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider">시스템</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">방향</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">방식</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">빈도</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">본 IOM 역할</th>
                            <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider">도입</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EXTERNAL_SYSTEMS.map((sys) => (
                            <tr key={sys.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] align-top">
                                {/* 시스템 이름 + 한 줄 정의 + RFP hint */}
                                <td className="px-5 py-3">
                                    <div className="text-[12px] font-bold text-[#1a1a1a] leading-tight">{sys.name}</div>
                                    <div className="text-[11px] text-[#64748b] mt-0.5">{sys.summary}</div>
                                    {sys.rfpHint && (
                                        <div className="inline-flex items-center mt-1.5 px-1.5 py-[2px] rounded-md text-[10px] font-bold bg-[#e8eef6] text-[#0d47a1] border border-[#0d47a1]/25">
                                            ✓ {sys.rfpHint}
                                        </div>
                                    )}
                                </td>

                                {/* 방향 */}
                                <td className="px-3 py-3">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4a5568]">
                                        <DirectionIcon direction={sys.direction} />
                                        {INTEGRATION_DIRECTION_LABEL[sys.direction]}
                                    </span>
                                </td>

                                {/* 방식 */}
                                <td className="px-3 py-3 text-[11px] text-[#1a1a1a] leading-[1.6] font-medium">
                                    {sys.method}
                                </td>

                                {/* 빈도 */}
                                <td className="px-3 py-3 text-[11px] text-[#64748b] leading-[1.6]">
                                    {sys.frequency}
                                </td>

                                {/* 본 IOM 역할 */}
                                <td className="px-3 py-3 text-[11px] text-[#4a5568] leading-[1.6] max-w-[280px]">
                                    {sys.iomRole}
                                </td>

                                {/* 도입 상태 */}
                                <td className="px-5 py-3">
                                    <span className={`inline-flex items-center px-2 py-[2px] rounded-md text-[11px] font-bold border ${STATUS_TONE[sys.status]}`}>
                                        {INTEGRATION_STATUS_LABEL[sys.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 푸터 — 영업 메시지 */}
            <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                <p className="text-[11px] text-[#4a5568] leading-[1.65]">
                    <span className="font-bold text-[#0d47a1]">설계 의도 — </span>
                    본 IOM은 매장과 본사·외부 시스템 사이의 통합 허브로 작동합니다.
                    레거시 시스템과의 양방향 연동을 전제로 설계되어, 데이터 단절 없이 신규 영역(재고 관리 섹션)을 신축하면서도 기존 자산을 보존합니다.
                </p>
            </div>
        </div>
    );
}
