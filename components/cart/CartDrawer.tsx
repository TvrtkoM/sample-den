"use client";

import { useCartDrawerOpen } from "@/lib/store/cart";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@uidotdev/usehooks";
import { X } from "lucide-react";
import { useEffect } from "react";
import ClientOnly from "../ClientOnly";
import { Button } from "../ui/button";
import Cart from "./Cart";

const CartDrawerImpl = () => {
  const [isOpen, setIsOpen] = useCartDrawerOpen();
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
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Cart />
            </div>
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
