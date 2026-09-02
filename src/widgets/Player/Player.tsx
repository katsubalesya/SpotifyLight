import {
  Heart,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayer } from "./playerContext";
import styles from "./player.module.css";
import { Button } from "../../shared/UI/Button";
import { useLikedTrack } from "../../entities/track/model/useLikedTrack";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

export const Player = () => {
  const {
    currentTrack,
    isReady,
    isConnecting,
    isPlaying,
    progress,
    duration,
    volume,
    playerError,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
  } = usePlayer();

  const isTrackSelected = Boolean(currentTrack);

  const likedTrackId =
  currentTrack?.type === "track"
    ? currentTrack.id
    : undefined;

const {
  isLiked,
  isChecking,
  isUpdating,
  error: likedError,
  toggleLiked,
} = useLikedTrack(likedTrackId);

  return (
    <footer className={styles.player}>
      <div className={styles.track}>
        {currentTrack?.imageUrl ? (
          <img
            className={styles.cover}
            src={currentTrack.imageUrl}
            alt={`Cover ${currentTrack.title}`}
          />
        ) : (
          <div className={styles.cover} aria-hidden="true">
            <Music2 />
          </div>
        )}
        <div className={styles.trackText}>
          <p className={styles.title}>
            {currentTrack?.title ?? "Track not selected"}
          </p>
          <p className={styles.artist}>
            {currentTrack?.artists.join(", ") ??
              "Select a composition from the list"}
          </p>
        </div>

{currentTrack?.type === "track" && (
        <Button
          variant="icon"
          className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
          onClick={() => void toggleLiked()}
          disabled={!currentTrack || isChecking || isUpdating}
          aria-label={
            isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"
          }
          aria-pressed={isLiked}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
        </Button>
)}

        {likedError && (
    <span className={styles.likeError} role="alert">
      {likedError}
    </span>
  )}

      </div>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <Button
            variant="icon"
            className={styles.controlButton}
            onClick={playPrevious}
            disabled={!isTrackSelected}
            aria-label="Previous track"
          >
            <SkipBack size={20} />
          </Button>
          <Button
            variant="secondary"
            className={styles.playButton}
            onClick={togglePlay}
            disabled={!isTrackSelected || !isReady}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </Button>
          <Button
            variant="icon"
            className={styles.controlButton}
            onClick={playNext}
            disabled={!isTrackSelected}
            aria-label="Next track"
          >
            <SkipForward size={20} />
          </Button>
        </div>

        <div className={styles.progress}>
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={Math.max(duration, 1)}
            step="1"
            value={Math.min(progress, duration || 1)}
            onChange={(event) => seek(Number(event.target.value))}
            disabled={!currentTrack || !isReady}
            aria-label="Playback position"
          />
          <span>{formatTime(duration)}</span>
        </div>
        {isConnecting && (
          <span className={styles.notice}>Connecting to Spotify...</span>
        )}

        {playerError && (
          <span className={styles.notice} role="alert">
            {playerError}
          </span>
        )}
      </div>

      <div className={styles.volume}>
        {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
      </div>
    </footer>
  );
};
