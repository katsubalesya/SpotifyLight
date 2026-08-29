import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren,} from "react";
import type { TrackRow } from "../../entities/trackrow/model/types";

interface PlayerContextValue {
  currentTrack?: TrackRow;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  hasAudio: boolean;
  playTrack: (track: TrackRow, queue?: TrackRow[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<TrackRow[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackRow>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  const playTrack = useCallback((track: TrackRow, nextQueue?: TrackRow[]) => {
    if (nextQueue) setQueue(nextQueue);
    setCurrentTrack((current) => {
      if (current?.id === track.id) {
        setIsPlaying((playing) => !playing);
        return current;
      }
      setProgress(0);
      setIsPlaying(true);
      return track;
    });
  }, []);

  const selectRelativeTrack = useCallback((direction: -1 | 1) => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(({ id }) => id === currentTrack.id);
    const nextTrack = queue[(currentIndex + direction + queue.length) % queue.length];
    if (nextTrack) playTrack(nextTrack);
  }, [currentTrack, playTrack, queue]);

  const playNext = useCallback(() => selectRelativeTrack(1), [selectRelativeTrack]);
  const playPrevious = useCallback(() => selectRelativeTrack(-1), [selectRelativeTrack]);
  const togglePlay = useCallback(() => {
    if (currentTrack) setIsPlaying((playing) => !playing);
  }, [currentTrack]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const normalized = Math.min(1, Math.max(0, nextVolume));
    setVolumeState(normalized);
    if (audioRef.current) audioRef.current.volume = normalized;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.previewUrl) return;
    if (isPlaying) void audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [currentTrack, isPlaying]);

  const value = useMemo<PlayerContextValue>(() => ({
    currentTrack,
    isPlaying,
    progress,
    duration: duration || (currentTrack?.durationMs ?? 0) / 1000,
    volume,
    hasAudio: Boolean(currentTrack?.previewUrl),
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
  }), [currentTrack, duration, isPlaying, playNext, playPrevious, playTrack, progress, seek, setVolume, togglePlay, volume]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={currentTrack?.previewUrl ?? undefined} preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)} onEnded={playNext} />
    </PlayerContext.Provider>
  );
};

// Этот хук живёт рядом с Provider, чтобы весь публичный API плеера был в одном месте.
// eslint-disable-next-line react/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer должен использоваться внутри PlayerProvider");
  return context;
};
