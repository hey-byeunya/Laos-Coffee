import Link from "next/link";
import { Product } from "@/types/product";
import { formatWon } from "@/lib/format";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { Badge } from "./Badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    brand,
    name,
    price,
    salePrice,
    discountRate,
    rating,
    reviewCount,
    delivery,
    isNew,
    isBest,
    image,
    soldOut,
  } = product;

  return (
    <Link
      href={`/products/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <ProductImagePlaceholder
          seed={id}
          description={image}
          className="h-full w-full"
        />
        <div className="absolute left-2 top-2 flex gap-1">
          {isBest && <Badge variant="best">BEST</Badge>}
          {isNew && <Badge variant="new">NEW</Badge>}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-zinc-900">
              품절
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-zinc-500">{brand}</p>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <span aria-hidden className="text-amber-500">
            ★
          </span>
          <span>{rating.toFixed(1)}</span>
          <span className="text-zinc-300">·</span>
          <span>리뷰 {reviewCount.toLocaleString("ko-KR")}</span>
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          {discountRate > 0 && (
            <span className="text-sm font-bold text-orange-600">
              {discountRate}%
            </span>
          )}
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {formatWon(salePrice)}
          </span>
          {discountRate > 0 && (
            <span className="text-xs text-zinc-400 line-through">
              {formatWon(price)}
            </span>
          )}
        </div>

        <p className="mt-auto pt-2 text-xs text-zinc-500">{delivery}</p>
      </div>
    </Link>
  );
}
