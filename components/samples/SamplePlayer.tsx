"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Pause, Play } from "react-feather";
import { Button } from "../ui/button";

type SamplePlayerProps = {
  src: string;
  onReady?: (duration: number) => void;
  onTimeUpdate?: (seconds: number) => void;
};

const SamplePlayer = ({ src, onReady, onTimeUpdate }: SamplePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (wavesurferRef.current) return;

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
      onReady?.(ws.getDuration());
    });

    ws.on("play", () => {
      setIsPlaying(true);
    });
    ws.on("pause", () => setIsPlaying(false));

    ws.on("timeupdate", (t) => {
      onTimeUpdate?.(t);
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [src, onReady, onTimeUpdate]);

  const togglePlay = () => wavesurferRef.current?.playPause();

  return (
    <div className="w-full flex items-center gap-4">
      <Button
        onClick={togglePlay}
        disabled={!isReady}
        className="rounded-full size-8"
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <div className="flex-1 select-none" ref={containerRef} />
    </div>
  );
};

export default SamplePlayer;
