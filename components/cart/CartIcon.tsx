"use client";

import { useCartSize } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useOpenCartDrawer } from "@/lib/store/cart";

export default function CartIcon() {
  const cartSize = useCartSize();
  const openCart = useOpenCartDrawer();

  return (
    <Button
      type="button"
      aria-label="View cart"
      className="relative rounded-full h-9 flex items-center"
      onClick={openCart}
    >
      cart
      <Badge className="absolute -top-[30%] -right-[15%] bg-background text-foreground border border-gray-400">
        {cartSize}
      </Badge>
      <ShoppingBag />
    </Button>
  );
}
