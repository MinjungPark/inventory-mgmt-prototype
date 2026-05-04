/**
 * @file src/app/(prototype)/intro/IntroPage.tsx
 * @description 화면 1 — 프로토타입 소개 (Intro)
 *              시스템 도입 의의 · As-Is/To-Be · 9화면 매핑 · 아키텍처 다이어그램
 *
 * Phase 1 단계: 골격 placeholder. Phase 2/3에서 ENERTORK 패턴 미러링하여 실제 콘텐츠 채움.
 * 화면 전용 sub-component 는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function IntroPage() {
    return (
        <PlaceholderScreen
            title="프로토타입 소개"
            subtitle="시스템 도입 의의·As-Is/To-Be·아키텍처 다이어그램"
        />
    );
}
