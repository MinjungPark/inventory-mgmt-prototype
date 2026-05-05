/**
 * @file src/app/(prototype)/intro/page.tsx
 * @description 라우트 진입점 — 콘텐츠는 ./IntroPage 컴포넌트에 위임
 *
 *  IntroPage는 dangerouslySetInnerHTML로 거대한 정적 HTML을 박아 넣는데,
 *  Next.js 16 metadata streaming과의 타이밍 차이로 SSR/CSR hydration mismatch가
 *  발생함. ssr:false 로 클라이언트 전용 렌더링하여 회피.
 *  이 페이지는 SEO 대상이 아니므로 손해 없음.
 */

"use client";

import dynamic from "next/dynamic";

const IntroPage = dynamic(() => import("./IntroPage"), {
    ssr: false,
});

export default function Page() {
    return <IntroPage />;
}
