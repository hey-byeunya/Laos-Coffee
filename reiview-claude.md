# AIFFEL Campus Code Peer Review Templete
- 코더 : 전대진
- 리뷰어 : AI (2차 검토, 냉정한 관점)


# PRT(Peer Review Template)

## [ ] 1. 주어진 문제를 해결하는 완성된 코드가 제출되었나요?

**부분적으로만 예 — 핵심 화면은 모두 동작하지만, 데이터 무결성을 지켜주는 방어 로직이 곳곳에서 빠져 있습니다.**

README가 약속한 화면(상품 목록/상세, 장바구니, 로그인/회원가입, 주문/결제, 주문 내역, 리뷰)은 실제로 존재하고 라우팅도 정상입니다.

다만 다음과 같이 "동작은 하지만 잘못된 상태를 허용하는" 문제들이 있습니다.

- **재고(stock) 검증이 어디에도 없음.** `Product` 타입(`src/types/product.ts:15`)에 `stock` 필드가 있고 `src/data/products.ts`에 상품별 재고 수치까지 채워져 있지만, 이 값을 실제로 참조해서 수량을 제한하는 코드가 전혀 없습니다. `AddToCartButton`의 props는 `{ productId, soldOut }`뿐이고(`src/components/AddToCartButton.tsx:6-9`) `stock`은 아예 전달되지 않으며, 수량 증가 버튼은 상한 없이 계속 증가합니다. `cart-store.ts`의 `addItem`/`updateQuantity`도 재고와 무관하게 수량을 그대로 저장합니다. 결과적으로 재고 86개짜리 상품을 9999개 담아 결제까지 진행할 수 있습니다.
- **품절 상품도 장바구니/결제까지 통과됩니다.** `buildCartRows`(`src/lib/pricing.ts:13-22`)는 `Boolean(row.product)`만 확인할 뿐 `product.soldOut`이나 `stock === 0`을 필터링하지 않습니다. UI상 `AddToCartButton`은 `soldOut`일 때 버튼을 비활성화하지만, 이는 화면단 가드일 뿐이라 `localStorage`의 장바구니 데이터를 직접 조작하면 품절 상품도 그대로 결제까지 진행됩니다.
- **주문 폼 검증이 허술합니다.** `src/app/checkout/page.tsx:70`의 전화번호 정규식 `/^[0-9-]{9,}$/`는 숫자를 하나도 포함하지 않은 `"---------"` 같은 문자열도 통과시킵니다. 실질적으로 숫자 자릿수를 검증하지 못하는 정규식입니다.
- **중복 주문 방지 로직이 없습니다.** 로그인/회원가입 폼은 `disabled={submitting}`으로 중복 제출을 막지만, 체크아웃 폼에는 `submitting` 상태 자체가 없어 버튼을 연타하면 동일 주문이 중복 생성될 수 있습니다.
- **받는 분 이름 입력 UX 버그.** `recipientName` state는 빈 문자열로 시작하는데 입력창 placeholder는 `user.name`으로 채워져 있습니다. 사용자가 "이미 이름이 채워져 있네" 하고 그냥 제출하면 실제 값은 빈 문자열이라 검증에 걸려 혼란스러운 에러를 만납니다.

---

## [ ] 2. 핵심적이거나 복잡하고 이해하기 어려운 부분에 작성된 설명을 보고 해당 코드가 잘 이해되었나요?

**부분적으로만 예 — 주석은 있으나 위험한 패턴을 정당화하는 근거로 쓰이지 않고, 정작 설명이 필요한 트레이드오프는 비어 있습니다.**

