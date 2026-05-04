/**
 * @file src/app/layout.tsx
 * @description Root Layout — Inventory Operations Management Prototype
 */

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prototype | Inventory Operations Management",
    description:
        "플래그십 매장 운영을 위한 통합 재고 관리 시스템 프로토타입. 매장 섹션·창고 구역 단위의 다품목 재고를 통합 관리합니다.",
    keywords: [
        "재고관리",
        "매장운영",
        "창고관리",
        "입출고",
        "Inventory",
        "Operations Management",
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="antialiased">{children}</body>
        </html>
    );
}
