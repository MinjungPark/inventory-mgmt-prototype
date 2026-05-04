/**
 * @file src/data/seed/users.ts
 * @description 사용자 / 권한 시드 — 3역할 (v3 6-2)
 */

import type { User } from "@/types/inventory";

export const USERS: User[] = [
    {
        id: "usr-staff-01",
        name: "이매장",
        role: "STORE_STAFF",
        roleLabelKr: "매장 직원",
    },
    {
        id: "usr-hq-01",
        name: "박본사",
        role: "HQ_MANAGER",
        roleLabelKr: "본사 관리자",
    },
    {
        id: "usr-admin-01",
        name: "최관리",
        role: "SYSTEM_ADMIN",
        roleLabelKr: "시스템 관리자",
    },
];

export const DEFAULT_USER: User = USERS[1]; // 본사 관리자 기본
