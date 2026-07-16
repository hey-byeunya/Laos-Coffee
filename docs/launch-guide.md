# 쇼핑몰 오픈 가이드 — 기획부터 실제 배포까지

이 문서는 **Lao Aroma**를 실제로 열기까지 진행한 과정을 순서대로, 그대로 따라 할 수 있는 수준으로 정리한 실행 가이드입니다. Next.js 프론트엔드 + Supabase 백엔드 한 겹 + Vercel 배포 조합으로, 코드를 조금이라도 다룰 줄 아는 사람이라면 이 문서만 보고 비슷한 구조의 쇼핑몰을 처음부터 열 수 있도록 썼습니다.

## 준비물

- Node.js 18 이상, npm
- Git, GitHub 계정
- Vercel 계정 (GitHub 계정으로 바로 가입 가능)
- Supabase 계정 (GitHub 계정으로 바로 가입 가능)

---

## 1단계. 기획 문서(PRD) 준비

무엇을 만들지, 누구에게 팔지, 어떤 화면이 필요한지를 먼저 문서로 정리합니다. 화면을 설계하기 전에 이 문서부터 만들어야, 나중에 갈아엎는 일이 줄어듭니다.

- 참고: [`docs/PRD v1.0 - 라오스 유기농 커피 여행 쇼핑몰.docx`](./PRD%20v1.0%20-%20라오스%20유기농%20커피%20여행%20쇼핑몰.docx)
- PRD에는 최소한 다음이 들어가야 합니다: 서비스 한 줄 정의, 타깃 사용자, 핵심 화면 목록과 각 화면에 표시할 정보, 기술 스택과 선택 이유, 목업 데이터 구조, 개발 로드맵(Phase 구분)

## 2단계. GitHub 저장소 생성 및 로컬 클론

GitHub에서 빈 저장소를 만든 뒤 로컬로 가져옵니다.

```bash
git clone https://github.com/<내계정>/<저장소이름>.git
cd <저장소이름>
```

## 3단계. Next.js 프로젝트 생성

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

> **주의**: npm 패키지 이름은 대문자를 쓸 수 없습니다. 저장소 폴더 이름에 대문자가 있다면(`Laos-Coffee`처럼), `.`(현재 폴더) 대신 소문자 임시 폴더 이름으로 먼저 만든 뒤 생성된 파일들을 저장소 폴더로 옮기고, `package.json`의 `name` 필드도 소문자로 고쳐주세요.

생성 후 `npm run dev`로 `http://localhost:3000`에서 기본 페이지가 뜨는지 확인합니다.

## 4단계. 목업 데이터 설계

백엔드 없이 화면부터 만들기 위해, 실제 데이터와 동일한 구조의 가짜 데이터를 먼저 만듭니다.

- 타입 정의: [`src/types/product.ts`](../src/types/product.ts)
- 목업 데이터(최소 6개 이상): [`src/data/products.ts`](../src/data/products.ts)

```ts
// 예시 구조
{
  id: 1,
  brand: "Lao Aroma",
  name: "루앙프라방 유기농 아라비카 원두 500g",
  price: 18500,
  salePrice: 16800,
  discountRate: 9,
  rating: 4.9,
  reviewCount: 238,
  soldOut: false,
  // ...
}
```

## 5단계. 상품 목록 페이지

목업 데이터를 카드 그리드로 렌더링합니다. 이미지·이름·가격/할인율·평점·배송정보·BEST/NEW·품절 표시까지 한 화면에 보이게 구성합니다.

- 카드 컴포넌트: [`src/components/ProductCard.tsx`](../src/components/ProductCard.tsx)
- 배지: [`src/components/Badge.tsx`](../src/components/Badge.tsx)
- 목록 페이지: [`src/app/page.tsx`](../src/app/page.tsx)

## 6단계. 상품 상세 페이지 + 장바구니 상태 도입

`/products/[id]` 동적 라우트로 상세 화면을 만듭니다. 이때 "장바구니 담기" 버튼이 필요해지므로, 브라우저에 상태를 저장하는 공용 스토어를 함께 만듭니다.

- 상세 페이지: [`src/app/products/[id]/page.tsx`](../src/app/products/%5Bid%5D/page.tsx)
- 장바구니 상태(localStorage + `useSyncExternalStore`): [`src/lib/cart-store.ts`](../src/lib/cart-store.ts)

> **함정 주의**: `useSyncExternalStore`의 `getServerSnapshot`은 매번 같은 참조(reference)를 반환해야 합니다. `() => []`처럼 매번 새 배열을 만들면 "getServerSnapshot should be cached" 경고와 함께 문제가 생깁니다. 모듈 최상단에 `const EMPTY = []`로 만들어두고 그걸 반환하세요.

