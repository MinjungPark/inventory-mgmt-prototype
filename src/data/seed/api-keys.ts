/**
 * @file src/data/seed/api-keys.ts
 * @description API 키 발급 현황 시드 — 화면 6 RBAC 카드용.
 *
 *  RFP 2-2 정합:
 *   - 본사 발급 API 키 = 본사 DB 재고 관리 섹션 접근 토큰
 *   - 매장·외부 시스템별 권한 차등 (R / R/W)
 *   - 회수(revoked) 키 1건 — 권한 회수 기능 시연용
 */

const API_KEY_NOW_MS = Date.now();

export type ApiKeyPermission = "R" | "R/W";
export type ApiKeyStatus = "active" | "revoked";
/**
 * 키 발급 대상 분류.
 *  STORE — 매장 단위 발급 (입출고 등록·조회 권한)
 *  EXTERNAL — 외부 시스템 단위 발급 (본사 ERP·물류사 등 기관 연동)
 */
export type ApiKeyChannel = "STORE" | "EXTERNAL";

export interface ApiKeyEntry {
    /** 키 표시용 마스킹 식별자 — 'ak_live_xxxx****' */
    keyMasked: string;
    /** 발급 대상 (매장명 / 외부 시스템명) */
    holderName: string;
    /** 권한 — R(읽기) 또는 R/W(읽기·쓰기) */
    permission: ApiKeyPermission;
    /** 입력 채널 시나리오 */
    channel: ApiKeyChannel;
    /** 발급 시각 ISO */
    issuedAt: string;
    /** 만료 시각 ISO (없으면 무기한) */
    expiresAt?: string;
    /** 마지막 호출 시각 ISO (active만) */
    lastCalledAt?: string;
    /** 30일 누적 호출 건수 */
    callCount30d: number;
    /** 상태 */
    status: ApiKeyStatus;
    /** 회수 사유 (revoked만) */
    revokedReason?: string;
}

function relativeIso(minutesAgo: number): string {
    return new Date(API_KEY_NOW_MS - minutesAgo * 60 * 1000).toISOString();
}

function daysAgoIso(days: number): string {
    return new Date(API_KEY_NOW_MS - days * 24 * 60 * 60 * 1000).toISOString();
}

function daysFromNowIso(days: number): string {
    return new Date(API_KEY_NOW_MS + days * 24 * 60 * 60 * 1000).toISOString();
}

