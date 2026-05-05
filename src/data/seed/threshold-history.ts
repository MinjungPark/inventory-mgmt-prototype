/**
 * @file src/data/seed/threshold-history.ts
 * @description 알림 기준 수량 설정 변경 이력 시드.
 *              결정론적 — 빌드마다 동일.
 */

export interface ThresholdChangeLog {
    id: string;
    timestamp: string;     // ISO 8601
    changedItem: string;   // 변경 항목 (SKU id 또는 카테고리)
    itemLabel: string;     // 표시용 (예: "트렌치 코트 - 베이지 - M" 또는 "화장품")
    fromValue: number;
    toValue: number;
    operator: string;      // 담당자
    scope: "sku" | "category" | "store";
}

const OPERATORS = ["박본사", "최관리", "이매장", "정과장", "강이사"];

const SAMPLE_CHANGES: Omit<ThresholdChangeLog, "id" | "timestamp">[] = [
    { changedItem: "category:화장품", itemLabel: "화장품 카테고리", fromValue: 12, toValue: 15, operator: OPERATORS[0], scope: "category" },
    { changedItem: "SKU-CL-0001",     itemLabel: "트렌치 코트 - 베이지 - M", fromValue: 8, toValue: 12, operator: OPERATORS[1], scope: "sku" },
    { changedItem: "category:신발",   itemLabel: "신발 카테고리", fromValue: 10, toValue: 12, operator: OPERATORS[0], scope: "category" },
    { changedItem: "SKU-CO-0009",     itemLabel: "수분 크림", fromValue: 15, toValue: 20, operator: OPERATORS[2], scope: "sku" },
    { changedItem: "store:1F-A",      itemLabel: "1F-A 의류 (매장 차등)", fromValue: 8, toValue: 10, operator: OPERATORS[3], scope: "store" },
    { changedItem: "SKU-JW-0003",     itemLabel: "골드 목걸이 - 18K", fromValue: 5, toValue: 8, operator: OPERATORS[1], scope: "sku" },
    { changedItem: "category:언더웨어", itemLabel: "언더웨어 카테고리", fromValue: 12, toValue: 14, operator: OPERATORS[0], scope: "category" },
    { changedItem: "SKU-AC-0007",     itemLabel: "토트백 - 블랙", fromValue: 6, toValue: 9, operator: OPERATORS[4], scope: "sku" },
    { changedItem: "store:2F-B",      itemLabel: "2F-B 화장품 (매장 차등)", fromValue: 15, toValue: 18, operator: OPERATORS[3], scope: "store" },
    { changedItem: "SKU-SH-0004",     itemLabel: "스니커즈 - 화이트 - 250mm", fromValue: 7, toValue: 10, operator: OPERATORS[2], scope: "sku" },
];

// 모듈 로드 1회 평가 — SSR/CSR 동일성 보장
const HISTORY_SEED_NOW_MS = Date.now();

function buildHistory(): ThresholdChangeLog[] {
    const now = HISTORY_SEED_NOW_MS;
    return SAMPLE_CHANGES.map((c, i) => ({
        ...c,
        id: `THC-${String(i + 1).padStart(4, "0")}`,
        // 1~30일 전 분포 — 결정론적
        timestamp: new Date(now - (i * 2 + 1) * 24 * 60 * 60 * 1000 + (i * 3) * 60 * 60 * 1000).toISOString(),
    }));
}

export const THRESHOLD_HISTORY: ThresholdChangeLog[] = buildHistory();