- `src/lib/supabase/client.ts`의 `process.env.NEXT_PUBLIC_SUPABASE_URL as string` 캐스팅은 환경변수가 비어 있을 때 `undefined`를 `string`으로 강제로 속이는 코드입니다. 왜 이렇게 처리해도 괜찮은지에 대한 주석이나 방어 코드(값이 없으면 명시적으로 에러를 던지기)가 전혀 없습니다. 배포 환경변수 설정을 빠뜨리면 앱 전체가 알아보기 힘든 에러로 죽습니다.
- `src/lib/pricing.ts`의 배송비 상수(`FLAT_SHIPPING_FEE`, `FREE_SHIPPING_THRESHOLD`)는 `src/data/products.ts`의 상품 배송비 문구와 우연히 숫자가 일치할 뿐, 두 값이 같은 소스에서 파생된 게 아니라는 점은 언급되지 않습니다. 상품 데이터의 배송비 문구를 바꿔도 실제 계산 로직은 따라가지 않는 구조라는 걸 아는 사람이 없으면 나중에 조용히 어긋납니다.
- `src/lib/auth-store.ts`는 파일명이 `*-store.ts`로 `cart-store.ts`, `order-store.ts`와 같은 패턴처럼 보이지만, 실제로는 완전히 다른 구조입니다. `cart-store`/`order-store`는 모듈 스코프의 캐시를 `useSyncExternalStore`로 공유하는 반면, `auth-store.ts`의 `useAuth`는 컴포넌트마다 독립적인 `useState` + `useEffect`로 매번 `supabase.auth.getSession()`을 호출하고 `onAuthStateChange` 구독을 새로 생성합니다. `SiteHeader`, `CheckoutPage`, `OrdersPage`, `ReviewForm`, `LoginPage`, `SignUpPage`가 각각 `useAuth()`를 호출하므로 한 페이지에서 최소 2개 이상의 중복 세션 조회/구독이 발생합니다. 이름만 같은 "store" 패턴이지 실제 동작 방식은 다르다는 걸 아무 주석도 설명하지 않습니다.

---

## [ ] 3. 에러가 난 부분을 디버깅하여 "문제를 해결한 기록"을 남겼나요? 또는 "새로운 시도 및 추가 실험"을 해봤나요?

**부분적으로만 예 — README에 curl 검증 기록은 실재하고 신뢰할 만하지만, 정작 코드에 남아있는 에러 처리 자체는 미흡합니다.**

README의 `curl` 검증(리뷰 저장 확인)과 RLS 401 테스트 기록은 실제 스키마(`docs/dev-journey/supabase-reviews-schema.sql`)와 대조했을 때 사실과 부합합니다. 이 부분은 실제로 검증 후 기록한 흔적이 보입니다.

그러나 코드 자체에 남은 에러 처리는 "기록"이 아니라 "회피"에 가깝습니다.

- `src/lib/supabase/reviews.ts:20-24`: `fetchReviews`가 실패하면 `console.error`만 찍고 빈 배열을 반환합니다(직접 확인 완료). 상품 상세 페이지는 이 빈 배열을 "아직 등록된 리뷰가 없습니다"로 그대로 렌더링합니다. 즉 Supabase 연결 장애와 "진짜로 리뷰가 0개인 상태"를 화면상 전혀 구분할 수 없습니다. 리뷰 기능이 이 프로젝트의 유일한 실제 백엔드 기능이라는 점을 감안하면, 이 실패 경로가 조용히 삼켜지는 건 가볍게 넘길 문제가 아닙니다.
- `src/components/ReviewForm.tsx`: insert 실패 시 항상 동일한 안내 메시지만 보여주고, 실제 에러는 로깅되지 않습니다. RLS 위반인지, 네트워크 문제인지, DB 제약조건 위반인지 사용자도 개발자도 구분할 방법이 없습니다.
- `src/lib/auth-store.ts`: `supabase.auth.getSession().then(...)`에 `.catch`가 없습니다. 세션 조회 자체가 실패하면 처리되지 않은 프라미스 거부(unhandled promise rejection)가 발생합니다.
- `src/lib/cart-store.ts`, `src/lib/order-store.ts`: `JSON.parse`만 `try/catch`로 감싸져 있고, `window.localStorage.getItem` 호출 자체는 감싸지 않았습니다. 사파리 프라이빗 모드 등 스토리지 접근이 예외를 던지는 환경에서는 `useSyncExternalStore`의 `getSnapshot`이 렌더링 중 그대로 throw하며, 에러 바운더리도 없어 앱 전체가 죽을 수 있습니다.

---

## [ ] 4. 회고를 잘 작성했나요?

**부분적으로만 예 — 형식은 체계적이지만, 회고 내용이 실제 코드의 한계와 어긋나는 지점이 있습니다.**

README의 로드맵/보안 체크리스트 자체는 성실하게 작성되어 있고, 특히 "장바구니·주문의 가격/수량은 백엔드 검증이 없습니다"라고 스스로 밝힌 점은 정직합니다. 다만:

