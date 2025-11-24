"use client";

import { SamplesPageQuery } from "@/graphql-generated/graphql";
import { formatSecondsDuration } from "@/lib/utils";
import { useCallback, useState } from "react";
import SamplePlayer from "./SamplePlayer";

type SampleItemProps = {
  sample: SamplesPageQuery["allSample"][number];
};

export default function SampleItem({ sample }: SampleItemProps) {
  const [duration, setDuration] = useState(0);
  const [currentSecond, setCurrentSecond] = useState(0);

  const onReadyHandler = useCallback((duration: number) => {
    setDuration(duration);
  }, []);

  const onTimeUpdateHandler = useCallback((t: number) => {
    setCurrentSecond(t);
  }, []);

  return (
    <li className="border rounded p-4 shadow-sm bg-white">
      <h2 className="text-lg font-medium mb-2">{sample.title}</h2>

      {sample.highResFile?.mp3Url && (
        <SamplePlayer
          src={sample.highResFile.mp3Url}
          onReady={onReadyHandler}
          onTimeUpdate={onTimeUpdateHandler}
        />
      )}

      <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
        <span>
          {sample.categories
            ?.map((c) => c?.title)
            .filter(Boolean)
            .join(", ")}
        </span>

        <span>
          {formatSecondsDuration(currentSecond)} /{" "}
          {formatSecondsDuration(duration)}
        </span>
      </div>
    </li>
  );
}
