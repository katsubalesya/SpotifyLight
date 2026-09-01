// const seconds = String(totalSeconds % 60).padStart(2, "0"); Сделай строку длиной минимум 2 символа. Если символов не хватает — добавь слева "0".
// Компонент TrackRow обязательно получает объект трека и его номер. Дополнительно он может получить информацию, играет ли сейчас трек, функцию для Play и функцию для кнопки More.

import { MoreHorizontal, Music2, Pause, Play } from "lucide-react";
import type { FC } from "react";

import { Button } from "../../../shared/UI/Button";
import styles from "./trackRow.module.css";
import type { TrackRow } from "../model/types";

export interface TrackRowProps {
  track: TrackRow;
  index: number;
  isPlaying?: boolean;
  onPlay?: (track: TrackRow) => void;
  onMoreClick?: (track: TrackRow) => void;
}

const formatDuration = (durationMs?: number) => {
  if (!durationMs) return "--:--";

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0"); 

  return `${minutes}:${seconds}`;
};

export const Track: FC<TrackRowProps> = ({
  track,
  index,
  isPlaying = false,
  onPlay,
  onMoreClick,
}) => {
  const handlePlay = () => {
    onPlay?.(track);
  };

  const handleMoreClick = () => {
    onMoreClick?.(track);
  };

  return (
    <article className={styles.row}>
      <div className={styles.number}>
        <span className={styles.trackNumber}>{index + 1}</span>

        <Button
          variant="icon"
          onClick={handlePlay}
          className={styles.icon}
          >
          {isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </Button>
      </div>

      <div className={styles.trackInfo}>
        {track.imageUrl ? (
          <img
            className={styles.cover}
            src={track.imageUrl}
            alt={`Cover ${track.album ?? track.title}`}
          />
        ) : (
          <div className={styles.coverPlaceholder}>< Music2 /></div>
        )}

        <div className={styles.text}>
          <p className={isPlaying ? styles.titlePlaying : styles.title}>
            {track.title}
          </p>

          <p className={styles.artists}>{track.artists.join(", ")}</p>
        </div>
      </div>

      <p className={styles.album}>{track.album ?? "—"}</p>

      <time className={styles.duration}>
        {formatDuration(track.durationMs)}
      </time>

      <Button
        variant="ghost"
        onClick={handleMoreClick}
        >
        <MoreHorizontal fill="currentColor" size={20} />
      </Button>
    </article>
  );
};
