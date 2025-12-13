"use client";

import { useCartItems } from "@/hooks/use-cart";
import { defaultSamplesPageSize } from "@/lib/constants";
import { LoaderCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import AppPagination from "../AppPagination";
import CartItem from "./CartItem";

export default function Cart() {
  const [pageNum, setPageNum] = useState(1);
  const [prevPageNum, setPrevPageNum] = useState(pageNum);
  const {
    query: { data, isLoading, isFetching },
    totalCount
  } = useCartItems(pageNum);

  const totalPages = Math.ceil(totalCount / defaultSamplesPageSize);

  const { samples } = data || { samples: [] };

  if (samples.length === 0 && pageNum > 1) {
    setPageNum(pageNum - 1);
  }

  // Show loading when we're fetching a different page than what's currently displayed
  const isChangingPage = isFetching && prevPageNum !== pageNum;

  if (isFetching === false && prevPageNum !== pageNum) {
    setPrevPageNum(pageNum);
  }

  if (isLoading || isChangingPage) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-muted-foreground">
        <LoaderCircle className="animate-spin size-20" />
      </div>
    );
  }

  if (samples.length === 0 && totalPages === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-center text-muted-foreground">
        <ShoppingCart className="size-12" />
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="flex flex-col gap-5 my-8">
        {samples.map((sample) => (
          <CartItem key={sample._id} sample={sample} />
        ))}
      </ul>
      {totalPages > 1 && (
        <AppPagination
          pageNum={pageNum}
          onPageChange={(nextPage) => {
            setPrevPageNum(pageNum);
            setPageNum(nextPage);
          }}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
