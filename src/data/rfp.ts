/**
 * @file src/data/rfp.ts
 * @description RFP "2. 상세 기능 요구 사항" 본문 트리 — 위시캣 공고 155033 인용.
 *              화면 헤더 호버 시 위계 그대로 노출하기 위해 한 곳에 박아둠.
 */

export interface RfpItem {
    id: string;        // "2-1-①"
    label: string;     // "①"
    text: string;      // 본문
}

export interface RfpSection {
    id: string;        // "2-1"
    title: string;     // "통합 대시보드 UI/UX 이관 및 고도화"
    items: RfpItem[];
}

export const RFP_TREE: RfpSection[] = [
    {
        id: "2-1",
        title: "통합 대시보드 UI/UX 이관 및 고도화",
        items: [
            { id: "2-1-①", label: "①", text: "오프라인 매장 구역 및 존에 따른 잔여 재고 수량 현황 시각화" },
            { id: "2-1-②", label: "②", text: "창고별 보유 재고 및 품목 현황 시각화" },
            { id: "2-1-③", label: "③", text: "매장 및 창고 간 입출고 트래킹 데이터 및 추이 리스트 출력" },
        ],
    },
    {
        id: "2-2",
        title: "API 연동 및 자동화 구축",
        items: [
            { id: "2-2-①", label: "①", text: "본사 발급 API 키를 활용한 데이터 호출 및 자체 DB 적재 로직 구축" },
            { id: "2-2-②", label: "②", text: "기존 직원이 수동으로 데이터를 다운로드 및 업로드하던 영역에 API 연동" },
        ],
    },
    {
        id: "2-3",
        title: "안전 재고 알림 모듈",
        items: [
            { id: "2-3-①", label: "①", text: "매장 내 특정 품목의 재고가 관리자 설정 수량 이하로 하락 시 감지 기능 구현" },
            { id: "2-3-②", label: "②", text: "감지 시 대시보드 내 팝업 또는 시스템 얼럿 노출 기능" },
        ],
    },
];
