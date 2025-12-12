"use client";

import { useCartItems } from "@/hooks/use-cart";
import { defaultSamplesPageSize } from "@/lib/constants";
import { LoaderCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import AppPagination from "../AppPagination";
import CartItem from "./CartItem";

export default function Cart() {
  const [pageNum, setPageNum] = useState(1);
  const { data, isLoading } = useCartItems(pageNum);

  const totalPages = data
    ? Math.ceil(data.totalCount / defaultSamplesPageSize)
    : 0;

  const { samples } = data || { samples: [] };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <LoaderCircle className="animate-spin size-10" />
        <p>Updating cart</p>
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
        onPageChange={(pageNum) => setPageNum(pageNum)}
        totalPages={totalPages}
      />
    </>
  );
}