- README의 "핵심 화면 (MVP)" 표와 "MVP 성공 기준" 절은 상품 목록/상세/장바구니까지만 언급하고, 이미 구현된 로그인/회원가입/체크아웃/주문내역/리뷰 화면은 반영되어 있지 않습니다. 이 절이 초기 Phase 1 시점 그대로 갱신되지 않은 채 남아 있어, "과제에 대한 답" 절의 최신 내용과 문서 내에서 서로 어긋납니다.
- "AI 개발 원칙"에 "테스트 및 배포" 단계가 명시되어 있지만, 리포지토리 전체를 검색해도 테스트 파일이 단 하나도 없습니다(`*.test.*`, `*.spec.*` 매칭 0건). "테스트"가 실제로는 README에 적힌 수동 `curl` 검증 한 건이 전부이며, 이 점에 대한 회고(자동화 테스트가 없다는 한계 인지)는 없습니다.
- 재고 미검증, 체크아웃 중복 제출 미방지, `<html lang="en">` 같은 실제로 존재하는 한계에 대해서는 회고에서 전혀 언급되지 않습니다. "잘한 점" 위주로 채워져 있고 "아쉬운 점"에 해당할 구체적 항목이 부족합니다.

---

## [ ] 5. 코드가 간결하고 효율적인가요?

**부분적으로만 예 — 컴포넌트 분리와 타입 적용은 실제로 양호하지만, 구조적 중복과 사소한 버그가 함께 존재합니다.**

### 확인한 좋은 점
- `any` 타입, `dangerouslySetInnerHTML`, `eslint-disable` 사용이 코드베이스 전체에서 0건입니다(grep으로 직접 확인). 시크릿 하드코딩도 0건이고 `.env*`는 git 이력에 커밋된 적이 없습니다 — README의 보안 관련 주장은 이 부분에 한해 사실입니다.
- 컴포넌트 7개, `types/` 인터페이스 4개 — README/구조 요약과 실제 파일 수가 일치합니다.

### 실제 문제점
- **`cart-store.ts`와 `order-store.ts`의 중복이 "개선하면 좋음" 수준을 넘습니다.** `readX`/`writeX`/`subscribe`/`getServerSnapshot` 구조가 거의 통째로 복제되어 있습니다. 제네릭 `createLocalStore<T>(key, eventName)` 헬퍼 하나로 20줄 이상을 줄일 수 있는데, 두 파일이 완전히 별개로 유지보수되고 있습니다.
- **`src/lib/pricing.ts`의 배송비 상수가 상품 데이터와 우연히만 일치**(2번 항목 참조)하는 취약한 결합입니다.
- **`docs/dev-journey/supabase-reviews-schema.sql`의 INSERT 정책은 `user_id`만 검증하고 `author_name`은 검증하지 않습니다.** 로그인한 사용자가 앱 UI를 거치지 않고 Supabase REST API를 직접 호출하면, 자신의 `user_id`로 다른 사람 이름을 사칭한 `author_name`을 자유롭게 넣을 수 있습니다. README는 "RLS 적용 ✅"라고만 요약했지만, 이 세부적인 스푸핑 가능성은 언급되지 않았습니다.
- **`src/app/layout.tsx:29`의 `<html lang="en">`(직접 확인 완료).** 전체 콘텐츠가 한국어인 서비스인데 언어 속성은 영어입니다. README는 Next.js를 선택한 이유로 SEO 노출(라오스 커피, 유기농 커피 등 키워드 검색 대응)을 들고 있는데, `lang` 속성이 실제 콘텐츠 언어와 다르면 검색엔진/스크린리더 최적화에 오히려 불리하게 작용할 수 있어 이 주장과 코드가 어긋납니다.

### PEP8 대응
Python 프로젝트가 아니므로 PEP8은 해당하지 않습니다. 대신 확인한 사항:
- ESLint: `eslint.config.mjs`가 `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`를 적용 — 설정 자체는 맞으나, `node_modules`가 설치되어 있지 않아 이번 리뷰에서 `npm run lint`/`tsc --noEmit`을 직접 실행해 통과 여부를 확인하지는 못했습니다(설정 파일 존재만 확인, 실행 결과는 미검증).
- `tsconfig.json`: `strict: true` 확인됨.

---

# 참고 링크 및 코드 개선

## 참고 링크
- 배포 사이트: https://laos-coffee.vercel.app
- Supabase 스키마: `docs/dev-journey/supabase-reviews-schema.sql`
- 1차 리뷰: `review.md`

