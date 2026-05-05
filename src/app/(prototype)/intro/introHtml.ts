/**
 * @file src/app/(prototype)/intro/introHtml.ts
 * @description 프로토타입 소개 본문 HTML — 두 덩어리(Before / After)로 분할.
 *
 *  IntroPage 에서 Before → SystemStructureDiagram(React) → After 순으로 렌더링.
 *  스타일은 intro.css 의 .intro-scope 컨테이너 안에서만 적용됨.
 *
 *  섹션 6개 + Cover + Footer + 시스템 구조도 슬롯 1개:
 *    Cover · Section 1 · Section 2 · Section 3 · [구조도 슬롯] · Section 4 · Section 5 · Section 6 · Footer
 *
 *  각 섹션에 id="section-1" ~ "section-6" 부여 (좌측 TOC 스크롤 타겟).
 */

// ============================================================================
//  PART 1 — Cover ~ Section 3 (To-Be)
// ============================================================================
export const introHtmlBefore = `<div class="page">

<div class="cover">
<div class="cover-label">IOM Prototype — Introduction</div>
<h1>매장·창고 재고 관리를 본사 통합 데이터 레이어로 재설계합니다</h1>
<p class="subtitle">매장 직원의 CSV 일배치와 본사 직원의 수기 등록으로 운영되던 재고 동기화를, 본사 DB 신축 영역 + API 게이트웨이 + 통합 대시보드 + 알림 모듈의 일체형 시스템으로 재구성한 프로토타입입니다.</p>
<div class="cover-meta"><span>Version 0.1</span><span>2026년 5월</span><span>Confidential</span></div>
</div>

<div class="content">

<!-- ============================================ -->
<!-- Section 01 — 프로토타입 소개 -->
<!-- ============================================ -->
<div class="section" id="section-1">
<div class="section-number">Section 01</div>
<h2>프로토타입 소개</h2>
<p class="section-sub">왜 이 프로토타입을 만들었는가 — 시스템이 어떻게 설계되어야 하는지에 대한 답변</p>

<p>현재 본사에서는 매장·창고 단위의 재고 데이터를 매장별 CSV 송부와 본사 직원의 수기 등록을 통해 취합하고 있습니다. 이 과정에서 직원 의존도가 높고, 데이터 갱신 주기가 길어 안전 재고 미달과 같은 시급한 의사결정이 늦어지는 구조적 위험이 누적되고 있습니다.</p>

<p>본 시스템은 본사가 보유한 통합 데이터베이스 위에 <strong>재고 관리 전용 섹션</strong>을 신축하고, 그 위에 <strong>API 게이트웨이 + 통합 대시보드 + 안전 재고 알림 모듈</strong>을 얹는 일체형 운영 레이어로 정의됩니다. 매장과 외부 시스템(본사 ERP·물류사 등)은 본사가 발급한 권한 토큰(API 키)을 통해 자기 영역에 한정된 read·write 작업을 수행하며, 본사 관리자는 그 위에서 임계값을 설정하고 알림을 수신·해결합니다.</p>

<p>본 프로토타입은 RFP 2-1 (통합 대시보드)·2-2 (API 연동·자동화)·2-3 (안전 재고 알림 모듈)을 모두 한 시스템 안에서 응집되도록 설계한 결과물입니다.</p>

<p><strong>본 시스템은 매장·외부 시스템·본사 관리자 3 주체와 본사 통합 DB를 단일 게이트웨이로 연결합니다.</strong></p>

<div class="diagram">
<div class="diagram-label">Target System Architecture</div>
<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="본 IOM 시스템과 본사 통합 DB 연동 아키텍처">
<defs>
<marker id="ah1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="d-arrow-head"/></marker>
<marker id="ah1b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="d-arrow-blue-head"/></marker>
</defs>

<!-- 사용자/주체 영역 -->
<text x="380" y="22" text-anchor="middle" class="d-title">시스템 주체</text>
<rect x="80" y="36" width="180" height="46" rx="4" class="d-box"/>
<text x="170" y="56" text-anchor="middle" class="d-label">매장 직원</text>
<text x="170" y="73" text-anchor="middle" class="d-label-sub">POS · CSV · 웹 입력</text>

<rect x="290" y="36" width="180" height="46" rx="4" class="d-box"/>
<text x="380" y="56" text-anchor="middle" class="d-label">외부 시스템</text>
<text x="380" y="73" text-anchor="middle" class="d-label-sub">본사 ERP · 물류사</text>

<rect x="500" y="36" width="180" height="46" rx="4" class="d-box"/>
<text x="590" y="56" text-anchor="middle" class="d-label">본사 관리자</text>
<text x="590" y="73" text-anchor="middle" class="d-label-sub">임계값 설정 · 알림 수신</text>

<!-- 화살표: 주체 → API 게이트웨이 -->
<path d="M 170 82 L 170 118" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 380 82 L 380 118" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 590 82 L 590 118" class="d-arrow" marker-end="url(#ah1)"/>

<!-- API 게이트웨이 -->
<rect x="60" y="120" width="640" height="44" rx="4" class="d-box-primary" stroke-dasharray="4 3"/>
<text x="380" y="140" text-anchor="middle" class="d-title-primary">API 게이트웨이 — RBAC 권한 검증</text>
<text x="380" y="156" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85">매장·외부사·관리자별 키 기반 read·write 분기</text>

<!-- 화살표: 게이트웨이 → 본 시스템 -->
<path d="M 380 164 L 380 196" class="d-arrow-blue" marker-end="url(#ah1b)"/>

<!-- 본 IOM 시스템 -->
<rect x="60" y="200" width="640" height="76" rx="6" class="d-box-primary"/>
<text x="380" y="226" text-anchor="middle" class="d-title-primary">본 IOM 시스템 (이번 구축 대상)</text>
<text x="380" y="248" text-anchor="middle" style="font-size:12px;font-weight:500;fill:#0d47a1">통합 대시보드 · 입출고 트래킹 · 자동 동기화 · 안전 재고 알림</text>
<text x="380" y="265" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85">Inventory Operations Management Layer</text>

<!-- 양방향 화살표: 본 시스템 ↔ 본사 통합 DB -->
<path d="M 200 286 L 200 322" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 185 322 L 185 286" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 380 286 L 380 322" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 365 322 L 365 286" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 560 286 L 560 322" class="d-arrow" marker-end="url(#ah1)"/>
<path d="M 545 322 L 545 286" class="d-arrow" marker-end="url(#ah1)"/>

<rect x="246" y="298" width="268" height="16" fill="#f8fafc"/>
<text x="380" y="310" text-anchor="middle" class="d-label-sub" style="letter-spacing:1px">본사 통합 DB와 양방향 연동 — 신축 영역만 대상</text>

<!-- 본사 통합 DB -->
<rect x="60" y="324" width="640" height="32" rx="4" class="d-box"/>
<text x="120" y="345" class="d-label" style="font-weight:600">본사 통합 DB</text>
<rect x="200" y="332" width="160" height="18" fill="#fff" stroke="#cbd5e1" stroke-dasharray="3 2" rx="3"/>
<text x="280" y="345" text-anchor="middle" class="d-label-sub">기존 영역 (인사·회계·구매)</text>
<rect x="370" y="332" width="220" height="18" fill="#e8eef6" stroke="#0d47a1" rx="3"/>
<text x="480" y="345" text-anchor="middle" class="d-label-primary">★ 재고 관리 섹션 (이번 신축)</text>
</svg>
</div>

</div>


<!-- ============================================ -->
<!-- Section 02 — 고객의 현재 상황 (As-Is) -->
<!-- ============================================ -->
<div class="section" id="section-2">
<div class="section-number">Section 02</div>
<h2>고객의 현재 상황 (As-Is)</h2>
<p class="section-sub">현재 매장·본사 간 재고 관리 워크플로우에 대한 분석</p>

<p>매장에서는 일별·주별 단위로 매장 직원이 자체 양식의 재고 현황 CSV를 작성하여 본사에 송부하고, 본사 직원은 다수 매장에서 받은 파일을 수신·정리·검증한 뒤 본사 ERP에 수기로 다시 입력하는 4단계 일배치를 수행합니다. 이 과정에서 입력 시점과 본사 반영 시점 사이에 6시간~3일 단위의 시차가 발생하고 있는 것으로 추정됩니다.</p>

<p>각 매장이 사용하는 양식과 항목 분류가 통일되지 않은 점, 본사 직원이 수기 입력 단계에서 음수 단가나 SKU 코드 형식 오류 등을 즉시 검증하기 어려운 점은 신규 직원의 학습 곡선을 길어지게 하고 베테랑 퇴사 시 매장 응대 노하우가 시스템 외부에 잔존하는 구조적 위험을 만들고 있습니다.</p>

<div class="diagram">
<div class="diagram-label">현재 재고 동기화 워크플로우 — 4단계 일배치</div>
<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="현재 재고 동기화 4단계 수작업">
<defs>
<marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="d-arrow-head"/></marker>
</defs>

<!-- 매장 직원 -->
<rect x="40" y="36" width="160" height="44" rx="4" class="d-box-accent"/>
<text x="120" y="56" text-anchor="middle" class="d-label-white">① 매장 직원</text>
<text x="120" y="72" text-anchor="middle" class="d-label-white" style="font-weight:400;opacity:0.78">CSV 작성</text>

<!-- 화살표 → ② -->
<path d="M 200 58 L 240 58" class="d-arrow" marker-end="url(#ah2)"/>

<!-- 본사 직원 수신 -->
<rect x="240" y="36" width="160" height="44" rx="4" class="d-box"/>
<text x="320" y="56" text-anchor="middle" class="d-label">② 본사 직원</text>
<text x="320" y="72" text-anchor="middle" class="d-label-sub">CSV 수신 · 메일 정리</text>

<path d="M 400 58 L 440 58" class="d-arrow" marker-end="url(#ah2)"/>

<!-- 검증 -->
<rect x="440" y="36" width="160" height="44" rx="4" class="d-box"/>
<text x="520" y="56" text-anchor="middle" class="d-label">③ 검증</text>
<text x="520" y="72" text-anchor="middle" class="d-label-sub">엑셀 정리 · 형식 점검</text>

<path d="M 600 58 L 640 58" class="d-arrow" marker-end="url(#ah2)"/>

<!-- 본사 ERP 등록 -->
<rect x="640" y="36" width="100" height="44" rx="4" class="d-box"/>
<text x="690" y="56" text-anchor="middle" class="d-label">④ ERP 입력</text>
<text x="690" y="72" text-anchor="middle" class="d-label-sub">수기 등록</text>

<!-- 시간 측정 라벨 -->
<rect x="40" y="116" width="700" height="40" rx="4" fill="#fffbeb" stroke="#fde68a"/>
<text x="56" y="138" class="d-label" style="font-weight:600;fill:#92400e">⏱ 한 건당 평균 18분 — 매장 N개 × 일별 → 본사 직원 일평균 4시간 이상 소요</text>
<text x="56" y="152" class="d-label-sub" style="fill:#92400e">데이터 갱신 주기 6시간 ~ 3일 시차 — 안전 재고 미달 감지 지연 위험 누적</text>

<!-- 부정합 사례 -->
<rect x="40" y="176" width="340" height="80" rx="4" class="d-box"/>
<text x="56" y="198" class="d-label" style="font-weight:700">자주 발생하는 부정합</text>
<text x="56" y="216" class="d-label-sub">· 매장별 양식 차이 — 컬럼명 ·  단위 불일치</text>
<text x="56" y="232" class="d-label-sub">· 음수 단가 · 음수 재고 등 검증 누락</text>
<text x="56" y="248" class="d-label-sub">· SKU 코드 형식 오류 — 신규 직원 입력 실수</text>

<!-- 재작업 사례 -->
<rect x="400" y="176" width="340" height="80" rx="4" class="d-box"/>
<text x="416" y="198" class="d-label" style="font-weight:700">재작업이 일상화되는 시점</text>
<text x="416" y="216" class="d-label-sub">· 안전 재고 조회 요청 시 — 처음부터 다시 취합</text>
<text x="416" y="232" class="d-label-sub">· 본사 ERP 단가 변경 — 매장에 다시 안내</text>
<text x="416" y="248" class="d-label-sub">· 베테랑 퇴사 — 노하우 시스템 외부 휘발</text>
</svg>
</div>

</div>


<!-- ============================================ -->
<!-- Section 03 — 프로토타입 방향 (To-Be) -->
<!-- ============================================ -->
<div class="section" id="section-3">
<div class="section-number">Section 03</div>
<h2>프로토타입의 방향 (To-Be)</h2>
<p class="section-sub">시스템의 정체성 — 본사 IT 자산 안에서의 위상 정의</p>

<p>본 시스템은 본사 ERP의 일부도 아니고, 매장 POS의 확장도 아닙니다. 두 영역 사이에 존재하는 <strong>IOM(Inventory Operations Management, 재고 운영 관리) 레이어</strong>로 정의되며, 이는 본사가 보유한 통합 DB의 재고 관련 영역과 매장·외부사의 입력 채널을 게이트웨이로 묶어 운영자에게 가시화하는 통합 운영 계층입니다. 즉 "어디에 무엇이 얼마나 있는가"를 다루는 영역이며, 이 영역의 시스템이 갖춰지면 본사 관리자는 매장 단위 재고 의사결정을 즉시·정확하게 수행할 수 있습니다.</p>

<div class="diagram">
<div class="diagram-label">본사 IT 시스템 영역 — 시스템 위상</div>
<svg viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="본사 IT 시스템 영역에서 IOM의 위치">
<defs>
<marker id="ah3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="d-arrow-head"/></marker>
</defs>

<text x="380" y="28" text-anchor="middle" class="d-title">본사 IT 시스템 영역</text>

<!-- 매장 / 외부 시스템 영역 -->
<rect x="60" y="56" width="200" height="76" rx="4" class="d-box"/>
<text x="160" y="80" text-anchor="middle" class="d-label" style="font-weight:700">매장 · 외부 시스템</text>
<text x="160" y="98" text-anchor="middle" class="d-label-sub">입출고 등록 · 판매 발생</text>
<text x="160" y="114" text-anchor="middle" class="d-label-sub">본사 발급 API 키로 접근</text>

<!-- IOM 영역 (강조) -->
<rect x="280" y="56" width="200" height="76" rx="6" class="d-box-primary"/>
<text x="380" y="80" text-anchor="middle" class="d-title-primary">IOM 영역</text>
<text x="380" y="98" text-anchor="middle" style="font-size:11px;font-weight:600;fill:#0d47a1">통합 재고 가시화 · 동기화 · 알림</text>
<text x="380" y="114" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85">← 본 프로젝트 (이번 구축 대상)</text>

<!-- ERP 영역 -->
<rect x="500" y="56" width="200" height="76" rx="4" class="d-box"/>
<text x="600" y="80" text-anchor="middle" class="d-label" style="font-weight:700">본사 ERP</text>
<text x="600" y="98" text-anchor="middle" class="d-label-sub">단가 · 회계 · 발주 결재</text>
<text x="600" y="114" text-anchor="middle" class="d-label-sub">전사 자원 관리</text>

<!-- 양방향 화살표 -->
<path d="M 260 86 L 280 86" class="d-arrow" marker-end="url(#ah3)"/>
<path d="M 280 102 L 260 102" class="d-arrow" marker-end="url(#ah3)"/>
<path d="M 480 86 L 500 86" class="d-arrow" marker-end="url(#ah3)"/>
<path d="M 500 102 L 480 102" class="d-arrow" marker-end="url(#ah3)"/>

<!-- 하단 영역 라벨 -->
<text x="160" y="156" text-anchor="middle" class="d-label-sub">"누가 등록했는가"</text>
<text x="380" y="156" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;font-weight:600">"어디에 얼마나 있는가"</text>
<text x="600" y="156" text-anchor="middle" class="d-label-sub">"얼마인가 · 누가 결재했는가"</text>
</svg>
</div>

<div class="diagram">
<div class="diagram-label">AS-IS vs TO-BE — 재고 동기화 흐름 변화</div>
<div class="compare">
<div class="compare-col">
<div class="compare-label">AS-IS · 현재</div>
<p>4단계 수작업 일배치 · 시간당 1건 미만</p>
<p>· <strong>매장 등록</strong> — 매장 양식 CSV 작성 (각자)</p>
<p>· <strong>본사 수신</strong> — 메일/공유드라이브 수신·정리</p>
<p>· <strong>검증</strong> — 엑셀 형식 점검·재요청</p>
<p>· <strong>ERP 등록</strong> — 본사 직원 수기 입력</p>
<p>· <strong>총 18분 / 건</strong></p>
</div>
<div class="compare-col">
<div class="compare-label ours">TO-BE · 본 시스템</div>
<p>API 직접 적재 · 본사 직원 개입 0회</p>
<p>· <strong>매장 등록</strong> — 본사 발급 API 키로 직접 적재</p>
<p>· <strong>게이트웨이 검증</strong> — RBAC 권한 + 형식 자동 검증</p>
<p>· <strong>본사 DB 즉시 적재</strong> — 본사 직원 개입 0회</p>
<p>· <strong>대시보드 즉시 반영</strong> — 안전 재고 자동 감지</p>
<p>· <strong>총 24초 / 건 (98% 단축)</strong></p>
</div>
</div>
</div>

<p>본 프로토타입에는 <strong>9개 화면</strong>이 포함되어 있어, 본사 관리자는 통합 대시보드에서 매장·창고·트래킹·동기화·알림·임계값 설정을 한 시스템 안에서 운영할 수 있습니다.</p>

</div>
</div>
</div>
`;

