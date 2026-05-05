/**
 * @file src/components/common/SystemStructureDiagram.tsx
 * @description 시스템 구조도 — 본사 DB 신축 영역 + 매장 입력 + 관리자 Setup/Operation.
 *              ENERTORK 톤(블루 단색 + 회색)으로 인라인 SVG 직접 그림.
 *
 *  레이아웃 (1000 × 660):
 *    상단 띠 (관리자 Setup) — RFP 2-3 ① 임계값 설정 흐름
 *    중앙 본문 — 좌측 입력 / 중앙 본사 DB / 우측 출력 화면
 *    하단 우측 (관리자 Operation) — 알림 수신·확인·해결
 *
 *  현재 화면(currentSectionId)을 받아서 해당 섹션의 박스/화살표를 강조.
 *
 *  여백·줄 간격 정정 (캡틴 지시):
 *   - 박스 높이: 60 → 76 / API 게이트웨이 38 → 50 / DB 내부 박스 32 → 40
 *   - 메인↔서브 라벨 줄 간격: 20px → 28px
 *   - viewBox 580 → 660 (전체 콘텐츠 높이 +80)
 *   - 폰트 사이즈는 그대로 유지 (14.5/13.5/14/13)
 */

"use client";

interface SystemStructureDiagramProps {
    /** 현재 화면이 속한 RFP 섹션 (예: '2-2'). 강조 표시용 */
    currentSectionId?: string;
}

const PRIMARY = "#0d47a1";
const PRIMARY_BG = "#e8eef6";
const PRIMARY_BG_DEEP = "#dbe6f5";
const TEXT_DARK = "#1a1a1a";
const TEXT_MID = "#4a5568";
// 보조 라벨 톤 — slate-400(#94a3b8)이 너무 옅어 위계가 약했음.
//   slate-500(#64748b)로 한 톤 업 — TEXT_MID와는 명도 차이 유지하면서 가독성 보강.
const TEXT_LIGHT = "#64748b";
const LINE = "#cbd5e1";
const LINE_DEEP = "#94a3b8";

