"use client";

import { useCartSize } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useCartDrawerOpen } from "@/lib/search-params/hooks";
import { startTransition } from "react";

export default function CartIcon() {
  const cartSize = useCartSize();
  const [, setCartOpen] = useCartDrawerOpen();

  return (
    <Button
      type="button"
      aria-label="View cart"
      className="relative rounded-full h-9 flex items-center"
      onClick={() => {
        startTransition(() => {
          setCartOpen(true);
        });
      }}
    >
      cart
      <Badge className="absolute -top-[30%] -right-[15%] bg-background text-foreground border border-gray-400">
        {cartSize}
      </Badge>
      <ShoppingBag />
    </Button>
  );
}
