import type { FC } from "react";
import { TrackRow} from "../../trackrow/ui/trackRow";
import type { ITrackRow } from "../../trackrow/model/types";
import styles from "./TrackList.module.css";

interface ITrackListProps {
  tracks: ITrackRow[];
  currentTrackId?: string;
  onTrackPlay?: (track: ITrackRow) => void;
  onTrackMoreClick?: (track: ITrackRow) => void;
  emptyMessage?: string;
}

export const TrackList: FC<ITrackListProps> = ({
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
          <TrackRow
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