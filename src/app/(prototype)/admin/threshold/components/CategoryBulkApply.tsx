/**
 * @file src/app/(prototype)/admin/threshold/components/CategoryBulkApply.tsx
 * @description 카테고리 일괄 설정 카드 — 카테고리 선택 + 기준 수량 입력 + 매장별 차등 토글 + 적용 버튼.
 */

"use client";

import { useState } from "react";
import { Layers, Check } from "lucide-react";
import type { ProductCategory } from "@/types/inventory";

interface CategoryBulkApplyProps {
    perStoreEnabled: boolean;
    onPerStoreToggle: (v: boolean) => void;
    onApply: (category: ProductCategory | "ALL", value: number) => void;
}

const CATEGORIES: (ProductCategory | "ALL")[] = [
    "ALL",
    "의류", "신발", "언더웨어", "잡화", "화장품", "주얼리", "라이프스타일",
];

export default function CategoryBulkApply({
    perStoreEnabled,
    onPerStoreToggle,
    onApply,
}: CategoryBulkApplyProps) {
    const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
    const [value, setValue] = useState<string>("10");

    function handleApply() {
        const n = parseInt(value, 10);
        if (isNaN(n) || n <= 0) return;
        onApply(category, n);
    }

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
                <Layers size={16} strokeWidth={2} className="text-[#0d47a1]" />
                <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
                    카테고리 일괄 설정
                </h3>
                <span className="text-[12px] text-[#718096]">
                    선택 카테고리의 모든 SKU에 동일 기준 수량을 일괄 적용합니다.
                </span>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                {/* 카테고리 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        카테고리
                    </label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ProductCategory | "ALL")}
                            className="h-9 pl-3 pr-8 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 appearance-none cursor-pointer transition-colors"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c === "ALL" ? "전체" : c}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none text-[10px]">▼</span>
                    </div>
                </div>

                {/* 기준 수량 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        알림 기준 수량
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-32 h-9 px-3 rounded-md border border-[#e2e8f0] bg-white text-[13px] text-[#1a1a1a] hover:border-[#cbd5e1] focus:outline-none focus:border-[#0d47a1] focus:ring-2 focus:ring-[#0d47a1]/15 tabular-nums transition-colors"
                    />
                </div>

                {/* 매장별 차등 토글 */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                        매장별 차등
                    </label>
                    <button
                        type="button"
                        onClick={() => onPerStoreToggle(!perStoreEnabled)}
                        className={`inline-flex items-center gap-2 h-9 px-3 rounded-md border text-[12px] font-semibold transition-colors ${
                            perStoreEnabled
                                ? "bg-[#e8eef6] border-[#0d47a1]/30 text-[#0d47a1]"
                                : "bg-white border-[#e2e8f0] text-[#4a5568] hover:border-[#cbd5e1] hover:text-[#1a1a1a]"
                        }`}
                    >
                        <span
                            className={`inline-flex items-center justify-center w-4 h-4 rounded-full border ${
                                perStoreEnabled
                                    ? "bg-[#0d47a1] border-[#0d47a1]"
                                    : "bg-white border-[#cbd5e1]"
                            }`}
                        >
                            {perStoreEnabled && (
                                <Check size={10} strokeWidth={3} className="text-white" />
                            )}
                        </span>
                        {perStoreEnabled ? "활성" : "비활성"}
                    </button>
                </div>

                {/* 적용 버튼 */}
                <button
                    type="button"
                    onClick={handleApply}
                    className="ml-auto inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-gradient-to-br from-[#1565c0] to-[#0d47a1] text-white text-[13px] font-semibold shadow-sm hover:shadow-[0_2px_8px_rgba(13,71,161,0.20)] transition-all"
                >
                    전체 적용
                </button>
            </div>
        </div>
    );
}
