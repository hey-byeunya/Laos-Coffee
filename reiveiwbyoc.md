# AIFFEL Campus Code Peer Review
- 코더 : 전대진
- 리뷰어 : AI (opencode)

---

# PRT(Peer Review Template)

## 1. 주어진 문제를 해결하는 완성된 코드가 제출되었나요?

**부분적 예**

README에 기술된 핵심 기능은 구현되어 있으나, **제대로 동작하지 않는 부분이 존재**합니다.

- **상품 목록** — 홈 페이지(`/`)에서 8개 상품이 반응형 그리드로 표시됨 ✅
- **상품 상세** — `/products/[id]`에서 상품 상세 정보 + 리뷰 표시 ✅
- **장바구니** — `/cart`에서 수량 조절, 삭제, 합계 계산 ✅
- **주문/결제** — `/checkout`에서 주문 생성 ✅
- **로그인/회원가입** — Supabase Auth 연동 ✅
- **리뷰** — Supabase DB에 실제 저장 ✅

**그러나 다음 치명적 문제들이 존재합니다:**

1. **`/orders/[id]` 페이지가 존재하지 않음** — orders 페이지(`src/app/orders/page.tsx:54`)에서 `<Link href={/orders/${order.id}}>`로 개별 주문 상세 페이지로 이동하지만, 해당 라우트가 없어 404 에러 발생. **사용자가 주문 완료 후 주문 내역을 확인할 수 없음.**

2. **주문 데이터가 localStorage에만 저장** — `src/lib/order-store.ts`에서 `createOrder()`가 localStorage에만 기록. 새로고침하면 주문 내역이 날아가고, 다른 기기에서는 접근 불가. Supabase에 주문을 저장하지 않으면 의미 없는 주문 기능.

3. **`<html lang="en">`** — `src/app/layout.tsx:29`에서 HTML 언어가 영어로 설정되어 있으나, 실제 콘텐츠는 한국어. SEO 및 스크린 리더 접근성에 영향.

---

## 2. 핵심적이거나 복잡하고 이해하기 어려운 부분에 작성된 설명을 보고 해당 코드가 잘 이해되었나요?

**부분적 예**

### 잘 작성된 부분

**1. Supabase 클라이언트** (`src/lib/supabase/client.ts`)
```ts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
```
- 간결하고 역할이 명확. singleton 패턴으로 불필요한 인스턴스 생성 방지.

**2. 장바구니 상태 관리** (`src/lib/cart-store.ts`)
- `useSyncExternalStore` + `localStorage` 패턴으로 SSR 안전성 확보
- `storage` + 커스텀 이벤트로 탭 간 동기화 지원
- `readCart/writeCart`의 캐싱 최적화가 적절

**3. SVG 일러스트 시스템** (`src/data/product-art.ts`, `src/components/ProductIllustration.tsx`)
- `ProductArt` 인터페이스로 일러스트 사양을 데이터로 분리
- 7가지 모티프 + 3가지 컨테이너 조합으로 상품별 차별화

### 문제된 부분

**1. `as string` 타입 캐스팅 문제** (`src/lib/supabase/client.ts:4-5`)
```ts
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
```
- 환경변수가 없으면 `undefined`가 `string`으로 타입 단언되어 런타임에 `createClient(undefined, undefined)` 호출 → 크래시
- 올바른 처리: 환경변수 누락 시 명확한 에러 메시지 출력 또는 빌드 타임 체크 필요

**2. `useAuth` 훅이 모든 클라이언트 컴포넌트에서 중복 호출** (`src/lib/auth-store.ts`)
- `SiteHeader`, `ReviewForm`, `LoginPage`, `SignUpPage`, `CheckoutPage`, `OrdersPage` 등에서 각각 `useAuth()` 호출
- `supabase.auth.getSession()`이 컴포넌트마다 반복 호출되므로 불필요한 네트워크 요청 발생 가능
- React Context로 루트에서 한 번만 초기화하는 것이 더 효율적

**3. 상품 데이터가 하드코딩** (`src/data/products.ts`)
- 8개 상품이 코드에 직접 하드코딩. 상품 추가/수정/삭제 시 코드 수정 필요
- DB나 API를 사용하지 않으므로 장기적으로 유지보수 비용 증가

---

## 3. 에러가 난 부분을 디버깅하여 "문제를 해결한 기록"을 남겼나요? 또는 "새로운 시도 및 추가 실험"을 해봤나요?

**부분적 예**

README에 Supabase 연결 검증 과정이 기록되어 있으나:

