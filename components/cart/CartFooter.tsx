"use client";

import { useCartTotalPrice } from "@/hooks/use-cart";
import { Suspense, useState } from "react";
import AppPagination from "../AppPagination";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const CheckoutButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkout = async () => {
    setIsSubmitting(true);
    const res = await fetch("/api/payment/checkout-sessions", {
      method: "POST"
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <Button
      size={"lg"}
      className="text-xl"
      onClick={() => checkout()}
      disabled={isSubmitting}
    >
      Checkout
    </Button>
  );
};

const CartTotalPrice = () => {
  const { data: totalPrice } = useCartTotalPrice();

  return (
    <p className="text-xl h-7 text-center">
      <span className="font-bold">Total:</span> {totalPrice} $
    </p>
  );
};

type CartFooterProps = {
  pageNum: number;
  setPageNum: (pageNum: number) => void;
  totalPages: number;
};

const CartFooter = ({ pageNum, setPageNum, totalPages }: CartFooterProps) => {
  return (
    <div className="flex flex-col">
      {totalPages > 1 && (
        <div className="border-t py-4">
          <AppPagination
            pageNum={pageNum}
            onPageChange={setPageNum}
            totalPages={totalPages}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 px-4 py-4 border-t h-52">
        <Suspense fallback={<Skeleton className="h-7 w-1/2 mx-auto" />}>
          <CartTotalPrice />
        </Suspense>
        <CheckoutButton />
      </div>
    </div>
  );
};

export default CartFooter;
