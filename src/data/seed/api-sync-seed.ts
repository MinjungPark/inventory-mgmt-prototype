/**
 * @file src/data/seed/api-sync-seed.ts
 * @description 화면 6 데이터 자동 동기화 시드.
 *              SSR/CSR 일관성을 위해 모든 시각 모듈 로드 1회로 고정.
 */

// ─── 모듈 로드 1회 평가 (Hydration 안전) ────────────────────────────────────

const API_SEED_NOW_MS = Date.now();
const API_SEED_NOW = new Date(API_SEED_NOW_MS);

// ─── API 상태 ──────────────────────────────────────────────────────────────

export type ApiHealthStatus = "ok" | "error" | "degraded";

export interface ApiHealth {
    status: ApiHealthStatus;
    /** 최근 성공 시각 */
    lastSuccessAt: string;
    /** 다음 자동 동기화 예정 시각 */
    nextSyncAt: string;
    /** 이번 달 누적 자동 처리 건수 */
    monthlyAutoProcessed: number;
    /** API 응답 시간 (ms) — 평균 */
    avgResponseMs: number;
}

function mkApiHealth(): ApiHealth {
    // 최근 동기화: 12분 전, 다음 동기화: 48분 후 (1시간 주기)
    const lastSuccess = new Date(API_SEED_NOW_MS - 12 * 60 * 1000);
    const nextSync = new Date(API_SEED_NOW_MS + 48 * 60 * 1000);
    return {
        status: "ok",
        lastSuccessAt: lastSuccess.toISOString(),
        nextSyncAt: nextSync.toISOString(),
        monthlyAutoProcessed: 4250,
        avgResponseMs: 142,
    };
}

export const API_HEALTH: ApiHealth = mkApiHealth();

// ─── 동기화 이력 ────────────────────────────────────────────────────────────

export type SyncType =
    | "재고 일괄"
    | "SKU 마스터"
    | "가격 정책"
    | "안전 재고 기준"
    | "매장 운영 시간";

export type SyncResult = "success" | "failed" | "partial";

export interface SyncLog {
    id: string;
    timestamp: string;
    type: SyncType;
    direction: "in" | "out";   // 본사 → IOM (in) / IOM → 본사 (out)
    processedCount: number;
    durationMs: number;
    result: SyncResult;
    errorReason?: string;       // failed / partial 일 때
    failedSkuId?: string;
}

const SYNC_TYPES: SyncType[] = [
    "재고 일괄",
    "SKU 마스터",
    "가격 정책",
    "안전 재고 기준",
    "매장 운영 시간",
];

const ERROR_REASONS = [
    "본사 API 응답 시간 초과",
    "SKU 코드 형식 불일치",
    "가격 정책 검증 실패 (음수 단가)",
    "재고 수량 음수 감지",
    "권한 토큰 만료",
];

// 결정론적 슈도 랜덤
let apiSeedCursor = 7;
function det(): number {
    apiSeedCursor = (apiSeedCursor * 9301 + 49297) % 233280;
    return apiSeedCursor / 233280;
}

function buildSyncHistory(): SyncLog[] {
    const logs: SyncLog[] = [];
    let runningId = 1;

    // 최근 7일치 동기화 — 시간당 1회 (자동 주기) + 가끔 수동 트리거
    for (let hourOffset = 0; hourOffset < 7 * 24; hourOffset++) {
        const ts = new Date(API_SEED_NOW_MS - hourOffset * 60 * 60 * 1000);
        const type = SYNC_TYPES[Math.floor(det() * SYNC_TYPES.length)];
        const direction = det() < 0.7 ? "in" : "out";
        const processedCount = 50 + Math.floor(det() * 220);
        const durationMs = 80 + Math.floor(det() * 400);

        // 5% 확률 실패, 8% 확률 부분 성공
        let result: SyncResult = "success";
        let errorReason: string | undefined;
        let failedSkuId: string | undefined;
        const r = det();
        if (r < 0.05) {
            result = "failed";
            errorReason = ERROR_REASONS[Math.floor(det() * ERROR_REASONS.length)];
            failedSkuId = `SKU-CO-${String(Math.floor(det() * 50)).padStart(4, "0")}`;
        } else if (r < 0.13) {
            result = "partial";
            errorReason = ERROR_REASONS[Math.floor(det() * ERROR_REASONS.length)];
            failedSkuId = `SKU-CL-${String(Math.floor(det() * 50)).padStart(4, "0")}`;
        }

        logs.push({
            id: `SYNC-${String(runningId++).padStart(6, "0")}`,
            timestamp: ts.toISOString(),
            type,
            direction,
            processedCount,
            durationMs,
            result,
            errorReason,
            failedSkuId,
        });
    }

    return logs;
}

