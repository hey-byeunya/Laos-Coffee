"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  productId: number;
  soldOut: boolean;
}

export function AddToCartButton({ productId, soldOut }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(productId, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (soldOut) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
      >
        품절된 상품입니다
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">수량</span>
        <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="수량 감소"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900"
      >
        장바구니 담기
      </button>

      {justAdded && (
        <p className="text-center text-sm text-emerald-700 dark:text-emerald-400">
          장바구니에 담았습니다.
        </p>
      )}
    </div>
  );
}
