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
                rfpBadgeLabel="2-1 종합"
                rfpHighlightSection="2-1"
            />

            {/* ─── KPI 카드 5종 ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <KpiCard
                    label="총 SKU 수"
                    value={kpi.totalSku.toLocaleString()}
                    unit="개"
                    Icon={Boxes}
                    infoTitle="SKU (Stock Keeping Unit)"
                    infoDefinition="재고 관리에서 사용되는 가장 작은 식별 단위입니다."
                    infoBullets={[
                        "동일 품목이라도 색상·사이즈 변형은 각각 별도 SKU로 관리됩니다.",
                        "예시: '트렌치 코트 베이지 M' 과 '트렌치 코트 네이비 L' 은 2개의 SKU에 해당합니다.",
                        "본 KPI는 매장·창고 전체에 등록된 활성 SKU의 총합을 의미합니다.",
                    ]}
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
                    infoTitle="안전 재고 알림"
                    infoDefinition="설정된 알림 기준 수량보다 매장 재고가 부족한 SKU의 건수입니다."
                    infoBullets={[
                        "심각도는 현재 수량을 기준 수량으로 나눈 비율로 자동 분류됩니다.",
                        "긴급(적색) 30% 이하 · 주의(황색) 30~70% · 정상(녹색) 70% 초과 기준이 적용됩니다.",
                        "기준 수량은 '재고 알림 설정' 메뉴에서 SKU별 또는 카테고리 일괄로 조정 가능합니다.",
                    ]}
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
                    info="플래그십 매장 7개 섹션의 SKU 수 비중을 나타냅니다. 화장품(2F-B)과 의류(1F-A)가 다수 SKU를 보유하는 일반적인 매장 운영 패턴입니다."
                    height={280}
                >
                    <SectionDistributionDonut />
                </ChartCard>

                <ChartCard
                    Icon={BarChart3}
                    title="창고별 보유 재고"
                    subtitle="3창고 SKU 보유량"
                    info="본사 창고·매장 백창고·외부 위탁 창고별 보유 SKU 수를 나타냅니다. 본사 창고는 마스터 재고, 매장 백창고는 즉시 보충용, 외부 위탁은 시즌 비축용으로 운영됩니다."
                    height={280}
                >
                    <WarehouseStockBar />
                </ChartCard>

                <ChartCard
                    Icon={LineChart}
                    title="입출고 추이"
                    subtitle="최근 30일 일별 합계"
                    info="최근 30일간 일별 입고 수량과 출고 수량 추이를 표시합니다. 평일 평균 150건, 주말 평균 200건 수준의 운영 패턴이 관찰됩니다."
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
                    infoTitle="재고 회전율 (Inventory Turnover)"
                    infoDefinition="월간 매출 수량을 평균 재고 수량으로 나눈 값으로, 평균 재고가 한 달에 몇 회 회전하는지를 나타내는 지표입니다."
                    infoBullets={[
                        "높을수록 빠르게 판매되는 카테고리이며, 발주 빈도 상향과 결품 방지가 핵심 과제입니다.",
                        "낮을수록 회전이 더디므로 발주량 축소 또는 할인·회수 정책 검토가 필요합니다.",
                        "예시: 화장품 5.7회/월은 평균 재고가 약 5일 주기로 소진·재발주됨을 의미합니다.",
                    ]}
                    height={300}
                >
                    <CategoryTurnoverBar />
                </ChartCard>

                <ChartCard
                    Icon={Radar}
                    title="자주 알림 발생 SKU TOP 5"
                    subtitle="안전 재고 미달 빈도"
                    infoTitle="자주 알림 발생 SKU"
                    infoDefinition="최근 안전 재고 알림이 가장 빈번하게 발생한 SKU 상위 5개를 표시합니다."
                    infoBullets={[
                        "SKU는 재고 관리의 가장 작은 식별 단위를 의미합니다 (예: 트렌치 코트 베이지 M).",
                        "반복적 알림 발생은 발주 정책 재검토 대상 SKU의 신호입니다.",
                        "또는 안전 재고 기준 수량을 상향 조정해야 하는 후보군에 해당합니다.",
                    ]}
                    height={300}
                >
                    <FrequentAlertSkuRadar />
                </ChartCard>

                <ChartCard
                    Icon={BarChart3}
                    title="일별 입고 vs 출고"
                    subtitle="최근 7일"
                    info="최근 7일간 일별 입고 건수와 출고 건수를 비교합니다. 출고가 입고를 크게 앞서면 재고 소진 신호이며, 입고만 누적될 경우 재고 적체 위험이 있어 균형 모니터링이 필요합니다."
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