export const SYNC_HISTORY: SyncLog[] = buildSyncHistory();

// ─── 수동 vs 자동 비교 데이터 ──────────────────────────────────────────────

export interface ManualAutoComparison {
    period: "이전 30일\n(수동)" | "최근 30일\n(자동)";
    processedCount: number;     // 처리 건수
    avgDurationMin: number;     // 건당 평균 처리 시간 (분)
    errorRate: number;          // 오류율 (%)
    laborHours: number;         // 인건비 (시간)
}

export const MANUAL_AUTO_COMPARISON: ManualAutoComparison[] = [
    {
        period: "이전 30일\n(수동)",
        processedCount: 1850,
        avgDurationMin: 18,    // CSV 다운→정리→업로드 18분
        errorRate: 12.4,
        laborHours: 555,        // 1850 * 18 / 60
    },
    {
        period: "최근 30일\n(자동)",
        processedCount: 4250,
        avgDurationMin: 0.4,   // API 호출 24초
        errorRate: 1.8,
        laborHours: 28,         // 4250 * 0.4 / 60
    },
];

// ─── 실패 SKU (원인 분석 패널용) ─────────────────────────────────────────────
//
// 7건의 실패 사례에 모달 노출용 풀 정보를 부여.
// 우측 *실패 처리 정책* 카드의 4분류와 매핑되어 영업 메시지 일관.

export type FailureCategory =
    | "data"        // 데이터 검증 실패
    | "auth"        // 인증 만료·키 회수
    | "file"        // 첨부 파일 오류
    | "permission"  // 권한·범위 위반
    | "network";    // 일시 네트워크 오류 (3회 자동 재시도 후 영구)

export interface FailedSyncItem {
    id: string;
    occurredAt: string;
    skuId: string;
    skuName: string;
    /** 한 줄 사유 — 행에 노출 */
    reason: string;
    retryCount: number;
    // === 모달용 풀 정보 ===
    /** 분류 */
    category: FailureCategory;
    /** 보낸 측 매장명 (또는 외부사) */
    senderHolder: string;
    /** 보낸 측 키 마스킹 식별자 */
    senderKey: string;
    /** 보낸 측 담당자 이메일 (mailto: 링크용) */
    senderEmail: string;
    /** 받은 값 — 검증 실패한 실제 값 */
    receivedValue: string;
    /** 기대 값 / 검증 룰 */
    expectedRule: string;
    /** 해결 방안 단계별 (1, 2, 3...) */
    resolutionSteps: string[];
}

