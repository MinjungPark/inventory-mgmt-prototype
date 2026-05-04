/**
 * @file src/components/ui/SeverityRulesCard.tsx
 * @description 의미 색상 분류 기준 안내 카드 — "긴급/주의/정상이 어떤 상황인가"를 화면에 직접 명시.
 *              인포 툴팁에 묻혀 있던 룰을 표면화.
 *
 *  사용처:
 *   - 화면 7 재고 알림 (수량 기준 룰)
 *   - 화면 4 창고 카드 영역 (가동률 룰)
 *   - 매장 재고 (수량 기준 룰)
 */

import { ListChecks } from "lucide-react";

export interface SeverityRule {
    severity: "critical" | "warning" | "ok";
    label: string;          // 예: "긴급"
    threshold: string;      // 예: "≤ 30%"
    description: string;    // 예: "결품 임박, 즉시 발주 필요"
}

interface SeverityRulesCardProps {
    title?: string;
    rules: SeverityRule[];
}

const COLOR: Record<SeverityRule["severity"], { dot: string; label: string }> = {
    critical: { dot: "#b34530", label: "text-[#991b1b]" },
    warning:  { dot: "#ea7c2e", label: "text-[#c2410c]" },
    ok:       { dot: "#22c55e", label: "text-[#15803d]" },
};

export default function SeverityRulesCard({
    title = "분류 기준",
    rules,
}: SeverityRulesCardProps) {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
                <ListChecks size={14} strokeWidth={2} className="text-[#0d47a1]" />
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#718096]">
                    {title}
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {rules.map((r) => {
                    const c = COLOR[r.severity];
                    return (
                        <div
                            key={r.severity}
                            className="flex items-start gap-2.5 p-3 rounded-md bg-[#f8fafc] border border-[#e2e8f0]"
                        >
                            <span
                                className="shrink-0 mt-[5px] w-2.5 h-2.5 rounded-full"
                                style={{ background: c.dot }}
                                aria-hidden="true"
                            />
                            <div className="flex-1 min-w-0 leading-tight">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className={`text-[13px] font-semibold ${c.label}`}>
                                        {r.label}
                                    </span>
                                    <span className="text-[12px] font-mono font-semibold text-[#1a1a1a] tabular-nums">
                                        {r.threshold}
                                    </span>
                                </div>
                                <p className="mt-1 text-[12px] text-[#4a5568] leading-[1.5]">
                                    {r.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