// ============================================================================
//  PART 2 — Section 4 ~ Footer
//   자가완결적 .page 컨테이너로 시작 — Before와 시각적으로 연속되도록 CSS에서
//   .page 끼리 마진 0 + border-radius 0 처리하면 자연스럽게 이어짐.
//
//  섹션 흐름 (시스템 구조도 직후로 외부 연동을 끌어올려 *시스템 구조 메시지* 한 묶음):
//   Section 04 — 기존 시스템과의 연동 아키텍처   ← 본문 마지막에 작성되어 있지만 라벨로 04 부여
//   Section 05 — 반영된 기능
//   Section 06 — 차별화 포인트
// ============================================================================

// 두 본문 블록을 변수로 분리하여 출력 시 새 순서(04 → 05 → 06)로 합성합니다.
const _section5_6Body = `<!-- ============================================ -->
<!-- Section 05 — 반영된 기능 (구 Section 04, 시스템 구조도 다음으로 흐름 재배치) -->
<!-- ============================================ -->
<div class="section" id="section-5">
<div class="section-number">Section 05</div>
<h2>프로토타입에 반영된 기능</h2>
<p class="section-sub">RFP 요구사항과 본사 운영 현실을 함께 담은 프로토타입</p>

<p>본 프로토타입은 RFP 2-1·2-2·2-3 요구사항을 모두 반영하면서, 본사 운영 단계에서 실제로 발생할 수 있는 사건(키 만료·파일 형식 오류·권한 외 호출 등)을 사전에 흡수하도록 설계되었습니다.</p>

<div class="diagram">
<div class="diagram-label">통합 운영 워크플로우 — 매장 입력에서 관리자 알림까지</div>
<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="매장 입력 → 본사 DB → 대시보드 → 관리자 알림">
<defs>
<marker id="ah4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="d-arrow-head"/></marker>
</defs>

<!-- 5단계 박스 — 회색 톤다운, 강조는 하단 박스 한 곳에만 -->
<rect x="20" y="40" width="130" height="60" rx="6" class="d-box"/>
<text x="85" y="62" text-anchor="middle" class="d-title" style="fill:#4a5568">STEP 1</text>
<text x="85" y="80" text-anchor="middle" class="d-label">매장 입력</text>
<text x="85" y="94" text-anchor="middle" class="d-label-sub">POS · CSV · 웹</text>

<path d="M 152 70 L 174 70" class="d-arrow" marker-end="url(#ah4)"/>

<rect x="174" y="40" width="130" height="60" rx="6" class="d-box"/>
<text x="239" y="62" text-anchor="middle" class="d-title" style="fill:#4a5568">STEP 2</text>
<text x="239" y="80" text-anchor="middle" class="d-label">권한 검증</text>
<text x="239" y="94" text-anchor="middle" class="d-label-sub">RBAC 게이트웨이</text>

<path d="M 306 70 L 328 70" class="d-arrow" marker-end="url(#ah4)"/>

<rect x="328" y="40" width="130" height="60" rx="6" class="d-box"/>
<text x="393" y="62" text-anchor="middle" class="d-title" style="fill:#4a5568">STEP 3</text>
<text x="393" y="80" text-anchor="middle" class="d-label">DB 적재</text>
<text x="393" y="94" text-anchor="middle" class="d-label-sub">본사 신축 영역</text>

<path d="M 460 70 L 482 70" class="d-arrow" marker-end="url(#ah4)"/>

<rect x="482" y="40" width="130" height="60" rx="6" class="d-box"/>
<text x="547" y="62" text-anchor="middle" class="d-title" style="fill:#4a5568">STEP 4</text>
<text x="547" y="80" text-anchor="middle" class="d-label">자동 감지</text>
<text x="547" y="94" text-anchor="middle" class="d-label-sub">임계값 비교</text>

<path d="M 614 70 L 636 70" class="d-arrow" marker-end="url(#ah4)"/>

<rect x="636" y="40" width="104" height="60" rx="6" class="d-box"/>
<text x="688" y="62" text-anchor="middle" class="d-title" style="fill:#4a5568">STEP 5</text>
<text x="688" y="80" text-anchor="middle" class="d-label">알림 노출</text>
<text x="688" y="94" text-anchor="middle" class="d-label-sub">대시보드</text>

<!-- 하단 요약 박스 — 유일한 강조 자리 (영업 메시지 본진) -->
<rect x="20" y="124" width="720" height="76" rx="4" class="d-box-primary" style="fill:#e8eef6"/>
<text x="380" y="148" text-anchor="middle" class="d-title-primary" style="font-size:13px">9개 화면이 5단계 워크플로우 위에 얹혀 있습니다</text>
<text x="380" y="168" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.9">통합 대시보드 · 매장 재고 · 창고 재고 · 입출고 트래킹 · API 동기화 · 재고 알림 · 알림 설정</text>
<text x="380" y="184" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85">+ 시스템 구조도 모달 (모든 화면 헤더에서 호출 가능)</text>
</svg>
</div>

<ul class="feature-list">
<li><strong>RBAC API 키 권한 체계</strong> — 매장·외부사·관리자별 고유 키 발급. R · R/W 권한 분기, 매장 폐점 시 즉시 회수, 만료 임박 자동 알림.</li>
<li><strong>점진적 도입 — 매장 단위 단계 확장</strong> — 키 1개 발급으로 매장 1개를 즉시 연동 가능. 신규 매장 개점 · 기존 매장 폐점 · 외부 시스템 추가도 운영 중단 없이 키 발급/회수만으로 처리.</li>
<li><strong>실패 처리 정책 4 분류</strong> — 인증 만료·키 회수, 첨부 파일 오류, 데이터 검증 실패, 권한·범위 위반. 자동 재시도(30초→5분→30분) 후 영구 오류만 관리자 알림. 각 행 [원인 분석] 모달에서 검증 룰·해결 방안 즉시 확인 가능.</li>
<li><strong>안전 재고 자동 감지 + 알림</strong> — 관리자가 SKU·카테고리·매장 단위로 임계값 설정 → 시스템이 자동 비교 → 미달 시 대시보드 알림 + 일괄 확인·해결 흐름.</li>
<li><strong>입출고 트래킹 + Sankey 흐름 시각화</strong> — 매장↔창고 간 SKU 이동을 기간별 추이 라인 + Sankey 띠로 가시화. 100건 이력 + 검색·기간·유형 필터.</li>
<li><strong>창고 재고 가동률 게이지</strong> — 3개 창고(본사·매장 백창고·외부 위탁)별 가동률을 색상 위계(여유/보충/만재)로 시각화. 카테고리 분포 100% 스택 바.</li>
<li><strong>매장 재고 7섹션 드릴다운</strong> — 백화점 1F·2F 7개 섹션 × A·B·C 존 단위 SKU·재고 가치 분석. 카테고리별 회전율 분포·레이더 차트.</li>
<li><strong>수동 → 자동 전환 효과 시각화</strong> — 처리 건수 +130% / 건당 시간 -98% / 오류율 -85% / 인력 시간 -95% 4지표 동시 비교 차트.</li>
<li><strong>호출 감사 로그 (Audit)</strong> — 키별 호출 이력 자체 DB 자동 기록. 사고 시 누가 무엇을 호출했는지 역추적 가능.</li>
<li><strong>알림 분류 기준 가시화</strong> — 긴급(≤30%) · 주의(30~70%) · 정상(>70%) 3단 분류. 룰 카드 + 게이지 + 30일 알림 발생 추이 스택바.</li>
<li><strong>시스템 구조도 모달</strong> — 모든 화면 헤더에서 호출. 본사 DB 신축 영역 + 매장 입력 + 관리자 Setup/Operation 4 인격 한눈에 가시화.</li>
</ul>

</div>


<!-- ============================================ -->
<!-- Section 06 — 차별화 포인트 (구 Section 05) -->
<!-- ============================================ -->
<div class="section" id="section-6">
<div class="section-number">Section 06</div>
<h2>차별화 포인트 5 영역</h2>
<p class="section-sub">RFP를 넘어 — 시스템 운영 단계에서 필연적으로 직면하게 될 운영 허들을 선제적으로 해결</p>

<div class="diff-card">
<div class="diff-header">
<div class="diff-number">차별화 영역 A</div>
<div class="diff-title">운영 효율 — 본사 직원의 수기 작업을 0회로</div>
<div class="diff-oneliner">매장 직원과 본사 직원 모두 본업으로 환원</div>
</div>
<div class="diff-body">
<ul class="feature-list">
<li><strong>매장별 발급 API 키</strong> — 본사 DB 재고 관리 섹션의 출입증. 매장 폐점 시 즉시 회수, 신규 매장 즉시 발급으로 운영 변동 대응.</li>
<li><strong>본사 직원 수기 작업 0회</strong> — 메일·CSV·엑셀 정리에 매일 4시간 이상 쓰던 일배치 작업이 매장 측 API 직접 적재로 흡수됩니다.</li>
<li><strong>건당 처리 시간 24초</strong> — 18분(수동) → 24초(자동), 98% 단축.</li>
<li><strong>오류율 1.8%</strong> — 12.4%(수동) → 1.8%(자동), 휴먼 에러 85% 감소.</li>
</ul>
</div>
</div>

<div class="diff-card">
<div class="diff-header">
<div class="diff-number">차별화 영역 B</div>
<div class="diff-title">데이터 무결성 — 부분·누락 적재 0건</div>
<div class="diff-oneliner">실패 건은 본사 DB에 적재하지 않습니다</div>
</div>
<div class="diff-body">
<ul class="feature-list">
<li><strong>자동 재시도 정책</strong> — 1차 30초 → 2차 5분 → 3차 30분 단계 재시도. 일시 네트워크 오류는 자동 복구.</li>
<li><strong>4 분류 영구 오류 관리</strong> — 인증 만료·키 회수, 첨부 파일 오류, 데이터 검증 실패, 권한·범위 위반. 분류별 즉시 알림 + 대응 가이드.</li>
<li><strong>호출 감사 로그</strong> — 모든 API 호출이 자체 DB에 기록. 사고 시 시각·엔드포인트·결과 역추적 가능.</li>
<li><strong>형식 자동 검증</strong> — 음수 단가, SKU 코드 위반, 필수 필드 누락 등 게이트웨이 단계에서 차단.</li>
</ul>
</div>
</div>

<div class="diff-card">
<div class="diff-header">
<div class="diff-number">차별화 영역 C</div>
<div class="diff-title">알림 거버넌스 — 관리자 Setup·Operation 분리</div>
<div class="diff-oneliner">"누가 임계값을 정하고, 누가 알림을 받는가"를 명확히</div>
</div>
<div class="diff-body">
<ul class="feature-list">
<li><strong>Setup — 사전 임계값 설정</strong> — SKU·카테고리·매장 단위 임계값을 관리자가 사전 등록. 일괄 수정 + 변경 이력 추적.</li>
<li><strong>Operation — 실시간 감지·알림</strong> — 매장 등록 → 시스템 자동 비교 → 임계값 미달 시 대시보드 알림 즉시 노출.</li>
<li><strong>3단 분류 가시화</strong> — 긴급(≤30%) · 주의(30~70%) · 정상(>70%) 색상 위계 + 30일 발생 추이 스택바.</li>
<li><strong>일괄 확인 액션</strong> — 다건 선택 → 한 번에 확인 처리. 토스트 피드백으로 즉시 시각 반영.</li>
</ul>
</div>
</div>

<div class="diff-card">
<div class="diff-header">
<div class="diff-number">차별화 영역 D</div>
<div class="diff-title">점진적 확장성 — 매장 단위 단계적 도입</div>
<div class="diff-oneliner">초기 일부 매장 → 전체 확장까지 운영 중단 없이</div>
</div>
<div class="diff-body">
<ul class="feature-list">
<li><strong>키 1개 = 매장 1개 즉시 연동</strong> — 매장 단위로 키 발급만 하면 즉시 본사 DB 재고 관리 섹션과 연동됩니다. 매장 운영 환경(POS · 데이터 입력 방식 등)은 본사와 매장이 향후 협의하여 결정합니다.</li>
<li><strong>운영 변동 즉시 대응</strong> — 신규 매장 개점 · 기존 매장 폐점 · 외부 시스템 추가/제거를 모두 키 발급/회수만으로 처리. 시스템 재시작·다운타임 없음.</li>
<li><strong>외부 시스템 동일 절차</strong> — 본사 ERP · 물류사 등 기관 단위 연동도 매장과 동일하게 키 발급으로 시작. 권한 범위(R / R/W)는 발급 시점에 결정.</li>
<li><strong>키 회수 즉시 차단</strong> — 폐점 · 키 노출 · 계약 종료 시 회수된 키는 1초 내 모든 호출이 거부됩니다. 본사 데이터 격리 보장.</li>
</ul>
</div>
</div>

<div class="diff-card">
<div class="diff-header">
<div class="diff-number">차별화 영역 E</div>
<div class="diff-title">시스템 자체 설명 — 시스템이 스스로를 설명합니다</div>
<div class="diff-oneliner">신규 운영자 온보딩 즉시 활용 가능</div>
</div>
<div class="diff-body">
<ul class="feature-list">
<li><strong>시스템 구조도 모달</strong> — 모든 화면 헤더에서 클릭 한 번으로 호출. 본사 DB 신축 영역 · 매장 입력 채널 · 관리자 Setup/Operation 4 인격 한눈에.</li>
<li><strong>InfoHint 인라인 설명</strong> — 화면 곳곳에 설계 의도를 설명하는 인포 박스 배치 ("RBAC가 뭔가요?" → 호버 한 번으로 답변).</li>
<li><strong>RFP 요구사항 배지</strong> — 화면 헤더에 RFP 2-X 항목 위계 표시. 호버 시 전체 RFP 트리 + 현재 화면 강조 항목 시각화.</li>
<li><strong>이 인트로 페이지</strong> — 시스템의 정체성·As-Is·To-Be·차별화·연동 아키텍처를 한 페이지에서 학습 가능.</li>
</ul>
</div>
</div>

</div>


`;

