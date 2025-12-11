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
      className="relative rounded-full w-9 h-9"
      onClick={openCart}
    >
      <Badge className="absolute -top-[30%] -right-[25%] bg-background text-foreground">
        {cartSize}
      </Badge>
      <ShoppingBag />
    </Button>
  );
}
