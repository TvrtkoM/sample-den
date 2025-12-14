"use client";

import { useCartItems, useCartTotalCount } from "@/hooks/use-cart";
import { defaultCartPageSize } from "@/lib/constants";
import {
  useCartDrawerOpenAtom,
  useCartPageNum,
  useSetCartPageNum
} from "@/lib/store/cart";
import { useMediaQuery } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useCartDrawerOpenAtom();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const drawerVariants = isMobile
    ? {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" }
      }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" }
      };

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-9 bg-black/40 backdrop-blur-xs"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.section
            className="fixed bg-white shadow-lg z-10 top-0 right-0 w-2xl h-full max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:w-full max-md:h-[80vh] flex flex-col"
            initial={drawerVariants.initial}
            animate={drawerVariants.animate}
            exit={drawerVariants.exit}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CartDrawerContent />
          </motion.section>
        </>
      )}
    </AnimatePresence>
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