- **`/orders/[id]` 404 문제 해결 기록 없음** — 주문 상세 페이지를 만들지 않은 것이 명백한 빠진 구현인데, 이에 대한 디버깅이나 기록이 없음
- **localStorage 기반 주문 데이터의 한계에 대한 고민 없음** — Supabase를 리뷰에는 사용하면서 주문에는 사용하지 않은 일관성 없는 아키텍처 선택에 대한 설명 부족
- **환경변수 `as string` 캐스팅 위험성에 대한 시도 없음** — 프로덕션 배포 시 환경변수 누락 가능성에 대한 대비 없음

---

## 4. 회고를 잘 작성했나요?

**부분적 예**

README에 개발 로드맵과 보안 체크리스트가 체계적으로 기록되어 있으나:

- **아키텍처 결정에 대한 반성이 부족** — 왜 주문 데이터는 localStorage로 하고 리뷰는 Supabase로 했는지, 그 차이점과 한계에 대한 회고 없음
- **미구현 기능에 대한 성찰 없음** — `/orders/[id]` 상세 페이지가 없는 것, 검색/필터 기능이 없는 것 등에 대한 언급 없음
- **"MVP 성공 기준"이 실제 구현과 일치하지 않음** — MVP 기준으로 주문 내역 조회를 명시했으나 실제 구현이 불완전

---

## 5. 코드가 간결하고 효율적인가요?

**부분적 예**

### 좋은 점

- **컴포넌트 분리**: 7개 컴포넌트로 적절히 분리, 각 컴포넌트의 역할이 명확
- **상태 관리 분리**: Auth, Cart, Order를 각각 별도 스토어로 분리
- **TypeScript 적용**: `src/types/`에 인터페이스 정의로 타입 안전성 확보
- **Tailwind CSS v4**: utility-first 접근으로 스타일링 효율성

### 문제점

- **중복 코드**: `cart-store.ts`와 `order-store.ts`가 거의 동일한 `useSyncExternalStore` 패턴을 반복. 공통 헬퍼로 추출 가능
- **`formatWon()`이 너무 단순**: `src/lib/format.ts`에 함수 하나만 존재 — 다른 포맷 유틸이 필요해지면 파일 분리 필요
- **배송비 계산 로직의 불일치**: `pricing.ts`에서 "전 품목 무료배송이거나 합계 5만원 이상이면 무료"인데, products.ts의 `delivery` 필드와 실제 정책이 다를 수 있음
- **에러 처리 미흡**: `ReviewForm.tsx`에서 Supabase insert 실패 시 "잠시 후 다시 시도해 주세요" 메시지만 표시. 실제 에러 원인을 콘솔에만 출력하므로 사용자가 알 수 없음
- **`<html lang="en">`** — 한국어 서비스인데 언어 설정이 영어. 스크린 리더, 검색 엔진에 부정적 영향

### PEP8 대응
이 프로젝트는 TypeScript/React 프로젝트이므로 PEP8은 해당하지 않습니다.
- **ESLint**: `next/core-web-vitals` + `typescript` 규칙 적용 ✅
- **TypeScript strict mode**: `strict: true` 적용 ✅


# 참고 링크 및 코드 개선

## 개선 필요한 코드

### 1. `src/lib/supabase/client.ts` — 환경변수 검증
```ts
// 현재 (위험)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// 개선안
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}
export const supabase = createClient(url, key);
```

### 2. `src/app/layout.tsx` — 언어 설정
```tsx
// 현재
<html lang="en" ...>

// 개선
<html lang="ko" ...>
```

### 3. `/orders/[id]` 상세 페이지 미구현
orders 페이지에서 개별 주문으로 이동하는 링크가 존재하나 해당 라우트 페이지가 없음. 사용자 경험 저해.

## 종합 평가

전반적으로 **코드 구조는 깔끔하고, 컴포넌트 분리가 적절하며, Supabase 연동이 잘 되어 있습니다.** 그러나 다음 치명적 문제들이 해소되지 않은 채 프로덕션에 배포되어 있는 상태입니다:

1. **`/orders/[id]` 상세 페이지 미구현** — 404 발생
2. **주문 데이터가 localStorage에만 의존** — 데이터 유실 위험
3. **환경변수 타입 캐스팅 위험** — 런타임 크래시 가능성
4. **`<html lang="en">`** — 한국어 서비스의 SEO/접근성 저해

이전 리뷰(review.md)에서 "전반적으로 구조가 깔끔하고 보안 관행이 우수하다"고 평가했으나, 실제 코드를 냉정히 분석하면 **보안 관행이 우수하다고 보기 어려운 부분이 존재**합니다 (`as string` 캐스팅, localStorage 의존성). 이전 리뷰가 지나치게 긍정적이었다고 판단됩니다.