// 7건 풀 데이터 — 우측 정책 카드 4분류와 매핑
const FAILED_SYNC_TEMPLATES: Omit<FailedSyncItem, "id" | "occurredAt" | "retryCount">[] = [
    {
        skuId: "SKU-CO-0034",
        skuName: "수분 크림 - 100ml",
        reason: "가격 정책 검증 실패 (음수 단가)",
        category: "data",
        senderHolder: "매장 강남",
        senderKey: "ak_live_3f9a****",
        senderEmail: "store-gangnam@example.com",
        receivedValue: "price = -1,500",
        expectedRule: "price >= 0 (시스템 기본 검증)",
        resolutionSteps: [
            "음수로 입력된 단가를 정상 값으로 수정 요청합니다.",
            "수정 후 동일한 절차로 재전송합니다.",
            "재전송 시 시스템 자동 검증 후 즉시 적재됩니다.",
        ],
    },
    {
        skuId: "SKU-CO-0001",
        skuName: "트렌치 코트 - 베이지 - M",
        reason: "본사 API 응답 시간 초과",
        category: "network",
        senderHolder: "매장 강남",
        senderKey: "ak_live_3f9a****",
        senderEmail: "store-gangnam@example.com",
        receivedValue: "응답 시간 5,000ms 초과 (타임아웃)",
        expectedRule: "응답 시간 < 5초 (3회 자동 재시도 정책)",
        resolutionSteps: [
            "본사 API 게이트웨이의 응답 지연 원인을 점검합니다.",
            "본사 운영팀에 상황 공유 후 재호출 시점을 협의합니다.",
            "동일 오류가 반복되는 경우 자동 재시도 정책 검토를 권장합니다.",
        ],
    },
    {
        skuId: "SKU-CO-0037",
        skuName: "수분 크림 - 100ml",
        reason: "본사 API 응답 시간 초과",
        category: "network",
        senderHolder: "매장 홍대",
        senderKey: "ak_live_a72b****",
        senderEmail: "store-hongdae@example.com",
        receivedValue: "응답 시간 5,000ms 초과 (타임아웃)",
        expectedRule: "응답 시간 < 5초 (3회 자동 재시도 정책)",
        resolutionSteps: [
            "본사 API 게이트웨이의 응답 지연 원인을 점검합니다.",
            "본사 운영팀에 상황 공유 후 재호출 시점을 협의합니다.",
            "동일 오류가 반복되는 경우 자동 재시도 정책 검토를 권장합니다.",
        ],
    },
    {
        skuId: "SKU-CO-0049",
        skuName: "트렌치 코트 - 베이지 - M",
        reason: "권한 토큰 만료",
        category: "auth",
        senderHolder: "매장 광주",
        senderKey: "ak_live_2c87****",
        senderEmail: "store-gwangju@example.com",
        receivedValue: "키 만료일: 2026-04-30 (현재 만료됨)",
        expectedRule: "expiresAt > now (호출 시점 기준 유효해야 함)",
        resolutionSteps: [
            "관리자 콘솔에서 해당 매장 키를 갱신·재발급합니다.",
            "신규 키를 매장 담당자에게 안전하게 전달합니다.",
            "신규 키 적용 후 자동 적재가 즉시 재개됩니다.",
        ],
    },
    {
        skuId: "SKU-CO-0030",
        skuName: "수분 크림 - 100ml",
        reason: "SKU 코드 형식 불일치",
        category: "data",
        senderHolder: "매장 일산",
        senderKey: "ak_live_c103****",
        senderEmail: "store-ilsan@example.com",
        receivedValue: 'sku_id = "SK-CO-30"',
        expectedRule: "정규식: ^SKU-[A-Z]{2}-[0-9]{4}$",
        resolutionSteps: [
            "보낸 측 시스템에서 SKU 코드 형식을 표준에 맞춰 수정합니다.",
            '예: "SK-CO-30" → "SKU-CO-0030"',
            "수정 후 재전송 시 자동 검증 통과 → 즉시 적재됩니다.",
        ],
    },
    {
        skuId: "SKU-CL-0042",
        skuName: "린넨 셔츠 - 화이트 - L",
        reason: "CSV 헤더 불일치 — 'sku_id' 필수 컬럼 누락",
        category: "file",
        senderHolder: "매장 광주",
        senderKey: "ak_live_2c87****",
        senderEmail: "store-gwangju@example.com",
        receivedValue: "받은 헤더: [item_code, qty, store_id]",
        expectedRule: "필수 컬럼: [sku_id, quantity, store_id] (대소문자 무관)",
        resolutionSteps: [
            "표준 CSV 양식을 매장 담당자에게 재배포합니다 (관리자 콘솔에서 다운로드 가능).",
            "양식에 맞춰 컬럼명을 수정한 후 재업로드합니다.",
            "헤더 검증 통과 후 본 시스템이 자동 파싱·적재합니다.",
        ],
    },
    {
        skuId: "SKU-CO-0019",
        skuName: "캐시미어 머플러 - 그레이",
        reason: "권한 외 매장 데이터 요청 — 키 범위 초과",
        category: "permission",
        senderHolder: "매장 인천",
        senderKey: "ak_live_b91f****",
        senderEmail: "store-incheon@example.com",
        receivedValue: "매장 인천 키로 매장 강남 SKU 조회 시도",
        expectedRule: "키 발급 매장 ID == 요청 대상 매장 ID",
        resolutionSteps: [
            "매장 인천 측 호출 로직에서 매장 ID 매개변수를 점검합니다.",
            "필요 시 키 권한 범위를 본사 관리자와 협의해 재정의합니다.",
            "수정 후 재호출 시 게이트웨이가 즉시 통과시킵니다.",
        ],
    },
];

