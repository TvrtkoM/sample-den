"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCartStore } from "@/lib/store/cart";

export default function CartIcon() {
  const count = useCartStore((s) => s.items.size);
  return (
    <Button
      type="button"
      aria-label="View cart"
      className="relative rounded-full"
    >
      <Badge className="absolute -top-[30%] -right-[25%] bg-background text-foreground">
        {count}
      </Badge>
      <ShoppingBag />
    </Button>
  );
}
