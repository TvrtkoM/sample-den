'use client'

import { useWavesurfer } from '@wavesurfer/react'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'

type SamplePlayerProps = {
  src: string
  onReady?: (duration: number) => void
}

const SamplePlayer = ({ src, onReady }: SamplePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    waveColor: '#d1d5db',
    progressColor: '#f97316',
    cursorColor: '#000',
    barWidth: 2,
    barGap: 1,
    height: 64,
    normalize: true,
    url: src,
  })

  useEffect(() => {
    wavesurfer?.on('ready', () => {
      onReady?.(wavesurfer?.getDuration())
    })
  }, [wavesurfer, onReady])

  const togglePlay = () => wavesurfer?.playPause()

  return (
    <div className="w-full flex items-center gap-4 h-16">
      <Button onClick={togglePlay} disabled={!isReady} className="rounded-full size-8">
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <div className="flex-1 select-none" ref={containerRef} />
    </div>
  )
}

export default SamplePlayer
