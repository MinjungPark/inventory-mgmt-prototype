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

// ─── 실패 SKU (재시도 패널용) ─────────────────────────────────────────────

export interface FailedSyncItem {
    id: string;
    occurredAt: string;
    skuId: string;
    skuName: string;
    reason: string;
    retryCount: number;
}

function buildFailedSyncs(): FailedSyncItem[] {
    return SYNC_HISTORY
        .filter((l) => l.result === "failed" && l.failedSkuId)
        .slice(0, 5)
        .map((l, i) => ({
            id: `FAIL-${String(i + 1).padStart(3, "0")}`,
            occurredAt: l.timestamp,
            skuId: l.failedSkuId!,
            skuName: i % 2 === 0 ? "수분 크림 - 100ml" : "트렌치 코트 - 베이지 - M",
            reason: l.errorReason ?? "알 수 없는 오류",
            retryCount: Math.floor(det() * 3),
        }));
}

export const FAILED_SYNCS: FailedSyncItem[] = buildFailedSyncs();

// ─── 헬퍼 ──────────────────────────────────────────────────────────────────

export const SYNC_TYPE_DESCRIPTION: Record<SyncType, string> = {
    "재고 일괄": "본사 ERP의 SKU별 재고 수량을 일괄 조회",
    "SKU 마스터": "신규 SKU 등록 / 기존 SKU 단가 변경 동기화",
    "가격 정책": "할인율 · 프로모션 가격 정책 수신",
    "안전 재고 기준": "본사 정책 변경 시 SKU별 알림 기준 수량 갱신",
    "매장 운영 시간": "매장별 영업 시간 / 휴무 정보 수신",
};
