/**
 * @file src/app/(prototype)/api-sync/components/ApiKeyRbacCard.tsx
 * @description 화면 6 — API 키 권한 체계 (RBAC) 카드.
 *
 *  RFP 2-2 ① "본사 발급 API 키" 메시지의 시각화:
 *   - 키 = 본사 DB 재고 관리 섹션 접근 토큰
 *   - 매장 / 외부 시스템별 권한 차등 (R / R/W)
 *   - 회수(revoked) 키 — 권한 회수 기능 시연용
 *
 *  3분할 구조: 헤더(InfoHint) → KPI 4종 → 키 발급 표.
 *  hydration 안전을 위해 "활성"·"활성 한국어"·시간 표기는 모듈 로드 1회 시드 기반.
 */

"use client";

import { KeyRound, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import InfoHint from "@/components/ui/InfoHint";
import {
    API_KEYS,
    getApiKeyStats,
    daysUntilExpiry,
    type ApiKeyEntry,
    type ApiKeyChannel,
} from "@/data/seed/api-keys";

const STATS = getApiKeyStats();

// 톤 정책: 매장 키는 디폴트 = muted 톤다운, 외부 시스템만 Primary outline 강조.
//          → "기관 단위 연동" 시각 시그널.
const MUTED_CHIP_TONE = "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]";
const PRIMARY_OUTLINE_TONE = "bg-[#e8eef6] text-[#0d47a1] border-[#0d47a1]/30";

const CHANNEL_LABEL: Record<ApiKeyChannel, { tag: string; tone: string }> = {
    STORE:    { tag: "매장",         tone: MUTED_CHIP_TONE },
    EXTERNAL: { tag: "외부 시스템",  tone: PRIMARY_OUTLINE_TONE },
};

function formatRelative(iso?: string): string {
    if (!iso) return "—";
    const diffMs = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diffMs / 60_000);
    if (min < 1) return "방금";
    if (min < 60) return `${min}분 전`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}시간 전`;
    const d = Math.floor(hr / 24);
    return `${d}일 전`;
}

function formatIssuedDate(iso: string): string {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

interface KpiBoxProps {
    label: string;
    value: string;
    sub?: string;
    Icon: typeof KeyRound;
    tone?: "primary" | "ok" | "warn";
}

function KpiBox({ label, value, sub, Icon, tone = "primary" }: KpiBoxProps) {
    const toneCls =
        tone === "ok"
            ? "text-[#15803d]"
            : tone === "warn"
                ? "text-[#c2410c]"
                : "text-[#0d47a1]";
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-md border border-[#e2e8f0] bg-[#f8fafc]">
            <span className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md bg-white border border-[#e2e8f0] ${toneCls}`}>
                <Icon size={16} strokeWidth={2.2} />
            </span>
            <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    {label}
                </div>
                <div className={`text-[18px] font-bold tabular-nums leading-tight ${toneCls}`}>
                    {value}
                </div>
                {sub && (
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">{sub}</div>
                )}
            </div>
        </div>
    );
}

// 권한 컬럼 톤다운 — R/W·R 모두 동일 muted.
//   강조 대상은 부분/실패/만료 임박 같은 "알림"이지 권한 분류가 아니므로
//   색을 빼서 표 전체의 시각 무게를 낮춤.
function PermissionPill({ permission }: { permission: ApiKeyEntry["permission"] }) {
    return (
        <span className="inline-flex items-center px-1.5 py-[2px] rounded-md text-[11px] font-bold border bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]">
            {permission}
        </span>
    );
}

