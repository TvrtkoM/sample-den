"use client";

import { useCartItems, useCartTotalCount } from "@/hooks/use-cart";
import { defaultCartPageSize } from "@/lib/constants";
import {
  useCartPageNum,
  useCloseCartDrawer,
  useIsCartDrawerOpen,
  useSetCartPageNum
} from "@/lib/store/cart";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useState, ViewTransition } from "react";
import ClientOnly from "../ClientOnly";
import Cart from "./Cart";
import CartFooter from "./CartFooter";
import CartHeader from "./CartHeader";

const CartDrawerContent = () => {
  const pageNum = useCartPageNum();
  const setPageNum = useSetCartPageNum();
  const [prevPageNum, setPrevPageNum] = useState(pageNum);
  const { data, isLoading, isFetching } = useCartItems(pageNum);
  const totalCount = useCartTotalCount();

  const totalPages = Math.ceil(totalCount / defaultCartPageSize);

  const { samples } = data || { samples: [] };

  if (samples.length === 0 && pageNum > 1) {
    setPageNum(pageNum - 1);
  }

  //Show loading when we're fetching a different page than what's currently displayed
  const isChangingPage = isFetching && prevPageNum !== pageNum;

  if (isFetching === false && prevPageNum !== pageNum) {
    setPrevPageNum(pageNum);
  }

  return (
    <>
      <CartHeader />
      <Cart
        samples={samples}
        isChangingPage={isChangingPage}
        isLoading={isLoading}
        isCartEmpty={samples.length === 0 && totalPages === 0}
      />
      <CartFooter
        pageNum={pageNum}
        totalPages={totalPages}
        setPageNum={(nextPage) => {
          setPrevPageNum(pageNum);
          setPageNum(nextPage);
        }}
      />
    </>
  );
};

const CartDrawerImpl = () => {
  const isOpen = useIsCartDrawerOpen();
  const closeDrawer = useCloseCartDrawer();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // Prevent background scrolling when cart drawer is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    isOpen && (
      <>
        <ViewTransition default="drawer-backdrop">
          <div
            className="fixed inset-0 z-9 bg-black/40"
            onClick={() => closeDrawer()}
          ></div>
        </ViewTransition>
        <ViewTransition
          default={!isMobile ? "drawer-slide-desktop" : "drawer-slide-mobile"}
        >
          <section className="fixed bg-white shadow-lg z-10 top-0 right-0 w-2xl h-full max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:w-full max-md:h-[80vh] flex flex-col">
            <CartDrawerContent />
          </section>
        </ViewTransition>
      </>
    )
  );
};

const CartDrawer = () => {
  return (
    <ClientOnly>
      <CartDrawerImpl />
    </ClientOnly>
  );
};

export default CartDrawer;
