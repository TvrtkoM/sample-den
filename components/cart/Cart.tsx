"use client";

import { useCartItems } from "@/hooks/use-cart";
import { defaultSamplesPageSize } from "@/lib/constants";
import { LoaderCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import AppPagination from "../AppPagination";
import CartItem from "./CartItem";

export default function Cart() {
  const [pageNum, setPageNum] = useState(1);
  const {
    query: { data, isLoading, isFetching },
    totalCount
  } = useCartItems(pageNum);

  const totalPages = Math.ceil(totalCount / defaultSamplesPageSize);

  const { samples } = data || { samples: [] };

  // Show loading when we're fetching a different page than what's currently displayed
  const isChangingPage = isFetching && data?.pageNumber !== pageNum;

  if (isLoading || isChangingPage) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <LoaderCircle className="animate-spin size-10" />
      </div>
    );
  }

  if (samples.length === 0 && totalPages === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
        <ShoppingCart className="size-12" />
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col">
        {samples.map((sample) => (
          <CartItem key={sample._id} sample={sample} />
        ))}
      </ul>
      <AppPagination
        pageNum={pageNum}
        onPageChange={setPageNum}
        totalPages={totalPages}
      />
    </>
  );
}
