/**
 * @file src/components/ui/RatioGauge.tsx
 * @description 비율 게이지 — 0~100% 범위에 임계점 마커 표시.
 *              재고 알림·창고 가동률 등에 사용.
 *
 *  - 0~markers[i]까지 채워진 막대
 *  - 임계점에 점선 세로 마커
 *  - 채움 색은 비율 구간에 따라 자동 결정 (기본 30/70 룰)
 *  - 가동률(역방향) 모드 지원: high 값이 위험
 */

interface RatioGaugeProps {
    /** 0~1 범위 비율 */
    ratio: number;
    /** 임계점 (0~1) — 기본 [0.3, 0.7] */
    thresholds?: [number, number];
    /** 의미 — 'low'(낮을수록 위험·재고 부족) | 'high'(높을수록 위험·만재) */
    direction?: "low" | "high";
    /** 게이지 너비 (px) — 기본 100 */
    width?: number;
    /** 게이지 높이 (px) — 기본 8 */
    height?: number;
    /** 임계점 라벨 표시 여부 */
    showLabels?: boolean;
}

export default function RatioGauge({
    ratio,
    thresholds = [0.3, 0.7],
    direction = "low",
    width = 100,
    height = 8,
    showLabels = false,
}: RatioGaugeProps) {
    const clamped = Math.max(0, Math.min(1, ratio));
    const pct = clamped * 100;

    // 채움 색 결정
    let fill: string;
    if (direction === "low") {
        // 낮을수록 위험: critical(빨강) ≤ thresholds[0] / warning(주황) thresholds[0]~thresholds[1] / ok(녹색) > thresholds[1]
        if (clamped <= thresholds[0]) fill = "#b34530";
        else if (clamped <= thresholds[1]) fill = "#ea7c2e";
        else fill = "#22c55e";
    } else {
        // 높을수록 위험
        if (clamped >= thresholds[1]) fill = "#b34530";
        else if (clamped >= thresholds[0]) fill = "#ea7c2e";
        else fill = "#22c55e";
    }

    return (
        <div className="inline-flex flex-col gap-0.5" style={{ width }}>
            <div
                className="relative rounded-full overflow-hidden bg-[#f1f5f9] border border-[#e2e8f0]"
                style={{ height }}
            >
                {/* 채움 */}
                <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: fill }}
                />
                {/* 임계점 마커 */}
                {thresholds.map((t, i) => (
                    <div
                        key={i}
                        className="absolute top-0 h-full"
                        style={{
                            left: `${t * 100}%`,
                            width: 1,
                            background: "rgba(15, 23, 42, 0.35)",
                            transform: "translateX(-0.5px)",
                        }}
                    />
                ))}
            </div>
            {showLabels && (
                <div
                    className="relative text-[10px] text-[#94a3b8] tabular-nums"
                    style={{ height: 12 }}
                >
                    <span style={{ position: "absolute", left: 0, transform: "translateX(0)" }}>0</span>
                    {thresholds.map((t, i) => (
                        <span
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${t * 100}%`,
                                transform: "translateX(-50%)",
                            }}
                        >
                            {Math.round(t * 100)}
                        </span>
                    ))}
                    <span style={{ position: "absolute", right: 0 }}>100</span>
                </div>
            )}
        </div>
    );
}