// 키 정책: 매장 키 1년 만료, 외부 시스템 키 2년 만료, 일부 무기한
//   다양한 만료 분포로 운영 현실감 강조 — 임박(<30일) / 여유(>90일) / 무기한
export const API_KEYS: ApiKeyEntry[] = [
    // === 매장 키 (12개) ===
    {
        keyMasked: "ak_live_3f9a****",
        holderName: "매장 강남",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(174),
        expiresAt: daysFromNowIso(191),  // 약 6개월 여유
        lastCalledAt: relativeIso(1),
        callCount30d: 4280,
        status: "active",
    },
    {
        keyMasked: "ak_live_a72b****",
        holderName: "매장 홍대",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(174),
        expiresAt: daysFromNowIso(18),   // ⚠ 만료 임박
        lastCalledAt: relativeIso(3),
        callCount30d: 3920,
        status: "active",
    },
    {
        keyMasked: "ak_live_c103****",
        holderName: "매장 일산",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(118),
        expiresAt: daysFromNowIso(247),
        lastCalledAt: relativeIso(8),
        callCount30d: 3140,
        status: "active",
    },
    {
        keyMasked: "ak_live_d42e****",
        holderName: "매장 분당",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(80),
        expiresAt: daysFromNowIso(285),
        lastCalledAt: relativeIso(2),
        callCount30d: 2980,
        status: "active",
    },
    {
        keyMasked: "ak_live_b91f****",
        holderName: "매장 인천",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(45),
        expiresAt: daysFromNowIso(320),
        lastCalledAt: relativeIso(240),
        callCount30d: 2410,
        status: "active",
    },
    {
        keyMasked: "ak_live_e057****",
        holderName: "매장 수원",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(45),
        expiresAt: daysFromNowIso(320),
        lastCalledAt: relativeIso(15),
        callCount30d: 2280,
        status: "active",
    },
    {
        keyMasked: "ak_live_f238****",
        holderName: "매장 대전",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(28),
        expiresAt: daysFromNowIso(337),
        lastCalledAt: relativeIso(60),
        callCount30d: 1860,
        status: "active",
    },
    {
        keyMasked: "ak_live_8a4c****",
        holderName: "매장 부산 센텀",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(20),
        expiresAt: daysFromNowIso(345),
        lastCalledAt: relativeIso(11),
        callCount30d: 1640,
        status: "active",
    },

    // (매장 9~11)
    {
        keyMasked: "ak_live_9b15****",
        holderName: "매장 대구",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(60),
        expiresAt: daysFromNowIso(305),
        lastCalledAt: relativeIso(60 * 18),
        callCount30d: 30,
        status: "active",
    },
    {
        keyMasked: "ak_live_2c87****",
        holderName: "매장 광주",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(60),
        expiresAt: daysFromNowIso(7),    // ⚠ 만료 매우 임박
        lastCalledAt: relativeIso(60 * 24),
        callCount30d: 28,
        status: "active",
    },
    {
        keyMasked: "ak_live_46d2****",
        holderName: "매장 울산",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(38),
        expiresAt: daysFromNowIso(327),
        lastCalledAt: relativeIso(60 * 12),
        callCount30d: 30,
        status: "active",
    },

    // (매장 12 — 신규)
    {
        keyMasked: "ak_live_7e91****",
        holderName: "매장 제주 (신규)",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(12),
        expiresAt: daysFromNowIso(353),
        lastCalledAt: relativeIso(60 * 6),
        callCount30d: 12,
        status: "active",
    },

    // === 외부 시스템 (2개) — 무기한 ===
    {
        keyMasked: "ak_live_ef88****",
        holderName: "외부 ERP (본사 결제)",
        permission: "R",
        channel: "EXTERNAL",
        issuedAt: daysAgoIso(155),
        expiresAt: undefined,            // 무기한 (장기 파트너)
        lastCalledAt: relativeIso(0),
        callCount30d: 8920,
        status: "active",
    },
    {
        keyMasked: "ak_live_a1d4****",
        holderName: "외부 물류사 (CJ대한통운)",
        permission: "R/W",
        channel: "EXTERNAL",
        issuedAt: daysAgoIso(120),
        expiresAt: daysFromNowIso(610),  // 약 1.7년
        lastCalledAt: relativeIso(45),
        callCount30d: 1480,
        status: "active",
    },

    // === 회수 키 (1개) — 권한 회수 기능 시연 ===
    {
        keyMasked: "ak_live_5ee0****",
        holderName: "매장 강원 (폐점)",
        permission: "R/W",
        channel: "STORE",
        issuedAt: daysAgoIso(220),
        expiresAt: daysAgoIso(5),         // 만료된 채로 회수됨
        callCount30d: 0,
        status: "revoked",
        revokedReason: "매장 폐점 (2026-04-30)",
    },
];

// ─── 집계 헬퍼 ──────────────────────────────────────────────────────────────

export function getApiKeyStats() {
    const total = API_KEYS.length;
    const active = API_KEYS.filter((k) => k.status === "active").length;
    const revoked30d = API_KEYS.filter((k) => k.status === "revoked").length;
    const totalCalls30d = API_KEYS.reduce((s, k) => s + k.callCount30d, 0);
    const avgCallsPerDay = Math.round(totalCalls30d / 30);

    // 만료 임박 (30일 이내) — active 키만 대상
    const cutoff30d = API_KEY_NOW_MS + 30 * 24 * 60 * 60 * 1000;
    const expiringSoon = API_KEYS.filter(
        (k) =>
            k.status === "active" &&
            k.expiresAt &&
            new Date(k.expiresAt).getTime() <= cutoff30d,
    ).length;

    return { total, active, revoked30d, avgCallsPerDay, expiringSoon };
}

/** 만료까지 남은 일수 — 무기한이면 null, 만료됨이면 음수 */
export function daysUntilExpiry(iso?: string): number | null {
    if (!iso) return null;
    const diffMs = new Date(iso).getTime() - API_KEY_NOW_MS;
    return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

