/**
 * @file src/app/(prototype)/guide/GuidePage.tsx
 * @description 화면 9 — 시스템 가이드
 *              ENERTORK 시스템 가이드 페이지 패턴 — 좌측 목차 + 우측 본문
 *              섹션: 시작하기 / 핵심 기능 / 비교·근거 / 디자인
 *
 * Phase 1 단계: 골격 placeholder. Phase 3에서 ENERTORK 패턴 미러링.
 * 화면 전용 sub-component (GuideTOC, GuideSection, ComparisonTable 등)는 ./components/ 하위에 추가.
 */

import PlaceholderScreen from "@/components/common/PlaceholderScreen";

export default function GuidePage() {
    return (
        <PlaceholderScreen
            title="시스템 가이드"
            subtitle="시작하기 · 핵심 기능 · 비교/근거 · 디자인 (좌측 목차 + 우측 본문)"
        />
    );
}
