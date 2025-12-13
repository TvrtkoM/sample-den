"use client";

import { SamplesByIdsPageQueryResult } from "@/generated/groq/sanity-types";
import { useRemoveFromCartInCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import SamplePlayer from "../samples/SamplePlayer";
import { Button } from "../ui/button";

type CartItemProps = {
  sample: SamplesByIdsPageQueryResult["samples"][number];
};

export default function CartItem({ sample }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const removeFromCart = useRemoveFromCartInCart({
    onRemoveStart: () => setIsRemoving(true)
  });

  return (
    <li
      className={cn("flex flex-col gap-3 p-4 card mx-4", {
        "opacity-50 pointer-events-none": isRemoving
      })}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium truncate flex-1">{sample.title}</h3>
        <span className="font-semibold whitespace-nowrap">
          {sample.priceUsd} $
        </span>
      </div>

      {sample.highResFile?.mp3Url && (
        <div className="bg-gray-100 rounded-md p-2">
          <SamplePlayer src={sample.highResFile.mp3Url} />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeFromCart.mutate(sample._id)}
        >
          <Trash2 className="size-4" />
          {isRemoving ? "Removing..." : "Remove"}
        </Button>
      </div>
    </li>
  );
}
