"use client";

import { SamplesByIdsPageQueryResult } from "@/groq-generated/sanity-types";
import { useRemoveFromCartInCart } from "@/hooks/use-cart";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import SamplePlayer from "../samples/SamplePlayer";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
      className={cn("flex flex-col gap-3 p-4 border-b last:border-b-0", {
        "opacity-50 pointer-events-none": isRemoving
      })}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium truncate flex-1">{sample.title}</h4>
        <span className="font-semibold text-sm whitespace-nowrap">
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
          disabled={removeFromCart.isPending}
        >
          <Trash2 className="size-4" />
          Remove
        </Button>
      </div>
    </li>
  );
}
