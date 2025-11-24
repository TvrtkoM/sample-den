"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Pause, Play } from "react-feather";

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
      <button
        onClick={togglePlay}
        disabled={!isReady}
        className="w-10 h-10 flex items-center justify-center border rounded-full cursor-pointer hover:bg-gray-100"
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>

      <div className="flex-1 select-none" ref={containerRef} />
    </div>
  );
};

export default SamplePlayer;
