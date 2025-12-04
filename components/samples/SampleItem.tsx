"use client";

import { SamplesPageQueryResult } from "@/groq-generated/sanity-types";
import { useIsInCart, useToggleCartItem } from "@/lib/store/cart";
import { formatSecondsDuration } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import SamplePlayer from "./SamplePlayer";

type SampleItemProps = {
  sample: SamplesPageQueryResult["samples"][number];
};

export default function SampleItem({ sample }: SampleItemProps) {
  const [duration, setDuration] = useState(0);
  const toggleCartItems = useToggleCartItem();
  const isInCart = useIsInCart(sample._id);
  const toggleButtonLabel = isInCart ? "Remove from cart" : "Add to cart";

  return (
    <li className="card h-64 justify-between">
      <div className="card-section gap-2">
        {sample.categories?.map((c) => (
          <Badge variant="secondary" key={c?.slug?.current}>
            {c?.title}
          </Badge>
        ))}
      </div>

      {sample.highResFile?.mp3Url && (
        <div className="card-section bg-gray-100">
          <SamplePlayer
            src={sample.highResFile.mp3Url}
            onReady={(duration) => setDuration(duration)}
          />
        </div>
      )}

      <div className="card-section">
        <h4>{sample.title}</h4>
      </div>

      <div className="card-section justify-between text-sm">
        <div>{formatSecondsDuration(duration)}</div>
        <div className="font-semibold">{sample.priceUsd} $</div>
      </div>

      <div className="card-section">
        <Button
          className="w-full data-[in-cart=true]:bg-accent data-[in-cart=true]:text-foreground data-[in-cart=true]:border-foreground data-[in-cart=true]:border"
          data-in-cart={isInCart}
          onClick={() => toggleCartItems(sample._id)}
        >
          <ShoppingCart /> {toggleButtonLabel}
        </Button>
      </div>
    </li>
  );
}
