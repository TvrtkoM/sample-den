"use client";

import { formatSecondsDuration } from "@/lib/utils";
import { useCallback, useState } from "react";
import SamplePlayer from "./SamplePlayer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShoppingCart } from "react-feather";
import { SamplesPageQueryResult } from "@/groq-generated/sanity-types";

type SampleItemProps = {
  sample: SamplesPageQueryResult["samples"][number];
};

export default function SampleItem({ sample }: SampleItemProps) {
  const [duration, setDuration] = useState(0);

  const onReadyHandler = useCallback((duration: number) => {
    setDuration(duration);
  }, []);

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
            onReady={onReadyHandler}
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
        <Button className="w-full">
          <ShoppingCart /> Add to Cart
        </Button>
      </div>
    </li>
  );
}
