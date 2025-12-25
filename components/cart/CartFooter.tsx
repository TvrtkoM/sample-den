"use client";

import { useCartTotalPrice } from "@/hooks/use-cart";
import { useState } from "react";
import AppPagination from "../AppPagination";
import { Button } from "../ui/button";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const CheckoutButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();

  const isAuth = session != null && session.user.isAnonymous === false;

  const checkout = async () => {
    setIsSubmitting(true);
    const res = await fetch("/api/payment/checkout-sessions", {
      method: "POST"
    });
    const response: { url: string } = await res.json();
    const url = response.url;
    window.location.href = url;
    //setIsSubmitting(false);
  };

  return (
    <>
      {isAuth ? (
        <Button
          size={"lg"}
          className="text-xl"
          onClick={() => checkout()}
          disabled={isSubmitting}
        >
          Checkout
        </Button>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button size={"lg"} className="text-xl" asChild>
            <Link
              href={{
                pathname: "/sign-in"
              }}
            >
              Sign in to continue
            </Link>
          </Button>
          <Button size={"lg"} className="text-xl" asChild>
            <Link href={{ pathname: "/sign-up" }}>Create an account</Link>
          </Button>
        </div>
      )}
    </>
  );
};

const CartTotalPrice = () => {
  const { data: totalPrice, isLoading } = useCartTotalPrice();

  if (isLoading) {
    return <Skeleton className="h-7 w-1/2 mx-auto" />;
  }

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
        <CartTotalPrice />
        <CheckoutButton />
      </div>
    </div>
  );
};

export default CartFooter;