// (마커: BLOCK_S4) Section 4 (기존 시스템 연동 아키텍처) 본문 — 시스템 구조도 직후로 이동
const _section4Body = `<!-- ============================================ -->
<!-- Section 04 — 기존 시스템과의 연동 아키텍처 (구 Section 06, 시스템 구조도 직후로 이동) -->
<!-- ============================================ -->
<div class="section" id="section-4">
<div class="section-number">Section 04</div>
<h2>기존 시스템과의 연동 아키텍처</h2>
<p class="section-sub">독립된 시스템이 아닌, 본사 자산을 흡수하고 강화하는 통합 레이어</p>

<p>본 프로젝트의 핵심은 독립된 시스템으로 추가되는 것이 아닌, 본사 통합 DB의 일부 영역(재고 관리 섹션)을 신축하고 매장 POS·외부 ERP·물류사 시스템과 표준 인터페이스로 연동되는 것입니다. 이러한 연동 구조가 갖춰지지 않으면 데이터 단절 발생, 본사 ERP의 단가와 본 시스템 단가가 어긋나는 정합성 사고가 누적되고, 결국 운영자는 시스템을 신뢰하지 못해 다시 엑셀로 돌아가게 됩니다.</p>

<p>본 시스템은 이런 <strong>리스크를 배제하기 위해 본사 통합 DB·매장 POS·외부 시스템과의 양방향 연동을 전제로 설계</strong>하여, 데이터 정합성과 운영 일관성이 유지되도록 설계합니다.</p>

<div class="diagram">
<div class="diagram-label">레거시 · 외부 시스템 연동 아키텍처</div>
<svg viewBox="0 0 760 396" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IOM과 본사 통합 DB·매장 POS·외부 시스템 연동도">
<defs>
<marker id="ah6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="d-arrow-head"/></marker>
</defs>

<!-- 사용자 레이어 -->
<text x="380" y="22" text-anchor="middle" class="d-title">사용자 레이어</text>
<rect x="60" y="36" width="200" height="46" rx="4" class="d-box"/>
<text x="160" y="56" text-anchor="middle" class="d-label" style="font-weight:700">매장 직원</text>
<text x="160" y="73" text-anchor="middle" class="d-label-sub">POS · CSV 업로드 · 웹</text>

<rect x="280" y="36" width="200" height="46" rx="4" class="d-box"/>
<text x="380" y="56" text-anchor="middle" class="d-label" style="font-weight:700">본사 관리자</text>
<text x="380" y="73" text-anchor="middle" class="d-label-sub">대시보드 · 알림 · 임계값 설정</text>

<rect x="500" y="36" width="200" height="46" rx="4" class="d-box"/>
<text x="600" y="56" text-anchor="middle" class="d-label" style="font-weight:700">외부 시스템</text>
<text x="600" y="73" text-anchor="middle" class="d-label-sub">본사 ERP · 물류사 등</text>

<path d="M 160 82 L 160 124" class="d-arrow" marker-end="url(#ah6)"/>
<path d="M 380 82 L 380 124" class="d-arrow" marker-end="url(#ah6)"/>
<path d="M 600 82 L 600 124" class="d-arrow" marker-end="url(#ah6)"/>

<!-- 본 IOM 시스템 — 박스 102 → 96 (위 24 / 아래 18 시각 균형: 옅은 폰트 시각 무게 보정) -->
<rect x="40" y="128" width="680" height="96" rx="6" class="d-box-primary"/>
<text x="380" y="152" text-anchor="middle" class="d-title-primary">본 IOM 시스템 — 통합 운영 레이어</text>
<text x="380" y="172" text-anchor="middle" style="font-size:11px;font-weight:600;fill:#0d47a1">대시보드 · 입출고 트래킹 · 자동 동기화 · 안전 재고 알림 · API 게이트웨이</text>
<text x="380" y="190" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85">+ RBAC 권한 체계 · 호출 감사 · 임계값 관리 · 시스템 구조도</text>
<text x="380" y="206" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85;font-size:11px;letter-spacing:1px">INVENTORY OPERATIONS MANAGEMENT</text>

<!-- 인터페이스 라벨 — 박스 확장 따라 전체 16px 아래로 -->
<text x="100" y="250" text-anchor="middle" class="d-label-sub">REST API</text>
<text x="240" y="250" text-anchor="middle" class="d-label-sub">CSV 업로드</text>
<text x="380" y="250" text-anchor="middle" class="d-label-sub">동일 인스턴스</text>
<text x="520" y="250" text-anchor="middle" class="d-label-sub">REST API</text>
<text x="660" y="250" text-anchor="middle" class="d-label-sub">표준 스키마</text>

<path d="M 100 236 L 100 268" class="d-arrow" marker-end="url(#ah6)"/>
<path d="M 240 236 L 240 268" class="d-arrow" marker-end="url(#ah6)"/>
<path d="M 380 236 L 380 268" class="d-arrow" marker-end="url(#ah6)"/>
<path d="M 520 236 L 520 268" class="d-arrow" marker-end="url(#ah6)"/>
<path d="M 660 236 L 660 268" class="d-arrow" marker-end="url(#ah6)"/>

<!-- 본사 통합 DB · 외부 시스템 — 5종 (16px 아래로) -->
<text x="380" y="288" text-anchor="middle" class="d-label-sub" style="letter-spacing:1px;font-weight:700">본사 보유 자산 · 외부 연동 (예시 — 본사 협의)</text>

<!-- 1. 매장 POS -->
<rect x="40" y="300" width="120" height="68" rx="4" class="d-box"/>
<text x="100" y="320" text-anchor="middle" class="d-label" style="font-weight:700">매장 POS</text>
<text x="100" y="336" text-anchor="middle" class="d-label-sub">매장 입출고</text>
<text x="100" y="352" text-anchor="middle" class="d-label-sub" style="font-size:11px">선택 — 환경에 따라</text>

<!-- 2. 매장 CSV·웹 (인터페이스 제2축) -->
<rect x="180" y="300" width="120" height="68" rx="4" class="d-box"/>
<text x="240" y="320" text-anchor="middle" class="d-label" style="font-weight:700">매장 CSV·웹</text>
<text x="240" y="336" text-anchor="middle" class="d-label-sub">파일 업로드</text>
<text x="240" y="352" text-anchor="middle" class="d-label-sub" style="font-size:11px">웹 직접입력</text>

<!-- 3. 본사 통합 DB (★ 강조 — 본 시스템 신축 영역) -->
<rect x="320" y="300" width="120" height="68" rx="4" class="d-box-primary"/>
<text x="380" y="320" text-anchor="middle" class="d-title-primary" style="font-size:12px">본사 통합 DB</text>
<text x="380" y="336" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1">★ 재고 관리 신축</text>
<text x="380" y="352" text-anchor="middle" class="d-label-sub" style="fill:#0d47a1;opacity:0.85">+ 기존 영역 보존</text>

<!-- 4. 본사 ERP -->
<rect x="460" y="300" width="120" height="68" rx="4" class="d-box"/>
<text x="520" y="320" text-anchor="middle" class="d-label" style="font-weight:700">본사 ERP</text>
<text x="520" y="336" text-anchor="middle" class="d-label-sub">단가·발주 결재</text>
<text x="520" y="352" text-anchor="middle" class="d-label-sub" style="font-size:11px;fill:#0d47a1">필수 — RFP 명시</text>

<!-- 5. 외부 시스템 (물류사 + PLM) -->
<rect x="600" y="300" width="120" height="68" rx="4" class="d-box"/>
<text x="660" y="320" text-anchor="middle" class="d-label" style="font-weight:700">물류사 · PLM</text>
<text x="660" y="336" text-anchor="middle" class="d-label-sub">발송·BOM 등</text>
<text x="660" y="352" text-anchor="middle" class="d-label-sub" style="font-size:11px">권장·선택</text>
</svg>
</div>

<ul class="feature-list">
<li><strong>본 IOM은 본사 자산과 매장·외부의 통합 허브입니다.</strong> 매장의 입출고 데이터, 본사 ERP의 단가 정보, 외부 물류사의 발송 트래킹을 한 시스템 안에서 결합하여 대시보드를 구성합니다.</li>
<li><strong>연동 방식은 표준 인터페이스를 사용합니다.</strong> 매장 POS는 REST API, CSV 일괄 업로드, 본사 ERP/물류사는 REST API + 표준 스키마, PLM 등 레거시 시스템은 표준 스키마 또는 마이그레이션 경로 — 본사 환경에 따라 점진적 연동이 가능합니다.</li>
<li><strong>본사 통합 DB의 기존 영역(인사·회계·구매·CRM)은 보존됩니다.</strong> 신축은 재고 관리 섹션에 한정되며, 기존 시스템의 운영을 방해하지 않습니다. 사용자 인증·매장 마스터·회계 코드 등은 동일 DB 인스턴스에서 직접 참조하여 별도 API 호출이 불필요합니다.</li>
<li><strong>레거시 시스템 흡수·연동을 전제로 설계합니다.</strong> RFP 우대 사항인 *기존 레거시 코드 분석·마이그레이션 경험*에 부합하도록, 본 시스템의 데이터 모델을 표준 스키마로 정의해 PLM·자료실 등 본사 보유 시스템과의 마이그레이션 경로를 확보합니다.</li>
</ul>

</div>

`;

// 푸터 + .page/.content 닫음
const _footerBody = `<div class="footer">
<div class="brand">Inventory Operations Management — Prototype Documentation</div>
<p>Wishket 공고 155033 · 매장 및 창고 재고 관리 대시보드</p>
<p>RFP 2-1 · 2-2 · 2-3 통합 구현 · v0.1 · 2026년 5월</p>
</div>

</div>
`;

// 최종 조립: .page 시작 → .content 시작 → Section 04 → Section 05·06 → .content 닫음 → .page 닫음 → footer → .page 닫음
export const introHtmlAfter =
    `<div class="page">
<div class="content">

` + _section4Body + `

` + _section5_6Body + `
</div>

</div>

` + _footerBody;