## 7단계. 장바구니 페이지

담긴 상품의 수량 변경/삭제, 배송비 계산, 총 결제금액을 보여줍니다.

- [`src/app/cart/page.tsx`](../src/app/cart/page.tsx)
- 배송비처럼 여러 화면에서 반복되는 계산 로직은 [`src/lib/pricing.ts`](../src/lib/pricing.ts)로 뽑아 공용으로 씁니다.

## 8단계. 반응형 점검

모바일(375px)·태블릿(768px)·PC(1280px) 각 너비에서 실제로 확인합니다.

- 가로 스크롤(overflow)이 생기지 않는지
- 버튼 등 탭 영역이 최소 44×44px 정도는 되는지 (부족하면 padding을 늘리세요)
- 음수 마진(`-m-2` 등)으로 탭 영역을 넓힐 때는 방향에 주의 — 컨테이너 경계를 넘어가는 쪽(보통 가로)은 피하고 세로(`-my-*`)만 쓰는 게 안전합니다.

## 9단계. Git 커밋 & GitHub push

```bash
git add <파일들>
git commit -m "커밋 메시지"
git push
```

화면 하나가 완성될 때마다 커밋하는 습관을 들이면, 나중에 문제가 생겨도 되돌아갈 지점이 생깁니다.

## 10단계. Vercel 배포

```bash
npx vercel login          # 브라우저에서 로그인/승인
npx vercel link --yes --project <프로젝트이름>   # 프로젝트 이름도 소문자만 가능
npx vercel deploy --prod --yes
```

명령이 끝나면 `https://<프로젝트이름>.vercel.app` 주소로 실제 접속이 가능합니다.

## 11단계. Vercel ↔ GitHub 자동 배포 연동

CLI로 배포한 것과 별개로, GitHub 저장소를 연결해두면 이후 `git push`만으로 자동 재배포됩니다.

1. Vercel 대시보드 → 프로젝트 → **Settings → Git**
2. **Connect Git Repository** → GitHub 계정에 대해 **Install**(GitHub App 설치, 저장소 선택) — *이 승인 과정은 본인이 GitHub 로그인 상태에서 직접 눌러야 합니다*
3. 연결할 저장소 옆의 **Connect** 클릭

이후로는 `git push`만 하면 몇 초~수십 초 안에 자동으로 새 배포가 시작됩니다.

## 12단계. 회원가입/로그인 화면 (우선 가짜 인증으로)

백엔드를 아직 안 붙인 단계에서는, 화면부터 빠르게 완성하기 위해 localStorage에 계정 정보를 저장하는 가짜 인증으로 시작하는 것도 좋은 방법입니다. UI가 완성되면 나중에 진짜 백엔드로 데이터만 교체하면 되기 때문입니다.

- [`src/app/signup/page.tsx`](../src/app/signup/page.tsx), [`src/app/login/page.tsx`](../src/app/login/page.tsx)
- 인증 상태 관리: [`src/lib/auth-store.ts`](../src/lib/auth-store.ts) (지금은 14단계에서 실제 Supabase Auth로 교체된 버전입니다)

## 13단계. 주문/결제(체크아웃) 화면

배송지·연락처 입력, 결제수단 선택 UI를 만들고, 주문을 로컬에 저장한 뒤 장바구니를 비웁니다. 실제 결제 연동 전까지는 이 정도로 충분합니다.

- [`src/app/checkout/page.tsx`](../src/app/checkout/page.tsx)
- 주문 저장/조회: [`src/lib/order-store.ts`](../src/lib/order-store.ts)
- 주문 완료/내역 화면: [`src/app/orders/[id]/page.tsx`](../src/app/orders/%5Bid%5D/page.tsx), [`src/app/orders/page.tsx`](../src/app/orders/page.tsx)

## 14단계. 실제 백엔드 붙이기 (Supabase)

화면의 기능 중 "실제로 서버에 저장되어야 하는 기능 하나"를 골라(우리는 **리뷰**) 진짜 백엔드를 연결합니다.

