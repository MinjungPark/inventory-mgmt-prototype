/**
 * @file src/components/ui/ChartTooltip.tsx
 * @description Recharts 공용 커스텀 Tooltip — 라이트 톤 Calm 톤.
 *              흰색 배경 + #e0e0e0 보더 + 6px 라운드 + 미세 그림자 (지시서 8장).
 */

"use client";

interface TooltipPayloadItem {
    name?: string;
    value?: number | string;
    color?: string;
    payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
    /** 값 우측 단위 (예: "건", "원", "%") */
    unit?: string;
    /** value 포맷터 */
    valueFormatter?: (v: number | string) => string;
}

export default function ChartTooltip({
    active,
    payload,
    label,
    unit,
    valueFormatter,
}: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-white border border-[#e0e0e0] rounded-md px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {label != null && (
                <p className="text-[12px] font-semibold text-[#1a1a1a] mb-1">{String(label)}</p>
            )}
            <div className="space-y-0.5">
                {payload.map((p: TooltipPayloadItem, i: number) => {
                    const raw = p.value;
                    const formatted =
                        raw == null
                            ? ""
                            : valueFormatter
                                ? valueFormatter(raw)
                                : typeof raw === "number"
                                    ? raw.toLocaleString()
                                    : String(raw);
                    return (
                        <div key={i} className="flex items-center gap-2 text-[12px]">
                            <span
                                className="w-2 h-2 rounded-sm shrink-0"
                                style={{ background: p.color ?? "#0d47a1" }}
                            />
                            <span className="text-[#4a5568]">{p.name}</span>
                            <span className="ml-auto font-semibold text-[#0d47a1]">
                                {formatted}
                                {unit && (
                                    <span className="text-[#718096] font-normal ml-0.5">
                                        {unit}
                                    </span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
