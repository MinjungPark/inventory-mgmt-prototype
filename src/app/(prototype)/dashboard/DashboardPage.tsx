/**
 * @file src/app/(prototype)/dashboard/DashboardPage.tsx
 * @description 화면 2 — 통합 대시보드 (메인) | RFP 2-1 종합
 *              KPI 5종 + 차트 6종 + 하단 위젯 (안전 재고 알림 + TOP 회전율 SKU)
 *
 * 시드 데이터:
 *  - DASHBOARD_KPI: 총 SKU·매장가치·창고가치·알림·일일 입출고
 *  - STORE_SECTIONS / WAREHOUSES / SKUS / TRACKING_EVENTS / STOCK_ALERTS
 */

import {
    BarChart3,
    Boxes,
    PackageCheck,
    Layers,
    Radar,
    LineChart,
    PieChart,
    AlertCircle,
    Activity,
    ArrowDownUp,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import KpiCard from "./components/KpiCard";
import ChartCard from "./components/ChartCard";
import SectionDistributionDonut from "./components/SectionDistributionDonut";
import WarehouseStockBar from "./components/WarehouseStockBar";
import DailyTrackingLine from "./components/DailyTrackingLine";
import CategoryTurnoverBar from "./components/CategoryTurnoverBar";
import FrequentAlertSkuRadar from "./components/FrequentAlertSkuRadar";
import WeeklyInOutStack from "./components/WeeklyInOutStack";
import LowStockAlertWidget from "./components/LowStockAlertWidget";
import TopTurnoverTable from "./components/TopTurnoverTable";

import { DASHBOARD_KPI } from "@/data/seed";

// ─── KPI 포맷터 ─────────────────────────────────────────────────────────────

function formatKRW(amount: number): string {
    if (amount >= 100_000_000) {
        const eok = amount / 100_000_000;
        return eok.toFixed(1).replace(/\.0$/, "");
    }
    return (amount / 10_000).toFixed(0);
}

function unitForKRW(amount: number): string {
    return amount >= 100_000_000 ? "억원" : "만원";
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const kpi = DASHBOARD_KPI;

    return (
        <div className="space-y-6">
            <PageHeader
                title="통합 대시보드"
                subtitle="플래그십 매장 운영 KPI · 재고 분포 · 입출고 추이를 한 화면에서 통합 관제"
                rfpMapping="2-1 종합"
            />

            {/* ─── KPI 카드 5종 ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <KpiCard
                    label="총 SKU 수"
                    value={kpi.totalSku.toLocaleString()}
                    unit="개"
                    Icon={Boxes}
                    info="SKU(Stock Keeping Unit)는 재고 관리의 가장 작은 식별 단위입니다. 같은 품목이라도 색상·사이즈 변형은 각각 다른 SKU로 관리합니다. 매장·창고 전체에 등록된 활성 SKU 수입니다."
                    trend={{ value: 2.4, direction: "up", label: "전월 대비" }}
                />
                <KpiCard
                    label="매장 재고 가치"
                    value={formatKRW(kpi.storeValueKRW)}
                    unit={unitForKRW(kpi.storeValueKRW)}
                    Icon={PackageCheck}
                    tone="accent"
                    trend={{ value: 1.8, direction: "up", label: "전주 대비" }}
                />
                <KpiCard
                    label="창고 재고 가치"
                    value={formatKRW(kpi.warehouseValueKRW)}
                    unit={unitForKRW(kpi.warehouseValueKRW)}
                    Icon={Layers}
                    trend={{ value: 0.6, direction: "down", label: "전주 대비" }}
                />
                <KpiCard
                    label="안전 재고 미달"
                    value={String(kpi.alertCount)}
                    unit="건"
                    Icon={AlertCircle}
                    tone="critical"
                    info="관리자가 설정한 SKU별 알림 기준 수량보다 매장 재고가 부족한 SKU 수. 설정 페이지(/admin/threshold)에서 SKU별 또는 카테고리 일괄로 기준 수량을 조정할 수 있습니다."
                    trend={{ value: 12, direction: "up", label: "전일 대비" }}
                />
                <KpiCard
                    label="일일 입출고 건수"
                    value={kpi.todayTrackingCount.toLocaleString()}
                    unit="건"
                    Icon={ArrowDownUp}
                    trend={{ value: 4.2, direction: "up", label: "7일 평균 대비" }}
                />
            </div>

            {/* ─── 차트 그리드 1행: 도넛 + 수직 바 + 라인 ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <ChartCard
                    Icon={PieChart}
                    title="매장 섹션별 재고 분포"
                    subtitle="7섹션 SKU 비중"
                    info="플래그십 매장 7개 섹션의 SKU 수 비중. 화장품(2F-B)과 의류(1F-A)가 가장 많은 SKU를 차지하는 일반 매장 패턴입니다."
                    height={280}
                >
                    <SectionDistributionDonut />
                </ChartCard>

                <ChartCard
                    Icon={BarChart3}
                    title="창고별 보유 재고"
                    subtitle="3창고 SKU 보유량"
                    info="본사 창고·매장 백창고·외부 위탁 창고의 보유 SKU 수. 본사 창고가 마스터 재고, 매장 백창고는 즉시 보충용, 외부 위탁은 시즌 비축용입니다."
                    height={280}
                >
                    <WarehouseStockBar />
                </ChartCard>

                <ChartCard
                    Icon={LineChart}
                    title="입출고 추이"
                    subtitle="최근 30일 일별 합계"
                    info="일별 입고 수량과 출고 수량의 추이. 평일 평균 150건, 주말 평균 200건 패턴이 자연스럽게 드러납니다."
                    height={280}
                >
                    <DailyTrackingLine />
                </ChartCard>
            </div>

            {/* ─── 차트 그리드 2행: 수평 바 + 레이더 + 스택 바 ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <ChartCard
                    Icon={Activity}
                    title="카테고리별 재고 회전율"
                    subtitle="7 카테고리 월평균 (회/월)"
                    info="재고 회전율 = 매출 수량 ÷ 평균 재고 수량. 한 달에 평균 재고가 몇 번 다 팔리고 다시 채워졌는지를 나타냅니다. 높을수록 빠르게 팔리는 카테고리, 낮을수록 천천히 팔립니다."
                    height={300}
                >
                    <CategoryTurnoverBar />
                </ChartCard>

                <ChartCard
                    Icon={Radar}
                    title="자주 알림 발생 SKU TOP 5"
                    subtitle="안전 재고 미달 빈도"
                    info="SKU(Stock Keeping Unit)는 재고 관리의 가장 작은 식별 단위(예: 트렌치 코트 베이지 M). 본 차트는 최근 안전 재고 알림이 가장 자주 발생한 SKU 상위 5개 — 발주 정책 재검토 또는 안전 재고 기준 상향이 필요한 후보입니다."
                    height={300}
                >
                    <FrequentAlertSkuRadar />
                </ChartCard>

                <ChartCard
                    Icon={BarChart3}
                    title="일별 입고 vs 출고"
                    subtitle="최근 7일"
                    info="최근 7일 일별 입고 건수와 출고 건수. 출고가 입고를 크게 앞서면 재고 소진, 입고만 많으면 재고 누적 — 균형 모니터링용 차트입니다."
                    height={300}
                >
                    <WeeklyInOutStack />
                </ChartCard>
            </div>

            {/* ─── 하단 위젯 2종 ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <LowStockAlertWidget />
                <TopTurnoverTable />
            </div>
        </div>
    );
}