1. [supabase.com](https://supabase.com) 접속 → GitHub 계정으로 로그인 → **New Project**
2. 프로젝트가 만들어지면 **Project Settings → API**에서 **Project URL**과 **Publishable(anon) key** 확보
3. **Authentication → Sign In / Providers → Email**에서 **Confirm email**을 꺼둡니다 (꺼두지 않으면 가입 후 이메일 인증 전까지 로그인이 안 됩니다 — 실습·데모 단계에서는 꺼두는 게 편합니다)
4. **SQL Editor**에서 테이블 생성 + RLS 정책 + (있다면) 시드 데이터를 실행: [`docs/dev-journey/supabase-reviews-schema.sql`](./dev-journey/supabase-reviews-schema.sql)
5. 프로젝트에 `@supabase/supabase-js` 설치:
   ```bash
   npm install @supabase/supabase-js
   ```
6. `.env.local`에 URL/키를 환경변수로 등록 (코드에 직접 적지 않기):
   ```
   NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_xxxx"
   ```
7. 클라이언트 초기화: [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts)
8. 기존 가짜 인증(`auth-store.ts`)을 `supabase.auth.signUp` / `signInWithPassword` / `onAuthStateChange` 호출로 교체
9. 리뷰 조회/작성 코드 연결: [`src/lib/supabase/reviews.ts`](../src/lib/supabase/reviews.ts), [`src/components/ReviewForm.tsx`](../src/components/ReviewForm.tsx)
10. 같은 환경변수를 **Vercel 프로젝트 환경변수**에도 등록 (CLI: `vercel env add <이름> production,preview,development --value "<값>" --no-sensitive --yes`, 또는 대시보드 Settings → Environment Variables)

## 15단계. 보안 체크

배포 전에 아래 다섯 가지를 반드시 확인합니다. 자세한 검증 방법과 결과는 [`README.md`의 "3. 제출 전 보안 체크"](../README.md) 참고.

- 비밀값을 코드에 직접 안 적고 환경변수로 뺐는가
- 가격·수량·권한 같은 검증을 백엔드(DB 제약, RLS)에서 하는가
- (Supabase라면) RLS를 켜고 정책을 넣었는가 — 끄면 공개 키로 누구나 데이터를 읽고 고치고 지울 수 있습니다
- 로그인이 필요한 데이터에 권한 확인(인가)이 들어가는가
- 무료 티어의 한도(용량·요청수·비활성 시 정지 등)를 알고 있는가

## 16단계. 상품 이미지 채우기

실제 상품 사진이 없다면, 상품 설명(원산지·풍경)에 맞춰 procedural하게 그린 SVG 일러스트로 대체할 수 있습니다. 사진 촬영/구매 전까지 화면이 비어 보이지 않게 하는 용도입니다.

- [`src/components/ProductIllustration.tsx`](../src/components/ProductIllustration.tsx), [`src/data/product-art.ts`](../src/data/product-art.ts)

## 17단계. 문서 정리

작업하면서 README와 개발 기록을 계속 업데이트합니다.

- [`README.md`](../README.md) — 쇼핑몰 바로가기, 프로젝트 개요, 실행/배포 방법, 기술 스택, 로드맵
- [`docs/dev-journey/`](./dev-journey) — 비개발자도 이해할 수 있는 개발 과정 설명 (md/html/docx)

---

## 다음 단계 (예정)

아직 진행하지 않은, 앞으로 할 일입니다.

### Phase 4 나머지 — 찜하기, 최근 본 상품
지금은 리뷰까지만 완료된 상태입니다. **찜하기**는 사용자가 관심 상품을 표시해두는 기능으로, 로그인한 사용자와 연결되어야 하므로 리뷰와 마찬가지로 Supabase에 `wishlists` 테이블(사용자 id + 상품 id)을 추가하는 방식이 될 예정입니다. **최근 본 상품**은 로그인 여부와 무관하게 빠르게 보여주는 게 중요해서, 서버 없이 브라우저 localStorage(지금의 cart-store와 같은 패턴)로 구현하는 편이 더 알맞습니다.

### Phase 5 — 관리자 페이지
상품 등록/수정/삭제, 주문 상태 변경(배송중/완료 등)을 관리자만 볼 수 있는 화면입니다. 지금의 "로그인한 사용자"와 "관리자"를 구분해야 하므로, Supabase의 사용자 메타데이터나 별도 `role` 컬럼으로 권한을 나누고, RLS 정책도 "관리자만 쓰기 가능"하도록 새로 짜야 합니다. 상품 데이터도 이 시점부터는 목업 배열이 아니라 Supabase 테이블로 옮기게 됩니다.

### Phase 6 — AI 상품 추천, 여행 스토리 콘텐츠
사용자의 조회/구매 이력을 바탕으로 상품을 추천하거나, 여행지와 커피를 연결하는 콘텐츠(예: "루앙프라방을 다녀왔다면 이 원두")를 제공하는 단계입니다. 추천 로직 자체는 별도 서버 함수(Supabase Edge Functions 등)로 구현하거나, 외부 LLM API를 호출하는 방식이 될 수 있습니다. 이 단계부터는 API 키 같은 진짜 비밀값이 늘어나므로, 15단계의 보안 체크를 다시 한번 거치는 게 중요합니다.
