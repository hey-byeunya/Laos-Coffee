import { getProductArt } from "@/data/product-art";
import { ProductIllustration } from "./ProductIllustration";

interface ProductImagePlaceholderProps {
  seed: number;
  description: string;
  className?: string;
}

/**
 * 실제 상품 사진 촬영 전까지 사용하는 일러스트 이미지.
 * 상품 설명(원산지·풍경 모티프)에 맞춰 procedural하게 그린 SVG를 보여준다.
 */
export function ProductImagePlaceholder({
  seed,
  description,
  className = "",
}: ProductImagePlaceholderProps) {
  const art = getProductArt(seed);

  return (
    <div
      className={`overflow-hidden ${className}`}
      role="img"
      aria-label={description}
    >
      <ProductIllustration art={art} gradId={`sky-${seed}`} />
    </div>
  );
}
