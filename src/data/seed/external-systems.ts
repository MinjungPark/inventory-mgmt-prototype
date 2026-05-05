/**
 * @file src/data/seed/external-systems.ts
 * @description 외부 시스템 연동 패턴 시드 — 5종 시스템 × 연동 방식·빈도·데이터·역할.
 *
 *  RFP 정합:
 *   - "본사 발급 API 키를 활용한 데이터 호출 및 자체 DB 적재 로직 구축"
 *   - 지원 자격: ERP 연동 경험 / 우대: 레거시 코드 분석·마이그레이션
 *
 *  본 IOM이 단순 재고 대시보드가 아닌, 본사가 보유한 여러 시스템과 매장·외부사를
 *  통합하는 *허브* 임을 명시적으로 시각화합니다.
 */

export type IntegrationDirection =
    | "in"          // 외부 → IOM (Pull)
    | "out"         // IOM → 외부 (Push)
    | "both"        // 양방향
    | "internal";   // 본사 통합 DB 직접 참조 (네트워크 호출 아님)

export type IntegrationStatus =
    | "required"     // RFP 명시 — 필수
    | "recommended"  // 운영 상식 — 권장
    | "optional";    // 환경에 따라 선택

export interface ExternalSystem {
    id: string;
    /** 시스템 이름 */
    name: string;
    /** 한 줄 정의 */
    summary: string;
    /** 연동 방향 */
    direction: IntegrationDirection;
    /** 연동 방식 (REST API · 표준 스키마 · CSV 등) */
    method: string;
    /** 연동 빈도 */
    frequency: string;
    /** 주고받는 데이터 */
    dataExamples: string[];
    /** 본 IOM에서의 역할 — 영업 메시지 */
    iomRole: string;
    /** 도입 상태 */
    status: IntegrationStatus;
    /** RFP 근거 (있으면) */
    rfpHint?: string;
}

export const EXTERNAL_SYSTEMS: ExternalSystem[] = [
    {
        id: "hq-erp",
        name: "본사 ERP",
        summary: "단가·발주 결재·전사 자원 관리",
        direction: "both",
        method: "REST API + 표준 스키마",
        frequency: "마스터 데이터: 시간당 1회 / 발주 결재: 즉시",
        dataExamples: [
            "단가 · 할인율 · 프로모션 가격 정책",
            "신규 SKU 등록 · 단가 변경 사항",
            "발주 결재 트리거 (안전 재고 미달 시)",
        ],
        iomRole: "본 시스템의 단가·결재 백엔드. 매장 입출고와 결합해 본사 결재 완결성 확보.",
        status: "required",
        rfpHint: "RFP 지원 자격: ERP 연동 경험 명시",
    },
    {
        id: "logistics",
        name: "외부 물류사",
        summary: "CJ·한진 등 발송·배송 트래킹",
        direction: "both",
        method: "REST API + Webhook",
        frequency: "발송 등록: 즉시 / 배송 상태: Webhook 수신",
        dataExamples: [
            "출고 → 발송 운송장 번호 동기화",
            "배송 진행 상태 Webhook 수신",
            "도착 확인 → 입고 자동 적재",
        ],
        iomRole: "매장↔창고 이동(트래킹 화면)의 외부 구간을 데이터로 연결. 운송장 번호로 추적성 확보.",
        status: "recommended",
    },
    {
        id: "plm",
        name: "PLM (제품 라이프사이클)",
        summary: "BOM · 사양 마스터 · 도면",
        direction: "in",
        method: "표준 스키마 또는 CSV 마이그레이션",
        frequency: "초기 1회 마이그레이션 + 변경 시 동기화",
        dataExamples: [
            "SKU 마스터의 사양 정보 (재질·치수)",
            "BOM (Bill of Materials)",
            "신규 제품 등록 시 사양 수신",
        ],
        iomRole: "본사가 PLM 보유 시 즉시 연동. 미보유 시 IOM 자체 SKU 마스터로 대체 가능.",
        status: "optional",
        rfpHint: "RFP 우대: 레거시 코드 분석·마이그레이션 경험",
    },
    {
        id: "store-pos",
        name: "매장 POS",
        summary: "매장 측 자체 POS·판매 시스템",
        direction: "in",
        method: "REST API (본사 발급 API 키 인증)",
        frequency: "발생 시 즉시",
        dataExamples: [
            "매장 입출고 트랜잭션",
            "판매 발생 즉시 재고 차감",
            "매장 단위 일별 정산",
        ],
        iomRole: "매장이 POS를 보유한 경우 직접 연동. 미보유 매장은 IOM 웹 화면으로 직접 등록 가능.",
        status: "optional",
    },
    {
        id: "hq-internal-db",
        name: "본사 통합 DB (내부 영역)",
        summary: "인사 · 회계 · 구매 · CRM 등 기존 영역",
        direction: "internal",
        method: "동일 DB 인스턴스 직접 참조 (네트워크 호출 없음)",
        frequency: "조회 시 실시간",
        dataExamples: [
            "사용자 인증 정보 (관리자 계정)",
            "조직도 · 매장 마스터 (이름·주소)",
            "회계 코드 매핑 (재고 자산 계정)",
        ],
        iomRole: "본 IOM이 본사 DB의 신축 영역(재고 관리 섹션)에 위치하므로 기존 영역과 동일 인스턴스에서 조회 가능. 별도 API 호출 불필요.",
        status: "required",
    },
];

export const INTEGRATION_DIRECTION_LABEL: Record<IntegrationDirection, string> = {
    in: "수신",
    out: "송신",
    both: "양방향",
    internal: "내부 참조",
};

export const INTEGRATION_STATUS_LABEL: Record<IntegrationStatus, string> = {
    required: "필수",
    recommended: "권장",
    optional: "선택",
};