function StatusPill({ entry }: { entry: ApiKeyEntry }) {
    if (entry.status === "active") {
        return (
            <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded-md text-[11px] font-semibold bg-[#ecfdf5] text-[#15803d] border border-[#15803d]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                활성
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded-md text-[11px] font-semibold bg-[#fef2f2] text-[#b34530] border border-[#b34530]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b34530]" />
            회수
        </span>
    );
}

export default function ApiKeyRbacCard() {
    const activeKeys = API_KEYS.filter((k) => k.status === "active");
    const revokedKeys = API_KEYS.filter((k) => k.status === "revoked");

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* 헤더 */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#e2e8f0]">
                <div className="flex items-start gap-2">
                    <KeyRound size={16} strokeWidth={2.2} className="text-[#0d47a1] mt-[3px]" />
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                                API 키 권한 체계 (RBAC)
                            </h3>
                            <InfoHint
                                title="RBAC (Role-Based Access Control)"
                                definition="역할 기반 접근 제어 — 누가 어떤 데이터를 어떤 방식으로(R · R/W) 사용할 수 있는지 키 단위로 사전 정의해 두는 보안 모델입니다. 본사 DB 재고 관리 섹션의 '출입증' 체계로 이해하시면 됩니다."
                                bullets={[
                                    "권한 발급 (Issue) — 매장 · 외부사마다 고유 API 키를 발급하며, 키 단위로 접근 가능한 데이터 범위와 행위(R · R/W)를 결정합니다.",
                                    "권한 검증 (Authenticate) — 모든 API 호출에 키가 헤더로 포함되며, 게이트웨이가 호출 시점마다 권한을 검증합니다. 권한 외 데이터 요청은 차단됩니다.",
                                    "권한 회수 (Revoke) — 매장 폐점 · 키 노출 · 외부사 계약 종료 시 본사가 키를 즉시 회수합니다. 회수된 키는 모든 호출이 거부됩니다.",
                                    "호출 감사 (Audit) — 키별 호출 이력(시각·엔드포인트·결과)이 자체 DB에 자동 기록되어, 사고 시 누가 무엇을 호출했는지 역추적이 가능합니다.",
                                ]}
                                placement="bottom"
                                width={360}
                            />
                        </div>
                        <p className="text-[12px] text-[#4a5568] mt-0.5">
                            매장 · 외부사별 발급 키 현황 — 본사 DB 재고 관리 섹션 접근 토큰
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI 4종 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 py-4 border-b border-[#e2e8f0]">
                <KpiBox
                    label="발급 키"
                    value={`${STATS.total}개`}
                    sub={`매장 ${STATS.total - 2}개 + 외부 2개`}
                    Icon={KeyRound}
                    tone="primary"
                />
                <KpiBox
                    label="활성"
                    value={`${STATS.active}개`}
                    sub="현재 호출 가능"
                    Icon={ShieldCheck}
                    tone="ok"
                />
                <KpiBox
                    label="만료 임박"
                    value={`${STATS.expiringSoon}개`}
                    sub="30일 이내 — 갱신 필요"
                    Icon={Clock}
                    tone="warn"
                />
                <KpiBox
                    label="일 평균 호출"
                    value={`${STATS.avgCallsPerDay.toLocaleString()}회`}
                    sub="최근 30일 누적 ÷ 30"
                    Icon={ShieldCheck}
                    tone="primary"
                />
            </div>

            {/* 키 발급 표 */}
            <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-[#64748b]">
                            <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider">발급 대상</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">키 식별자</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">권한</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">분류</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">발급 / 만료</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-right">30일 호출</th>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">최근 호출</th>
                            <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeKeys.map((k) => {
                            const ch = CHANNEL_LABEL[k.channel];
                            const daysLeft = daysUntilExpiry(k.expiresAt);
                            const isExpiringSoon = daysLeft !== null && daysLeft <= 30 && daysLeft >= 0;
                            return (
                                <tr key={k.keyMasked} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                                    <td className="px-5 py-2.5 text-[12px] font-semibold text-[#1a1a1a]">{k.holderName}</td>
                                    <td className="px-3 py-2.5 font-mono text-[11px] text-[#4a5568]">{k.keyMasked}</td>
                                    <td className="px-3 py-2.5"><PermissionPill permission={k.permission} /></td>
                                    <td className="px-3 py-2.5">
                                        <span className={`inline-flex items-center px-1.5 py-[2px] rounded-md text-[11px] font-semibold border ${ch.tone}`}>
                                            {ch.tag}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-[11px] tabular-nums leading-tight">
                                        <div className="text-[#4a5568]">{formatIssuedDate(k.issuedAt)}</div>
                                        {k.expiresAt ? (
                                            <div
                                                className={`text-[11px] font-semibold ${
                                                    isExpiringSoon ? "text-[#b34530]" : "text-[#94a3b8]"
                                                }`}
                                            >
                                                ~ {formatIssuedDate(k.expiresAt)}
                                                {isExpiringSoon && (
                                                    <span className="ml-1 font-bold">(D-{daysLeft})</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-[#15803d] font-semibold">~ 무기한</div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-[11px] text-right tabular-nums text-[#1a1a1a] font-semibold">
                                        {k.callCount30d.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2.5 text-[11px] text-[#64748b] tabular-nums">{formatRelative(k.lastCalledAt)}</td>
                                    <td className="px-5 py-2.5"><StatusPill entry={k} /></td>
                                </tr>
                            );
                        })}
                        {revokedKeys.length > 0 && (
                            <>
                                <tr>
                                    <td colSpan={8} className="px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#b34530]">
                                            <AlertCircle size={12} strokeWidth={2.2} />
                                            회수된 키 — 권한 회수 시연
                                        </div>
                                    </td>
                                </tr>
                                {revokedKeys.map((k) => {
                                    const ch = CHANNEL_LABEL[k.channel];
                                    return (
                                        <tr key={k.keyMasked} className="border-b border-[#f1f5f9] bg-[#fef2f2]/40">
                                            <td className="px-5 py-2.5 text-[12px] font-semibold text-[#4a5568]">
                                                {k.holderName}
                                                {k.revokedReason && (
                                                    <span className="block text-[11px] font-normal text-[#94a3b8] mt-0.5">
                                                        {k.revokedReason}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 font-mono text-[11px] text-[#94a3b8] line-through">{k.keyMasked}</td>
                                            <td className="px-3 py-2.5"><span className="text-[11px] text-[#94a3b8]">—</span></td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex items-center px-1.5 py-[2px] rounded-md text-[11px] font-semibold border ${ch.tone} opacity-60`}>
                                                    {ch.tag}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-[11px] text-[#94a3b8] tabular-nums leading-tight">
                                                <div>{formatIssuedDate(k.issuedAt)}</div>
                                                {k.expiresAt && (
                                                    <div className="line-through">~ {formatIssuedDate(k.expiresAt)}</div>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-[11px] text-right text-[#94a3b8] tabular-nums">—</td>
                                            <td className="px-3 py-2.5 text-[11px] text-[#94a3b8]">—</td>
                                            <td className="px-5 py-2.5"><StatusPill entry={k} /></td>
                                        </tr>
                                    );
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
