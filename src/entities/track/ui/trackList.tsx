import type { FC } from "react";
import { Track } from "./trackRow";
import styles from "./trackList.module.css";
import type { TrackRow } from "../model/types";

export interface TrackListProps {
  tracks: TrackRow[];
  currentTrackId?: string;
  onTrackPlay?: (track: TrackRow) => void;
  onTrackMoreClick?: (track: TrackRow) => void;
  emptyMessage?: string;
}

export const TrackList: FC<TrackListProps> = ({
  tracks,
  currentTrackId,
  onTrackPlay,
  onTrackMoreClick,
  emptyMessage = "Tracks not found",
}) => {
  if (tracks.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <section className={styles.trackList} aria-label="Tracks List">
      <div className={styles.head}>
        <span>#</span>
        <span>Name</span>
        <span className={styles.albumHead}>Album</span>
        <span className={styles.durationHead}>Duration</span>
        <span aria-hidden="true" />
      </div>

      <div className={styles.rows}>
        {tracks.map((track, index) => (
          <Track
            key={track.id}
            track={track}
            index={index}
            isPlaying={track.id === currentTrackId}
            onPlay={onTrackPlay}
            onMoreClick={onTrackMoreClick}
          />
        ))}
      </div>
    </section>
  );
};