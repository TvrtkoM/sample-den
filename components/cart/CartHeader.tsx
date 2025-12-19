"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useCartDrawerOpen } from "@/lib/search-params/hooks";
import { startTransition } from "react";

const CartHeader = () => {
  const [, setCartOpen] = useCartDrawerOpen();
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(() => {
            setCartOpen(false);
          });
        }}
      >
        <X className="size-5" />
      </Button>
    </div>
  );
};

export default CartHeader;
