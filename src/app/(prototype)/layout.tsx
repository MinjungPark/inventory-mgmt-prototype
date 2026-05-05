/**
 * @file src/app/(prototype)/layout.tsx
 * @description IOM Prototype Layout — 좌측 사이드바 + 상단 헤더 (라이트 톤 / Calm Enterprise)
 *
 *  - ecogeo/admin/aqualab/layout.tsx 패턴 미러링 + 다크 → 라이트 변환
 *  - 좌상단: P / Prototype / Inventory Operations Management (약어 IOM 사용 금지)
 *  - 카테고리 라벨: 플래그십 매장 운영
 *  - 9개 메뉴 + 시스템 가이드 분리
 *  - 우상단: 사용자 영역 (역할 표시)
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Info,
    LayoutDashboard,
    Store,
    Package,
    ArrowLeftRight,
    Plug,
    Bell,
    Settings,
    BookOpen,
    KeyRound,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from "lucide-react";

// ─── 메뉴 정의 ───────────────────────────────────────────────────────────────

interface MenuItem {
    href: string;
    label: string;
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    section: "main" | "guide";
}

const MENUS: MenuItem[] = [
    { href: "/intro",                label: "프로토타입 소개",            Icon: Info,             section: "main" },
    { href: "/dashboard",            label: "통합 대시보드",              Icon: LayoutDashboard,  section: "main" },
    { href: "/store-inventory",      label: "매장 재고",                 Icon: Store,            section: "main" },
    { href: "/warehouse-inventory",  label: "창고 재고",                 Icon: Package,          section: "main" },
    { href: "/tracking",             label: "입출고 트래킹",              Icon: ArrowLeftRight,   section: "main" },
    { href: "/api-sync",             label: "데이터 자동 동기화 (API 연동)", Icon: Plug,             section: "main" },
    { href: "/alerts",               label: "재고 알림",                 Icon: Bell,             section: "main" },
    { href: "/admin/threshold",      label: "재고 알림 설정",             Icon: Settings,         section: "main" },
    { href: "/guide",                label: "시스템 가이드",              Icon: BookOpen,         section: "guide" },
];

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // 라우트 변경 시 window 스크롤을 최상단으로 리셋.
    // App Router 는 메뉴 클릭 후에도 이전 스크롤 위치를 유지할 수 있어 명시적으로 리셋.
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    const mainMenus = MENUS.filter((m) => m.section === "main");
    const guideMenus = MENUS.filter((m) => m.section === "guide");

    const activeLabel =
        MENUS.find((m) => pathname === m.href || pathname.startsWith(m.href + "/"))?.label ??
        "Inventory Operations Mgmt.";

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1a1a1a]">
            {/* ─── 좌측 사이드바 ─── */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 72 }}
                className="fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-[#e2e8f0] flex flex-col transition-all duration-300 overflow-hidden"
            >
                {/* 좌상단 시스템 표시 — "P / Prototype / Inventory Operations Mgmt." */}
                <div className="h-16 flex items-center px-5 border-b border-[#e2e8f0] shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#1565c0] to-[#0d47a1] flex items-center justify-center shrink-0 shadow-sm shadow-[#0d47a1]/20">
                            <span className="text-white font-bold text-[15px] tracking-tight">P</span>
                        </div>
                        <div
                            className={`flex flex-col leading-tight transition-opacity duration-300 ${
                                sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                            }`}
                        >
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#718096]">
                                Prototype
                            </span>
                            <span className="text-[14px] font-semibold text-[#1a1a1a] tracking-tight">
                                Inventory Operations Mgmt.
                            </span>
                        </div>
                    </div>
                </div>

                {/* 카테고리 라벨 — "플래그십 매장 운영" */}
                <div
                    className={`px-5 pt-5 pb-2 transition-opacity duration-300 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                    }`}
                >
                    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#718096]">
                        <KeyRound size={13} strokeWidth={2.2} className="text-[#0d47a1]" />
                        <span className="text-[#4a5568]">플래그십 매장 운영</span>
                    </div>
                </div>

                {/* 메인 메뉴 */}
                <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
                    {mainMenus.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.Icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={!sidebarOpen ? item.label : ""}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group relative ${
                                    isActive
                                        ? "bg-[#e8f0fb] text-[#0d47a1] font-medium"
                                        : "text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a]"
                                }`}
                            >
                                <Icon
                                    size={17}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                    className={`shrink-0 ${
                                        isActive
                                            ? "text-[#0d47a1]"
                                            : "text-[#718096] group-hover:text-[#1a1a1a]"
                                    }`}
                                />
                                <span
                                    className={`whitespace-nowrap text-[14px] transition-opacity duration-300 ${
                                        sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                                    }`}
                                >
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#0d47a1] rounded-l-full" />
                                )}
                            </Link>
                        );
                    })}

                    {/* 가이드 섹션 */}
                    <div
                        className={`px-2 pt-5 pb-1 transition-opacity duration-300 ${
                            sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                        }`}
                    >
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8] px-1">
                            Documentation
                        </div>
                    </div>
                    {guideMenus.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.Icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={!sidebarOpen ? item.label : ""}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group relative ${
                                    isActive
                                        ? "bg-[#e8f0fb] text-[#0d47a1] font-medium"
                                        : "text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a]"
                                }`}
                            >
                                <Icon
                                    size={17}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                    className={`shrink-0 ${
                                        isActive
                                            ? "text-[#0d47a1]"
                                            : "text-[#718096] group-hover:text-[#1a1a1a]"
                                    }`}
                                />
                                <span
                                    className={`whitespace-nowrap text-[14px] transition-opacity duration-300 ${
                                        sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                                    }`}
                                >
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#0d47a1] rounded-l-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 토글 버튼 */}
                <div className="p-3 border-t border-[#e2e8f0] shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-2 text-[#718096] hover:text-[#1a1a1a] hover:bg-[#f1f5f9] rounded-md transition-colors"
                        title={sidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft size={16} strokeWidth={2} />
                        ) : (
                            <ChevronRight size={16} strokeWidth={2} />
                        )}
                    </button>
                </div>
            </motion.aside>

            {/* ─── 메인 영역 ─── */}
            <main
                className={`transition-all duration-300 ${
                    sidebarOpen ? "ml-[280px]" : "ml-[72px]"
                }`}
            >
                {/* 상단 헤더 */}
                <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-[#e2e8f0] px-6 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[#cbd5e1] text-[16px]">/</span>
                        <h2 className="text-[15px] md:text-[16px] font-semibold text-[#1a1a1a]">
                            {activeLabel}
                        </h2>
                    </div>

                    {/* 우상단 토글 3종 — 언어 / 통화 / 사용자 (ENERTORK 패턴) */}
                    <div className="flex items-center gap-2.5">
                        {/* 언어 토글 */}
                        <button
                            type="button"
                            className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-md border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#4a5568] hover:bg-[#f8fafc] hover:text-[#1a1a1a] hover:border-[#cbd5e1] transition-colors"
                        >
                            <span>한국어</span>
                            <ChevronDown size={12} strokeWidth={2} className="text-[#94a3b8]" />
                        </button>

                        {/* 통화 토글 */}
                        <button
                            type="button"
                            className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-md border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#4a5568] hover:bg-[#f8fafc] hover:text-[#1a1a1a] hover:border-[#cbd5e1] transition-colors"
                        >
                            <span>KRW</span>
                            <ChevronDown size={12} strokeWidth={2} className="text-[#94a3b8]" />
                        </button>

                        <div className="hidden md:block h-4 w-px bg-[#e2e8f0] mx-1" />

                        {/* 사용자 영역 */}
                        <button
                            type="button"
                            className="flex items-center gap-2.5 h-9 pr-2 pl-1 rounded-md hover:bg-[#f8fafc] transition-colors"
                        >
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1565c0] to-[#0d47a1] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                                본
                            </span>
                            <span className="hidden md:inline text-[13px] font-semibold text-[#1a1a1a]">
                                본사 관리자
                            </span>
                            <ChevronDown
                                size={13}
                                strokeWidth={2}
                                className="hidden md:inline text-[#94a3b8]"
                            />
                        </button>
                    </div>
                </header>

                {/* 페이지 콘텐츠 */}
                <div className="p-6 md:p-8 w-full mx-auto min-h-[calc(100vh-64px)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
