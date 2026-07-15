import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import { formatWon } from "@/lib/format";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { Badge } from "@/components/Badge";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductDetailPage(
  props: PageProps<"/products/[id]">
) {
  const { id } = await props.params;
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const isOrganic = product.tags.includes("유기농");

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← 목록으로
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <ProductImagePlaceholder
              seed={product.id}
              description={product.image}
              className="h-full w-full"
            />
            <div className="absolute left-3 top-3 flex gap-1">
              {product.isBest && <Badge variant="best">BEST</Badge>}
              {product.isNew && <Badge variant="new">NEW</Badge>}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-amber-700">
                {product.brand}
              </p>
              <h1 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <span aria-hidden className="text-amber-500">
                ★
              </span>
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-zinc-300">·</span>
              <span>
                리뷰 {product.reviewCount.toLocaleString("ko-KR")}
              </span>
              <span className="text-zinc-300">·</span>
              <span>좋아요 {product.likeCount.toLocaleString("ko-KR")}</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2 border-y border-zinc-200 py-4 dark:border-zinc-800">
              {product.discountRate > 0 && (
                <span className="text-lg font-bold text-orange-600">
                  {product.discountRate}%
                </span>
              )}
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {formatWon(product.salePrice)}
              </span>
              {product.discountRate > 0 && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatWon(product.price)}
                </span>
              )}
              <span className="w-full pt-1 text-xs text-zinc-500">
                {product.delivery}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-zinc-500">원산지</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {product.origin}
              </dd>
              <dt className="text-zinc-500">중량</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {product.weight}
              </dd>
              <dt className="text-zinc-500">분류</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {product.category}
              </dd>
            </dl>

            {isOrganic && (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <p className="font-semibold">유기농 인증 원두</p>
                <p className="mt-1 text-emerald-700 dark:text-emerald-300">
                  라오스 현지 유기농 인증 기준에 따라 재배·가공된 원료를
                  사용했습니다. 화학 비료와 농약을 사용하지 않아 건강한
                  라이프스타일을 함께 전합니다.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            <AddToCartButton productId={product.id} soldOut={product.soldOut} />
          </div>
        </div>

        <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            리뷰 ({productReviews.length})
          </h2>

          {productReviews.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              아직 등록된 리뷰가 없습니다.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {productReviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {review.author}
                    </span>
                    <span className="text-zinc-400">{review.date}</span>
                  </div>
                  <div className="mt-1 text-amber-500" aria-hidden>
                    {"★".repeat(review.rating)}
                    <span className="text-zinc-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {review.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
