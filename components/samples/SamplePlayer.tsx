"use client";

import { formatSecondsDuration } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type SamplePlayerProps = {
  src: string;
};

const SamplePlayer = ({ src }: SamplePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#d1d5db",
      progressColor: "#f97316",
      cursorColor: "#000",
      barWidth: 2,
      barGap: 1,
      height: 64,
      normalize: true
    });

    ws.load(src);
    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());
    });

    ws.on("play", () => {
      setIsPlaying(true);
    });
    ws.on("pause", () => setIsPlaying(false));

    ws.on("timeupdate", (t) => {
      setCurrentTime(t);
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [src]);

  const togglePlay = () => wavesurferRef.current?.playPause();

  return (
    <div className="w-full flex items-center gap-4">
      <button
        onClick={togglePlay}
        disabled={!isReady}
        className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100"
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      <div className="flex-1">
        <div ref={containerRef} className="select-none" />
      </div>

      <div className="text-sm text-gray-600 w-16 text-right leading-none">
        {formatSecondsDuration(currentTime)} / {formatSecondsDuration(duration)}
      </div>
    </div>
  );
};

export default SamplePlayer;
