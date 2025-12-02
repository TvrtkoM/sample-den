"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCartSize } from "@/lib/store/cart";

export default function CartIcon() {
  const cartSize = useCartSize();
  return (
    <Button
      type="button"
      aria-label="View cart"
      className="relative rounded-full"
    >
      <Badge className="absolute -top-[30%] -right-[25%] bg-background text-foreground">
        {cartSize}
      </Badge>
      <ShoppingBag />
    </Button>
  );
}
