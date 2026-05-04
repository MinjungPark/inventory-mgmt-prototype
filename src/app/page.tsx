/**
 * @file src/app/page.tsx
 * @description 루트 진입 시 /intro 로 자동 리다이렉트 (작업지시서 6-1)
 */

import { redirect } from "next/navigation";

export default function RootPage() {
    redirect("/intro");
}
