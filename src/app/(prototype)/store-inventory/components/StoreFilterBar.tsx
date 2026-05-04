/**
 * @file src/app/(prototype)/store-inventory/components/StoreFilterBar.tsx
 * @description 매장 재고 필터바 — 카테고리·존·재고 수준 + 검색.
 */

"use client";

import { Search } from "lucide-react";
import type { ProductCategory } from "@/types/inventory";
import type { StockStatus } from "@/data/seed/store-helpers";

interface StoreFilterBarProps {
    category: ProductCategory | "ALL";
    onCategoryChange: (v: ProductCategory | "ALL") => void;
    zone: string;
    onZoneChange: (v: string) => void;
    status: StockStatus | "ALL";
    onStatusChange: (v: StockStatus | "ALL") => void;
    search: string;
    onSearchChange: (v: string) => void;
}

const CATEGORIES: (ProductCategory | "ALL")[] = [
    "ALL",
    "의류",
    "신발",
    "언더웨어",
    "잡화",
    "화장품",
    "주얼리",
    "라이프스타일",
];

const STATUS_OPTIONS: { value: StockStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "전체" },
    { value: "sufficient", label: "충분" },
    { value: "warning", label: "주의" },
    { value: "shortage", label: "부족" },
];

const ZONES: { value: string; label: string }[] = [
    { value: "ALL", label: "전체" },
    { value: "A", label: "A존" },
    { value: "B", label: "B존" },
    { value: "C", label: "C존" },
];

const SELECT_BASE =
    "h-9 pl-3 pr-8 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 appearance-none cursor-pointer transition-colors";
const SELECT_ARROW =
    "absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none text-[10px]";

export default function StoreFilterBar({
    category,
    onCategoryChange,
    zone,
    onZoneChange,
    status,
    onStatusChange,
    search,
    onSearchChange,
}: StoreFilterBarProps) {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center gap-3">
                {/* 카테고리 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        카테고리
                    </label>
                    <div className="relative">
                        <select
                            className={SELECT_BASE}
                            value={category}
                            onChange={(e) =>
                                onCategoryChange(e.target.value as ProductCategory | "ALL")
                            }
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c === "ALL" ? "전체" : c}
                                </option>
                            ))}
                        </select>
                        <span className={SELECT_ARROW}>▼</span>
                    </div>
                </div>

                {/* 존 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        존(Zone)
                    </label>
                    <div className="relative">
                        <select
                            className={SELECT_BASE}
                            value={zone}
                            onChange={(e) => onZoneChange(e.target.value)}
                        >
                            {ZONES.map((z) => (
                                <option key={z.value} value={z.value}>
                                    {z.label}
                                </option>
                            ))}
                        </select>
                        <span className={SELECT_ARROW}>▼</span>
                    </div>
                </div>

                {/* 재고 수준 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        재고 수준
                    </label>
                    <div className="relative">
                        <select
                            className={SELECT_BASE}
                            value={status}
                            onChange={(e) =>
                                onStatusChange(e.target.value as StockStatus | "ALL")
                            }
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <span className={SELECT_ARROW}>▼</span>
                    </div>
                </div>

                {/* 검색 */}
                <div className="flex flex-col gap-1 ml-auto min-w-[240px] flex-1 max-w-[360px]">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        검색
                    </label>
                    <div className="relative">
                        <Search
                            size={14}
                            strokeWidth={2}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="SKU 또는 품목명 검색"
                            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] placeholder:text-[#94a3b8] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 transition-colors"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
