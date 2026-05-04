# Inventory Operations Management — Prototype

플래그십 매장 운영을 위한 통합 재고 관리 시스템 프로토타입입니다.
매장 섹션·창고 구역 단위의 다품목 재고를 통합 관리합니다.

## Stack

- Next.js 15.5.3 (App Router · Turbopack)
- React 19.1.0 / TypeScript 5
- Tailwind CSS v4
- Recharts 3.6.0
- lucide-react / framer-motion

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project Structure

```
src/
  app/
    (prototype)/            # 사이드바 + 헤더 공용 레이아웃
      intro/                # 화면 1 — 프로토타입 소개
      dashboard/            # 화면 2 — 통합 대시보드
      store-inventory/      # 화면 3 — 매장 재고
      warehouse-inventory/  # 화면 4 — 창고 재고
      tracking/             # 화면 5 — 입출고 트래킹
      api-sync/             # 화면 6 — 데이터 자동 동기화
      alerts/               # 화면 7 — 재고 알림
      admin/threshold/      # 화면 8 — 재고 알림 설정 (관리자)
      guide/                # 화면 9 — 시스템 가이드
    layout.tsx              # Root layout
    page.tsx                # / → /intro 리다이렉트
    globals.css             # 라이트 톤 디자인 토큰
  components/
    common/                 # 공통 컴포넌트
  data/
    seed/                   # 시드 데이터 (매장·창고·SKU·트래킹·알림)
  types/
    inventory.ts            # 도메인 타입
```

## Design Tokens

라이트 톤 Calm Enterprise 팔레트 — 클라이언트 친화 단어 사용, 6px 라운드, 데이터 11px / 타이틀 12~18px, Primary `#0d47a1`.