function buildFailedSyncs(): FailedSyncItem[] {
    // 기본 5건 — SYNC_HISTORY에서 자연 발생한 timestamp 사용
    const baseLogs = SYNC_HISTORY
        .filter((l) => l.result === "failed" && l.failedSkuId)
        .slice(0, 5);

    const baseTs = baseLogs.length > 0
        ? new Date(baseLogs[0].timestamp).getTime()
        : API_SEED_NOW_MS;

    return FAILED_SYNC_TEMPLATES.map((tmpl, i) => {
        // 0~4번은 SYNC_HISTORY 자연 발생 timestamp, 5~6번은 baseTs 기준 90/180분 전
        const ts = i < baseLogs.length
            ? baseLogs[i].timestamp
            : new Date(baseTs - (i === 5 ? 90 : 180) * 60 * 1000).toISOString();
        return {
            id: `FAIL-${String(i + 1).padStart(3, "0")}`,
            occurredAt: ts,
            retryCount: Math.floor(det() * 3),
            ...tmpl,
        };
    });
}

export const FAILED_SYNCS: FailedSyncItem[] = buildFailedSyncs();

// 분류별 라벨 + 우측 정책 카드와의 매핑.
// 캡틴 톤 정정 (2026-05): "데이터 검증" → "형식 오류" 등 직관적 표현으로.
export const FAILURE_CATEGORY_LABEL: Record<FailureCategory, string> = {
    data: "형식 오류",
    auth: "인증 만료",
    file: "파일 오류",
    permission: "권한 위반",
    network: "일시 오류",
};

// ─── 오늘 연동 현황 — 상단 카드용 ────────────────────────────────────────────

export interface TodaySyncStats {
    /** 오늘 누적 연동 횟수 */
    totalCount: number;
    /** 결과 분포 */
    success: number;
    partial: number;
    failed: number;
    /** 성공률 (%) — 부분도 성공으로 미산입, 순수 success / total */
    successRate: number;
    /** 활성 키 개수 (참고) */
    activeKeyCount: number;
    /** 마지막 호출 ISO */
    lastCalledAt: string;
}

function buildTodaySyncStats(): TodaySyncStats {
    // SYNC_HISTORY 중 오늘(00:00 이후) 발생 건만 집계
    const todayStart = new Date(API_SEED_NOW);
    todayStart.setHours(0, 0, 0, 0);
    const todayStartMs = todayStart.getTime();

    const todayLogs = SYNC_HISTORY.filter(
        (l) => new Date(l.timestamp).getTime() >= todayStartMs,
    );
    const success = todayLogs.filter((l) => l.result === "success").length;
    const partial = todayLogs.filter((l) => l.result === "partial").length;
    const failed = todayLogs.filter((l) => l.result === "failed").length;
    const totalCount = todayLogs.length;
    const successRate = totalCount > 0 ? (success / totalCount) * 100 : 0;
    const lastCalledAt = todayLogs.length > 0 ? todayLogs[0].timestamp : API_SEED_NOW.toISOString();

    return {
        totalCount,
        success,
        partial,
        failed,
        successRate,
        activeKeyCount: 14,  // RBAC 카드의 활성 키와 동일 (시드 분리되어 있어 정적 값)
        lastCalledAt,
    };
}

export const TODAY_SYNC_STATS: TodaySyncStats = buildTodaySyncStats();

// ─── 헬퍼 ──────────────────────────────────────────────────────────────────

export const SYNC_TYPE_DESCRIPTION: Record<SyncType, string> = {
    "재고 일괄": "본사 ERP의 SKU별 재고 수량을 일괄 조회",
    "SKU 마스터": "신규 SKU 등록 / 기존 SKU 단가 변경 동기화",
    "가격 정책": "할인율 · 프로모션 가격 정책 수신",
    "안전 재고 기준": "본사 정책 변경 시 SKU별 알림 기준 수량 갱신",
    "매장 운영 시간": "매장별 영업 시간 / 휴무 정보 수신",
};
