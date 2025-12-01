"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const numItems = 55;

export default function CartIcon() {
  return (
    <Button
      type="button"
      aria-label="View cart"
      className="relative rounded-full"
    >
      <Badge className="absolute -top-[30%] -right-[25%] bg-background text-foreground">
        {numItems}
      </Badge>
      <ShoppingBag />
    </Button>
  );
}
