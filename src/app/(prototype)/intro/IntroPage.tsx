/**
 * @file src/app/(prototype)/intro/IntroPage.tsx
 * @description 화면 1 — 프로토타입 소개 (Intro)
 *
 *  레이아웃 (ENERTORK 인트로 패턴 미러링):
 *    좌측 240px sticky TOC + 우측 본문(.intro-scope 컨테이너)
 *
 *  본문 구성 (3 부분):
 *    1) introHtmlBefore — Cover · Section 1 · Section 2 · Section 3 (HTML)
 *    2) [시스템 구조도 React 슬롯] — 우리가 개발한 SystemStructureDiagram 임베드
 *    3) introHtmlAfter — Section 4 · Section 5 · Section 6 · Footer (HTML)
 *
 *  CSS 격리: intro.css의 .intro-scope 컨테이너로 다른 페이지 영향 없음.
 */

"use client";

import { useRef } from "react";
import SystemStructureDiagram from "@/components/common/SystemStructureDiagram";
import { introHtmlBefore, introHtmlAfter } from "./introHtml";
import "./intro.css";

const TOC_SECTIONS = [
    { id: "section-1", label: "프로토타입 소개" },
    { id: "section-2", label: "고객 현재 상황 (As-Is)" },
    { id: "section-3", label: "프로토타입 방향 (To-Be)" },
    { id: "section-4", label: "기존 시스템 연동 아키텍처" },
    { id: "section-5", label: "반영된 기능" },
    { id: "section-6", label: "차별화 포인트" },
] as const;

export default function IntroPage() {
    const articleRef = useRef<HTMLElement>(null);

    function handleScrollTo(sectionId: string) {
        const root = articleRef.current;
        if (!root) return;
        const target = root.querySelector<HTMLElement>(`#${sectionId}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div>
            {/* 페이지 헤더 — 다른 화면과 톤 통일 */}
            <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0d47a1]">
                    IOM Prototype · 프로토타입 소개
                </p>
                <h1 className="mt-1 text-[24px] font-semibold leading-tight text-[#1a1a1a] tracking-tight">
                    프로토타입 소개
                </h1>
                <p className="mt-1 text-[13px] text-[#4a5568]">
                    매장·창고 재고 관리를 본사 통합 데이터 레이어로 재설계한 프로토타입의 정체성·As-Is/To-Be·차별화·연동 아키텍처
                </p>
            </div>

            {/* 2-column: 240px TOC + 본문 */}
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                {/* 좌측 TOC */}
                <nav className="lg:sticky lg:top-20 lg:self-start lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                    <div className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#718096]">
                            목차
                        </p>
                        <ul className="space-y-0.5">
                            {TOC_SECTIONS.map((s) => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleScrollTo(s.id)}
                                        className="block w-full rounded-md px-2 py-1.5 text-left text-[12px] text-[#4a5568] transition-colors hover:bg-[#e8eef6] hover:text-[#0d47a1]"
                                    >
                                        {s.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* 본문 — Before HTML + 시스템 구조도 + After HTML
                    세 덩어리 모두 .page > .content 구조로 폭·정렬·패딩 공유 → 끊김 없는 한 페이지 흐름 */}
                <article
                    ref={articleRef}
                    className="intro-scope min-w-0 rounded-md border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-white"
                >
                    {/* Part 1: Cover ~ Section 3 (자가완결 .page) */}
                    <div dangerouslySetInnerHTML={{ __html: introHtmlBefore.trim() }} />

                    {/* 시스템 구조도 React 슬롯 — .page > .content 구조로 위·아래 HTML과 정확히 동일한 박스 공유 */}
                    <div className="page">
                        <div className="content structure-content">
                            <div className="structure-slot">
                                <div className="structure-slot-label">
                                    ◎ 시스템 구조도 — 4 인격 · 본사 DB 신축 영역 · API 게이트웨이
                                </div>
                                <SystemStructureDiagram />
                            </div>
                        </div>
                    </div>

                    {/* Part 2: Section 4 ~ Footer (자가완결 .page) */}
                    <div dangerouslySetInnerHTML={{ __html: introHtmlAfter.trim() }} />
                </article>
            </div>
        </div>
    );
}
