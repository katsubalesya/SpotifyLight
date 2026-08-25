import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayer } from "./playerContext";
import styles from "./Player.module.css";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

export const Player = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    hasAudio,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
  } = usePlayer();

  return (
    <footer className={styles.player}>
      <div className={styles.track}>
        {currentTrack?.imageUrl ? (
          <img className={styles.cover} src={currentTrack.imageUrl} alt="" />
        ) : (
          <div className={styles.cover}>♪</div>
        )}
        <div className={styles.trackText}>
          <p className={styles.title}>
            {currentTrack?.title ?? "Трек не выбран"}
          </p>
          <p className={styles.artist}>
            {currentTrack?.artists.join(", ") ?? "Выберите композицию в списке"}
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button
            onClick={playPrevious}
            disabled={!currentTrack}
            aria-label="Предыдущий трек"
          >
            <SkipBack size={20} />
          </button>
          <button
            className={styles.play}
            onClick={togglePlay}
            disabled={!currentTrack}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
          <button
            onClick={playNext}
            disabled={!currentTrack}
            aria-label="Следующий трек"
          >
            <SkipForward size={20} />
          </button>
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
            disabled={!hasAudio}
            aria-label="Позиция воспроизведения"
          />
          <span>{formatTime(duration)}</span>
        </div>
        {currentTrack && !hasAudio && (
          <span className={styles.notice}>Аудиопревью недоступно</span>
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
          aria-label="Громкость"
        />
      </div>
    </footer>
  );
};
