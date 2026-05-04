/**
 * @file src/app/(prototype)/admin/threshold/components/ThresholdTable.tsx
 * @description SKU별 알림 기준 설정 테이블 — 인라인 편집 + 검색 + 페이지네이션.
 */

"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import type { ProductCategory, Sku } from "@/types/inventory";

interface ThresholdTableProps {
    skus: Sku[];
    /** 변경된 SKU 기준 수량 — Map<skuId, newThreshold> */
    overrides: Map<string, number>;
    onChange: (skuId: string, newThreshold: number) => void;
    onReset: (skuId: string) => void;
    perStoreEnabled: boolean;
}

const CATEGORIES: (ProductCategory | "ALL")[] = [
    "ALL",
    "의류", "신발", "언더웨어", "잡화", "화장품", "주얼리", "라이프스타일",
];

const PAGE_SIZE = 15;

export default function ThresholdTable({
    skus,
    overrides,
    onChange,
    onReset,
    perStoreEnabled,
}: ThresholdTableProps) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return skus.filter((s) => {
            if (category !== "ALL" && s.category !== category) return false;
            if (q && !s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [skus, search, category]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* 필터바 */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#e2e8f0]">
                <div className="relative flex-1 min-w-[240px] max-w-[360px]">
                    <Search
                        size={14}
                        strokeWidth={2}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="SKU 또는 품목명 검색"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full h-9 pl-9 pr-3 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] placeholder:text-[#94a3b8] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 transition-colors"
                    />
                </div>

                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value as ProductCategory | "ALL"); setPage(1); }}
                        className="h-9 pl-3 pr-8 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 appearance-none cursor-pointer transition-colors"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c === "ALL" ? "전체 카테고리" : c}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none text-[10px]">▼</span>
                </div>

                <div className="ml-auto text-[12px] text-[#718096]">
                    총 <span className="font-semibold text-[#1a1a1a] tabular-nums">{filtered.length.toLocaleString()}</span>건 ·
                    변경 <span className="font-semibold text-[#0d47a1] tabular-nums">{overrides.size}</span>건
                </div>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-3 py-2.5">SKU</th>
                            <th className="px-3 py-2.5">품목명</th>
                            <th className="px-3 py-2.5">카테고리</th>
                            <th className="px-3 py-2.5 text-right">현재 매장 수량</th>
                            <th className="px-3 py-2.5 text-right">알림 기준 수량</th>
                            {perStoreEnabled && <th className="px-3 py-2.5 text-center">매장별 차등</th>}
                            <th className="px-3 py-2.5 text-center">수정</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={perStoreEnabled ? 7 : 6} className="px-3 py-12 text-center text-[13px] text-[#718096]">
                                    조건에 맞는 SKU가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((sku) => {
                                const overridden = overrides.has(sku.id);
                                const currentThreshold = overrides.get(sku.id) ?? sku.threshold;
                                return (
                                    <tr
                                        key={sku.id}
                                        className={`transition-colors ${overridden ? "bg-[rgba(13,71,161,0.04)]" : "hover:bg-[#f8fafc]"}`}
                                    >
                                        <td className="px-3 py-2.5 text-[12px] font-mono text-[#4a5568]">
                                            {sku.id}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">
                                            {sku.name}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568]">
                                            {sku.category}
                                        </td>
                                        <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#1a1a1a] tabular-nums">
                                            {sku.storeQuantity.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            <input
                                                type="number"
                                                min={1}
                                                value={currentThreshold}
                                                onChange={(e) => {
                                                    const n = parseInt(e.target.value, 10);
                                                    if (!isNaN(n) && n > 0) onChange(sku.id, n);
                                                }}
                                                className={`w-20 h-7 px-2 rounded-md border text-[12px] text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0d47a1]/15 transition-colors ${
                                                    overridden
                                                        ? "border-[#0d47a1] bg-white text-[#0d47a1] font-semibold"
                                                        : "border-[#e2e8f0] bg-white text-[#1a1a1a] hover:border-[#cbd5e1] focus:border-[#0d47a1]"
                                                }`}
                                            />
                                        </td>
                                        {perStoreEnabled && (
                                            <td className="px-3 py-2.5 text-center">
                                                <button
                                                    type="button"
                                                    className="text-[11px] font-medium text-[#0d47a1] hover:underline"
                                                    title="매장별 차등 기준 수량 설정 (프로토타입에서는 미구현)"
                                                >
                                                    매장별 설정
                                                </button>
                                            </td>
                                        )}
                                        <td className="px-3 py-2.5 text-center">
                                            {overridden ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onReset(sku.id)}
                                                    className="inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#e2e8f0] bg-white text-[11px] font-medium text-[#4a5568] hover:bg-[#f8fafc] hover:text-[#1a1a1a] transition-colors"
                                                    title="이 SKU의 변경을 되돌립니다"
                                                >
                                                    <RotateCcw size={11} strokeWidth={2.2} />
                                                    되돌림
                                                </button>
                                            ) : (
                                                <span className="text-[11px] text-[#94a3b8]">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {filtered.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                    <span className="text-[12px] text-[#718096]">
                        {(safePage - 1) * PAGE_SIZE + 1}~
                        {Math.min(safePage * PAGE_SIZE, filtered.length)} / {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="px-3 h-8 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            이전
                        </button>
                        <span className="px-3 h-8 inline-flex items-center text-[12px] font-semibold text-[#1a1a1a] tabular-nums">
                            {safePage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className="px-3 h-8 rounded-md border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#4a5568] hover:bg-[#f1f5f9] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