## 코드 개선 제안

**1. 환경변수 검증** (`src/lib/supabase/client.ts`)
```ts
// as string 캐스팅 대신 명시적 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**2. 언어 속성 수정** (`src/app/layout.tsx:29`)
```tsx
<html lang="ko" ... >
```

**3. 재고 상한 반영** (`src/components/AddToCartButton.tsx`, `src/lib/cart-store.ts`)
`stock`을 `AddToCartButton` props로 전달하고, `addItem`/`updateQuantity`에서 `Math.min(quantity, product.stock)`으로 상한을 걸어야 합니다. `buildCartRows`(`src/lib/pricing.ts`)에서도 `product.soldOut`인 항목은 필터링하거나 경고를 표시해야 합니다.

**4. 체크아웃 중복 제출 방지** (`src/app/checkout/page.tsx`)
로그인/회원가입 폼처럼 `submitting` state를 추가해 제출 버튼을 `disabled`로 잠가야 합니다.

**5. 전화번호 검증 정규식 수정** (`src/app/checkout/page.tsx:70`)
```ts
if (!/^\d{2,3}-?\d{3,4}-?\d{4}$/.test(phone.trim())) { ... }
```
숫자가 최소 한 번 이상 나오도록 강제해야 대시(`-`)만 있는 값을 걸러낼 수 있습니다.

**6. 리뷰 인서트 정책에 `author_name` 검증 추가** (`docs/dev-journey/supabase-reviews-schema.sql`)
`author_name`을 클라이언트가 임의로 지정하지 못하도록, 트리거나 `check` 제약으로 `auth.jwt()`의 메타데이터와 대조하거나, 애초에 `author_name` 컬럼을 클라이언트 insert에서 제외하고 서버 측(뷰/함수)에서 채우는 방식이 더 안전합니다.

## 종합 평가

전반적으로 이 프로젝트는 **화면 구성과 컴포넌트 분리, 타입 적용은 실제로 준수한 수준**이며, 리뷰 기능에 한해 Supabase 연동과 RLS 정책이 README에 기술된 대로 동작하는 것도 직접 스키마와 코드를 대조해 확인했습니다. 그러나 냉정하게 보면 다음 세 가지가 가장 심각합니다.

1. **재고·품절 상태가 실제로는 아무 데도 강제되지 않습니다.** `stock` 필드는 존재하지만 어떤 컴포넌트도 참조하지 않고, `buildCartRows`는 품절 상품도 그대로 통과시킵니다. "장바구니 담기" 기능이 데이터 모델과 무관하게 동작하는 셈입니다.
2. **에러가 조용히 삼켜집니다.** 리뷰 조회 실패는 "리뷰 없음"으로 위장되고(`src/lib/supabase/reviews.ts:20-24`), 리뷰 등록 실패는 원인 불문 동일 메시지만 뜨고, 세션 조회는 `.catch` 없이 방치돼 있습니다(`src/lib/auth-store.ts`). 이 프로젝트의 유일한 실제 백엔드 기능(리뷰)에서 에러 처리가 가장 허술한 것은 아이러니합니다.
3. **`<html lang="en">`, 체크아웃 중복 제출 미방지, 전화번호 정규식 허점** 등은 하나하나는 작지만, 모두 "실제로 코드를 돌려보고 극단적인 입력을 넣어봤다면" 바로 드러날 문제들입니다.

**1차 리뷰(`review.md`)는 이런 지점들을 대부분 놓치고 모든 항목에 ✅를 준 점에서 과도하게 관대했습니다.** 특히 5번 항목("코드가 간결하고 효율적인가요?")에서 "전반적으로 우수"라고 결론짓고 `cart-store`/`order-store` 중복만 사소하게 짚었는데, 실제로는 `auth-store`가 같은 이름의 패턴을 전혀 다르게(그리고 비효율적으로) 구현하고 있다는 점, RLS의 `author_name` 스푸핑 가능성, 재고 미검증 같은 더 구조적인 문제는 언급조차 되지 않았습니다. 또한 1차 리뷰의 3번 항목("에러 디버깅 기록")은 README의 `curl` 검증 기록만 보고 ✅를 줬는데, 그 기록이 사실인 것과 별개로 코드 자체의 에러 처리 품질은 별개 사안이며 이 둘을 구분하지 않은 것도 아쉬운 지점입니다.
