"use client";

import { useCloseCartDrawer } from "@/lib/store/cart";
import { X } from "lucide-react";
import { Button } from "../ui/button";

const CartHeader = () => {
  const closeCartDrawer = useCloseCartDrawer();
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      <Button variant="ghost" size="icon" onClick={() => closeCartDrawer()}>
        <X className="size-5" />
      </Button>
    </div>
  );
};

export default CartHeader;