export default function SystemStructureDiagram({
    currentSectionId,
}: SystemStructureDiagramProps) {
    const is21 = currentSectionId === "2-1";
    const is22 = currentSectionId === "2-2";
    const is23 = currentSectionId === "2-3";

    return (
        <svg
            viewBox="0 0 1000 660"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            role="img"
            aria-label="시스템 구조도"
        >
            <defs>
                {/* 화살표 마커 — 옅은 회색 / Primary 블루 */}
                <marker
                    id="arrow-line"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE_DEEP} />
                </marker>
                <marker
                    id="arrow-primary"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={PRIMARY} />
                </marker>
            </defs>

            {/* ========== 상단 띠 — 관리자 Setup (RFP 2-3 ①) ========== */}
            {/*  높이 78 → 92, 띠 헤더 라벨과 박스 사이 여백 확장
                평소 배경: #e8eef6 (Primary BG) — 인트로 페이지 배경(#f1f5f9)과 모달 흰 배경 양쪽에서 띠 영역 시각 구분 */}
            <g>
                <rect
                    x="20"
                    y="20"
                    width="960"
                    height="92"
                    rx="6"
                    fill={PRIMARY_BG}
                    stroke={is23 ? PRIMARY : "#e2e8f0"}
                    strokeWidth={is23 ? 1.5 : 1}
                />
                <text x="40" y="48" fontSize="14.5" fontWeight="700" fill={is23 ? PRIMARY : TEXT_MID} letterSpacing="0.5">
                    상단 — 관리자 Setup · RFP 2-3 ①
                </text>

                {/* 관리자 (Setup) — 박스 32 → 40, 텍스트 중앙 정렬 */}
                <g>
                    <rect x="40" y="62" width="230" height="40" rx="6" fill="#ffffff" stroke={is23 ? PRIMARY : LINE} strokeWidth="1.2" />
                    <text x="155" y="86" fontSize="14.5" fontWeight="600" fill={TEXT_DARK} textAnchor="middle">
                        관리자
                    </text>
                </g>

                {/* 화살표 1: 관리자 → DB 재고 관리 섹션 (y 72 → 82) */}
                <line x1="275" y1="82" x2="478" y2="82" stroke={is23 ? PRIMARY : LINE_DEEP} strokeWidth="1.5" markerEnd={is23 ? "url(#arrow-primary)" : "url(#arrow-line)"} />
                <text x="376" y="76" fontSize="14.5" fontWeight="600" fill={is23 ? PRIMARY : TEXT_MID} textAnchor="middle">
                    임계값 · 알림 기준 설정
                </text>

                {/* 중간 노드: 본사 DB 재고 관리 섹션 — 박스 32 → 40 */}
                <g>
                    <rect x="478" y="62" width="240" height="40" rx="6" fill={is23 ? PRIMARY_BG : "#ffffff"} stroke={is23 ? PRIMARY : LINE} strokeWidth={is23 ? 1.5 : 1.2} />
                    <text x="598" y="86" fontSize="14.5" fontWeight="600" fill={is23 ? PRIMARY : TEXT_DARK} textAnchor="middle">
                        본사 DB · 재고 관리 섹션
                    </text>
                </g>

                {/* 화살표 2: DB → 화면 8 */}
                <line x1="718" y1="82" x2="775" y2="82" stroke={is23 ? PRIMARY : LINE_DEEP} strokeWidth="1.5" markerEnd={is23 ? "url(#arrow-primary)" : "url(#arrow-line)"} />

                {/* 화면 8 매핑 — 박스 32 → 40 */}
                <g>
                    <rect x="775" y="62" width="180" height="40" rx="6" fill="#ffffff" stroke={is23 ? PRIMARY : LINE} strokeWidth="1.2" />
                    <text x="865" y="86" fontSize="14.5" fontWeight={is23 ? "700" : "500"} fill={is23 ? PRIMARY : TEXT_MID} textAnchor="middle">
                        화면 8 · 알림 설정
                    </text>
                </g>
            </g>

            {/* ========== 중앙 본문 ========== */}
            {/* 좌측 키 발급 대상 — 매장 + 외부 시스템 2종
                박스 60 → 76, 메인↔서브 간격 20 → 28, 박스 위치 재배치 */}
            <g>
                <text x="40" y="146" fontSize="14.5" fontWeight="700" fill={TEXT_MID} letterSpacing="0.5">
                    키 발급 대상 · RFP 2-2
                </text>

                {/* 매장 — 박스 76, 메인 y=200 / 서브 y=228 (28px 간격) */}
                <rect x="40" y="186" width="230" height="76" rx="6" fill="#ffffff" stroke={is22 ? PRIMARY : LINE} strokeWidth={is22 ? 1.5 : 1.2} />
                <text x="155" y="216" fontSize="14.5" fontWeight="700" fill={TEXT_DARK} textAnchor="middle">매장</text>
                <text x="155" y="244" fontSize="13.5" fill={TEXT_LIGHT} textAnchor="middle">매장 단위 발급 · R / R/W</text>

                {/* 외부 시스템 — 박스 76 (간격 20 유지) */}
                <rect x="40" y="290" width="230" height="76" rx="6" fill="#ffffff" stroke={is22 ? PRIMARY : LINE} strokeWidth={is22 ? 1.5 : 1.2} />
                <text x="155" y="320" fontSize="14.5" fontWeight="700" fill={TEXT_DARK} textAnchor="middle">외부 시스템</text>
                <text x="155" y="348" fontSize="13.5" fill={TEXT_LIGHT} textAnchor="middle">기관 단위 발급 · ERP · 물류사 등</text>

                {/* RBAC 게이트웨이 — 박스 50 → 60, 위·아래 패딩 균형 (위 22 / 아래 18) */}
                <rect x="40" y="394" width="230" height="60" rx="6" fill={PRIMARY_BG} stroke={PRIMARY} strokeWidth="1.2" strokeDasharray="4 3" />
                <text x="155" y="418" fontSize="14.5" fontWeight="700" fill={PRIMARY} textAnchor="middle">API 키 게이트웨이</text>
                <text x="155" y="442" fontSize="13.5" fill={PRIMARY} textAnchor="middle">RBAC 권한 검증</text>
            </g>

            {/* 좌 → 중 화살표 (2개) — 매장 박스 중앙 224 / 외부 시스템 박스 중앙 328 */}
            <line x1="275" y1="224" x2="358" y2="224" stroke={is22 ? PRIMARY : LINE_DEEP} strokeWidth={is22 ? 1.5 : 1.2} markerEnd={is22 ? "url(#arrow-primary)" : "url(#arrow-line)"} />
            <line x1="275" y1="328" x2="358" y2="328" stroke={is22 ? PRIMARY : LINE_DEEP} strokeWidth={is22 ? 1.5 : 1.2} markerEnd={is22 ? "url(#arrow-primary)" : "url(#arrow-line)"} />

            {/* ========== 중앙 본사 DB ==========
                전체 외곽 296 → 330 (내부 박스 늘어난 만큼) */}
            <g>
                {/* 본사 DB 외곽 (전체) */}
                <rect x="358" y="146" width="360" height="330" rx="8" fill="#fafbfc" stroke={LINE} strokeWidth="1.2" />
                <text x="538" y="166" fontSize="14.5" fontWeight="700" fill={TEXT_MID} textAnchor="middle" letterSpacing="0.5">
                    본사 통합 DB
                </text>

                {/* 기존 영역 (인사·회계 등) — 박스 46 → 54, 줄 간격 16 → 22 */}
                <rect x="374" y="180" width="328" height="54" rx="6" fill="#ffffff" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
                <text x="538" y="201" fontSize="13.5" fontWeight="500" fill={TEXT_LIGHT} textAnchor="middle">기존 영역 (인사 · 회계 · 구매 · CRM)</text>
                <text x="538" y="223" fontSize="13.5" fill={TEXT_LIGHT} textAnchor="middle">이번 사업 범위 외 — 기존 시스템 유지</text>

                {/* ★ 신축 영역 — 재고 관리 섹션 (190 → 218) */}
                <rect x="374" y="248" width="328" height="218" rx="8" fill={PRIMARY_BG} stroke={PRIMARY} strokeWidth="1.8" />
                <text x="538" y="271" fontSize="14" fontWeight="700" fill={PRIMARY} textAnchor="middle">
                    재고 관리 섹션 (이번 사업 신축)
                </text>

                {/* 신축 영역 내부 4개 테이블 — 박스 32 → 40, y 좌표 재배치 */}
                <rect x="388" y="284" width="144" height="40" rx="4" fill="#ffffff" stroke={PRIMARY} strokeWidth="1" />
                <text x="460" y="308" fontSize="14" fontWeight="600" fill={TEXT_DARK} textAnchor="middle">SKU · 매장 · 창고</text>

                <rect x="544" y="284" width="144" height="40" rx="4" fill="#ffffff" stroke={PRIMARY} strokeWidth="1" />
                <text x="616" y="308" fontSize="14" fontWeight="600" fill={TEXT_DARK} textAnchor="middle">입출고 트랜잭션</text>

                <rect x="388" y="332" width="144" height="40" rx="4" fill="#ffffff" stroke={is23 ? PRIMARY : LINE} strokeWidth={is23 ? 1.5 : 1} />
                <text x="460" y="356" fontSize="14" fontWeight="600" fill={is23 ? PRIMARY : TEXT_DARK} textAnchor="middle">알림 임계값</text>

                <rect x="544" y="332" width="144" height="40" rx="4" fill="#ffffff" stroke={is23 ? PRIMARY : LINE} strokeWidth={is23 ? 1.5 : 1} />
                <text x="616" y="356" fontSize="14" fontWeight="600" fill={is23 ? PRIMARY : TEXT_DARK} textAnchor="middle">알림 이벤트</text>

                {/* 안전 재고 감지 엔진 — 박스 48 → 60, 줄 간격 16 → 22 */}
                <rect x="388" y="392" width="300" height="60" rx="6" fill="#ffffff" stroke={is23 ? PRIMARY : LINE} strokeWidth={is23 ? 1.5 : 1.2} />
                <text x="538" y="415" fontSize="14" fontWeight="700" fill={is23 ? PRIMARY : TEXT_MID} textAnchor="middle">
                    안전 재고 감지 엔진
                </text>
                <text x="538" y="437" fontSize="13" fill={is23 ? PRIMARY : TEXT_LIGHT} textAnchor="middle">
                    현재 수량 vs 임계값 자동 비교 — RFP 2-3 ②
                </text>
            </g>

            {/* 중 → 우 화살표 (5개 — 화면별)
                박스 사이 간격 확장(42 → 50)에 맞춰 y 좌표 재정렬 */}
            <line x1="718" y1="190" x2="800" y2="190" stroke={is21 ? PRIMARY : LINE_DEEP} strokeWidth={is21 ? 1.5 : 1.2} markerEnd={is21 ? "url(#arrow-primary)" : "url(#arrow-line)"} />
            <line x1="718" y1="240" x2="800" y2="240" stroke={is21 ? PRIMARY : LINE_DEEP} strokeWidth={is21 ? 1.5 : 1.2} markerEnd={is21 ? "url(#arrow-primary)" : "url(#arrow-line)"} />
            <line x1="718" y1="290" x2="800" y2="290" stroke={is21 ? PRIMARY : LINE_DEEP} strokeWidth={is21 ? 1.5 : 1.2} markerEnd={is21 ? "url(#arrow-primary)" : "url(#arrow-line)"} />
            <line x1="718" y1="340" x2="800" y2="340" stroke={is21 ? PRIMARY : LINE_DEEP} strokeWidth={is21 ? 1.5 : 1.2} markerEnd={is21 ? "url(#arrow-primary)" : "url(#arrow-line)"} />
            <line x1="718" y1="430" x2="800" y2="430" stroke={is23 ? PRIMARY : LINE_DEEP} strokeWidth={is23 ? 1.5 : 1.2} markerEnd={is23 ? "url(#arrow-primary)" : "url(#arrow-line)"} />

            {/* 우측 출력 화면 — 박스 32 → 40, 박스 간격 42 → 50 (10px 여백 확보) */}
            <g>
                <text x="800" y="146" fontSize="14.5" fontWeight="700" fill={TEXT_MID} letterSpacing="0.5">
                    출력 화면 · RFP 2-1 / 2-3 ②
                </text>

                <rect x="800" y="170" width="180" height="40" rx="6" fill="#ffffff" stroke={is21 ? PRIMARY : LINE} strokeWidth={is21 ? 1.5 : 1.2} />
                <text x="890" y="194" fontSize="14.5" fontWeight={is21 ? "700" : "500"} fill={is21 ? PRIMARY : TEXT_MID} textAnchor="middle">화면 2 · 종합 대시보드</text>

                <rect x="800" y="220" width="180" height="40" rx="6" fill="#ffffff" stroke={is21 ? PRIMARY : LINE} strokeWidth={is21 ? 1.5 : 1.2} />
                <text x="890" y="244" fontSize="14.5" fontWeight={is21 ? "700" : "500"} fill={is21 ? PRIMARY : TEXT_MID} textAnchor="middle">화면 3 · 매장 재고</text>

                <rect x="800" y="270" width="180" height="40" rx="6" fill="#ffffff" stroke={is21 ? PRIMARY : LINE} strokeWidth={is21 ? 1.5 : 1.2} />
                <text x="890" y="294" fontSize="14.5" fontWeight={is21 ? "700" : "500"} fill={is21 ? PRIMARY : TEXT_MID} textAnchor="middle">화면 4 · 창고 재고</text>

                <rect x="800" y="320" width="180" height="40" rx="6" fill="#ffffff" stroke={is21 ? PRIMARY : LINE} strokeWidth={is21 ? 1.5 : 1.2} />
                <text x="890" y="344" fontSize="14.5" fontWeight={is21 ? "700" : "500"} fill={is21 ? PRIMARY : TEXT_MID} textAnchor="middle">화면 5 · 입출고 트래킹</text>

                <rect x="800" y="410" width="180" height="40" rx="6" fill={is23 ? PRIMARY_BG_DEEP : "#ffffff"} stroke={is23 ? PRIMARY : LINE} strokeWidth={is23 ? 1.5 : 1.2} />
                <text x="890" y="434" fontSize="14.5" fontWeight={is23 ? "700" : "500"} fill={is23 ? PRIMARY : TEXT_MID} textAnchor="middle">화면 7 · 알림</text>
            </g>

            {/* ========== 하단 띠 — 관리자 Operation (RFP 2-3 ②) ==========
                위치 446 → 506 (전체 콘텐츠 늘어난 만큼) / 높이 74 → 86 / 박스 32 → 40
                평소 배경: #e8eef6 (Primary BG) — 상단 띠와 동일 톤 */}
            <g>
                <rect
                    x="20"
                    y="506"
                    width="960"
                    height="86"
                    rx="6"
                    fill={PRIMARY_BG}
                    stroke={is23 ? PRIMARY : "#e2e8f0"}
                    strokeWidth={is23 ? 1.5 : 1}
                />
                <text x="40" y="534" fontSize="14.5" fontWeight="700" fill={is23 ? PRIMARY : TEXT_MID} letterSpacing="0.5">
                    하단 — 관리자 Operation · RFP 2-3 ②
                </text>

                {/* 관리자 (Operation) — 박스 32 → 40 */}
                <rect x="775" y="544" width="180" height="40" rx="6" fill="#ffffff" stroke={is23 ? PRIMARY : LINE} strokeWidth="1.2" />
                <text x="865" y="568" fontSize="14.5" fontWeight="600" fill={TEXT_DARK} textAnchor="middle">
                    관리자
                </text>

                {/* 화살표: 화면 7 → 관리자 (450 → 544) */}
                <line x1="890" y1="450" x2="890" y2="544" stroke={is23 ? PRIMARY : LINE_DEEP} strokeWidth={is23 ? 1.5 : 1.2} markerEnd={is23 ? "url(#arrow-primary)" : "url(#arrow-line)"} />

                <text x="40" y="562" fontSize="13.5" fontWeight="500" fill={TEXT_MID}>
                    임계값 미달 자동 감지 → 대시보드 알림 노출 → 관리자 확인 · 해결
                </text>
            </g>

            {/* 하단 캡션 — 영업 카피 (핵심 멘트) — 위치 552/572 → 622/644 */}
            <g>
                <text x="500" y="622" fontSize="15.5" fontWeight="700" fill={TEXT_DARK} textAnchor="middle">
                    매장이 등록하고, 관리자가 설정하고, 시스템이 감지합니다.
                </text>
                <text x="500" y="644" fontSize="13.5" fill={TEXT_LIGHT} textAnchor="middle">
                    RFP 2-1 · 2-2 · 2-3 = 본사 DB 신축 영역 + 게이트웨이 + 대시보드 + 알림 모듈
                </text>
            </g>
        </svg>
    );
}
