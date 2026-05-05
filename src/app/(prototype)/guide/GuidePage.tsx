/**
 * @file src/app/(prototype)/guide/GuidePage.tsx
 * @description 화면 9 — 시스템 가이드 (운영자 매뉴얼)
 *
 *  레이아웃: 좌측 240px sticky TOC (4 그룹) + 우측 본문 (섹션 카드 세로 나열)
 *  콘텐츠는 _content.ts 의 GUIDE_SECTIONS 배열에서 가져옴.
 *  마지막 섹션 (system-structure)은 systemStructureSlot 플래그로
 *  본문 텍스트 대신 SystemStructureDiagram React 컴포넌트를 임베드.
 */

"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import SystemStructureDiagram from "@/components/common/SystemStructureDiagram";

import {
    GUIDE_SECTIONS,
    GROUP_LABEL,
    type GuideGroup,
    type GuideSection,
} from "./_content";

const GROUP_ORDER: GuideGroup[] = ["start", "core", "rationale", "design"];

function SectionBlock({ s }: { s: GuideSection }) {
    // 시스템 구조도 섹션은 폭을 880px로 확장하여 SVG 가용 폭을 모달과 비슷하게 확보.
    // 다른 섹션은 일반 본문 폭(820px) 유지.
    const sectionMaxW = s.systemStructureSlot ? "max-w-[880px]" : "max-w-[820px]";
    return (
        <section id={s.id} className={`scroll-mt-6 ${sectionMaxW}`}>
            {/* 제목 */}
            <h2 className="text-[20px] font-semibold leading-tight text-[#1a1a1a] tracking-tight">
                {s.title}
            </h2>

            {/* lead 인용 박스 */}
            <blockquote className="mt-3 rounded-md border border-[#0d47a1]/15 bg-[#e8eef6] px-4 py-3 text-[13px] leading-relaxed text-[#1a1a1a]">
                {s.lead}
            </blockquote>

            {/* 단락 */}
            {s.paragraphs?.map((p, i) => (
                <p
                    key={i}
                    className="mt-4 text-[14px] leading-relaxed text-[#4a5568]"
                >
                    {p}
                </p>
            ))}

            {/* 표 */}
            {s.table && (
                <div className="mt-5 overflow-hidden rounded-md border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <table className="w-full text-[13px]">
                        <thead>
                            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                                {s.table.headers.map((h, i) => (
                                    <th key={i} className="px-4 py-2.5 text-left" scope="col">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {s.table.rows.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc]"
                                >
                                    {row.map((c, j) => (
                                        <td
                                            key={j}
                                            className={`px-4 py-2.5 align-top ${
                                                j === 0
                                                    ? "font-semibold text-[#1a1a1a]"
                                                    : "text-[#4a5568]"
                                            }`}
                                        >
                                            {c}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 시스템 구조도 슬롯 — padding p-2 로 SVG 가용 폭 확보 (모달과 톤 정렬) */}
            {s.systemStructureSlot && (
                <div className="mt-5 rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-2">
                    <SystemStructureDiagram />
                </div>
            )}

            {/* Live 링크 */}
            {s.liveLink && (
                <Link
                    href={s.liveLink.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0d47a1] hover:underline"
                >
                    <ExternalLink size={13} strokeWidth={2.2} />
                    {s.liveLink.label}
                </Link>
            )}
        </section>
    );
}

export default function GuidePage() {
    return (
        <div>
            {/* 페이지 헤더 — 인트로와 톤 일관 */}
            <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0d47a1]">
                    IOM Prototype · 시스템 가이드
                </p>
                <h1 className="mt-1 text-[24px] font-semibold leading-tight text-[#1a1a1a] tracking-tight">
                    시스템 가이드
                </h1>
                <p className="mt-1 text-[13px] text-[#4a5568]">
                    운영자가 시스템을 처음 사용하거나 동료에게 인계할 때 참조하는 매뉴얼 — 화면 구성·설계 근거·디자인 시스템
                </p>
            </div>

            {/* 2-column: 240px TOC + 본문 */}
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                {/* 좌측 TOC — 4 그룹 */}
                <nav className="lg:sticky lg:top-20 lg:self-start lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                    <div className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        {GROUP_ORDER.map((group) => {
                            const items = GUIDE_SECTIONS.filter((s) => s.group === group);
                            if (items.length === 0) return null;
                            return (
                                <div key={group} className="mb-4 last:mb-0">
                                    <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                                        {GROUP_LABEL[group]}
                                    </p>
                                    <ul className="space-y-0.5">
                                        {items.map((s) => (
                                            <li key={s.id}>
                                                <a
                                                    href={`#${s.id}`}
                                                    className="block rounded-md px-2 py-1.5 text-[12px] text-[#4a5568] transition-colors hover:bg-[#e8eef6] hover:text-[#0d47a1]"
                                                >
                                                    {s.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* 본문 — 섹션 카드 세로 나열
                    article max-w 제거 → SectionBlock 안에서 섹션별 max-w 적용 (시스템 구조도만 880, 그 외 820) */}
                <article className="min-w-0 space-y-12">
                    {GUIDE_SECTIONS.map((s) => (
                        <SectionBlock key={s.id} s={s} />
                    ))}
                </article>
            </div>
        </div>
    );
}
