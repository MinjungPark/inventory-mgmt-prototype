/**
 * @file src/app/(prototype)/warehouse-inventory/components/WarehouseSkuTable.tsx
 * @description 전체 SKU 테이블 — 검색·필터·정렬.
 *              컬럼: SKU · 품목명 · 카테고리 · 창고 · 수량 · 단가 · 총액 · 최종 입고일.
 */

"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import type { ProductCategory, Sku, WarehouseId } from "@/types/inventory";

interface WarehouseSkuTableProps {
    skus: Sku[];
    /** 외부에서 창고 필터를 강제 (선택 창고 보기 등) */
    fixedWarehouseId?: WarehouseId | "ALL";
}

type SortKey = "id" | "name" | "category" | "warehouse" | "quantity" | "price" | "total" | "date";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const WAREHOUSE_LABEL: Record<string, string> = {
    "WH-1": "본사 창고",
    "WH-2": "매장 백창고",
    "WH-3": "외부 위탁",
};

const CATEGORIES: (ProductCategory | "ALL")[] = [
    "ALL",
    "의류", "신발", "언더웨어", "잡화", "화장품", "주얼리", "라이프스타일",
];

export default function WarehouseSkuTable({ skus, fixedWarehouseId = "ALL" }: WarehouseSkuTableProps) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
    const [sortKey, setSortKey] = useState<SortKey>("total");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [page, setPage] = useState(1);

    const processed = useMemo(() => {
        const q = search.trim().toLowerCase();

        const filtered = skus.filter((s) => {
            if (fixedWarehouseId !== "ALL" && s.warehouseId !== fixedWarehouseId) return false;
            if (category !== "ALL" && s.category !== category) return false;
            if (q && !s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false;
            return true;
        });

        const sorted = [...filtered].sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case "id":        cmp = a.id.localeCompare(b.id); break;
                case "name":      cmp = a.name.localeCompare(b.name); break;
                case "category":  cmp = a.category.localeCompare(b.category); break;
                case "warehouse": cmp = a.warehouseId.localeCompare(b.warehouseId); break;
                case "quantity":  cmp = a.warehouseQuantity - b.warehouseQuantity; break;
                case "price":     cmp = a.unitPriceKRW - b.unitPriceKRW; break;
                case "total":     cmp = (a.warehouseQuantity * a.unitPriceKRW) - (b.warehouseQuantity * b.unitPriceKRW); break;
                case "date":      cmp = a.lastRestockedAt.localeCompare(b.lastRestockedAt); break;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });

        return sorted;
    }, [skus, search, category, sortKey, sortDir, fixedWarehouseId]);

    const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = processed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
        setPage(1);
    }

    function SortIcon({ k }: { k: SortKey }) {
        if (sortKey !== k) return <ArrowUpDown size={11} strokeWidth={2} className="text-[#cbd5e1]" />;
        return sortDir === "asc"
            ? <ArrowUp size={11} strokeWidth={2.4} className="text-[#0d47a1]" />
            : <ArrowDown size={11} strokeWidth={2.4} className="text-[#0d47a1]" />;
    }

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* 필터 바 */}
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
                    총 <span className="font-semibold text-[#1a1a1a] tabular-nums">{processed.length.toLocaleString()}</span>건
                </div>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#718096]">
                            <th className="px-3 py-2.5">
                                <button onClick={() => toggleSort("id")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                                    SKU <SortIcon k="id" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5">
                                <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                                    품목명 <SortIcon k="name" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5">
                                <button onClick={() => toggleSort("category")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                                    카테고리 <SortIcon k="category" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5">
                                <button onClick={() => toggleSort("warehouse")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                                    창고 <SortIcon k="warehouse" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5 text-right">
                                <button onClick={() => toggleSort("quantity")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a] ml-auto">
                                    수량 <SortIcon k="quantity" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5 text-right">
                                <button onClick={() => toggleSort("price")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a] ml-auto">
                                    단가 <SortIcon k="price" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5 text-right">
                                <button onClick={() => toggleSort("total")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a] ml-auto">
                                    총액 <SortIcon k="total" />
                                </button>
                            </th>
                            <th className="px-3 py-2.5">
                                <button onClick={() => toggleSort("date")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                                    최종 입고일 <SortIcon k="date" />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-3 py-12 text-center text-[13px] text-[#718096]">
                                    조건에 맞는 SKU가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((sku) => {
                                const total = sku.warehouseQuantity * sku.unitPriceKRW;
                                return (
                                    <tr key={sku.id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-3 py-2.5 text-[12px] font-mono text-[#4a5568]">{sku.id}</td>
                                        <td className="px-3 py-2.5 text-[12px] font-medium text-[#1a1a1a]">{sku.name}</td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568]">{sku.category}</td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#4a5568]">{WAREHOUSE_LABEL[sku.warehouseId] ?? sku.warehouseId}</td>
                                        <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#1a1a1a] tabular-nums">{sku.warehouseQuantity.toLocaleString()}</td>
                                        <td className="px-3 py-2.5 text-[12px] text-right text-[#4a5568] tabular-nums">{sku.unitPriceKRW.toLocaleString()}</td>
                                        <td className="px-3 py-2.5 text-[12px] text-right font-semibold text-[#0d47a1] tabular-nums">{total.toLocaleString()}</td>
                                        <td className="px-3 py-2.5 text-[12px] text-[#94a3b8] tabular-nums">{formatDate(sku.lastRestockedAt)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            {processed.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                    <span className="text-[12px] text-[#718096]">
                        {(safePage - 1) * PAGE_SIZE + 1}~{Math.min(safePage * PAGE_SIZE, processed.length)} / {processed.length}
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
