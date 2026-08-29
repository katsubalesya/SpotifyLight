import type { FC } from "react";
// import { TrackRow} from "../../trackrow/ui/trackRow";
// import type { TrackRow } from "../../trackrow/model/types";

import { TrackRow } from "../../trackrow/ui/trackRow";
import type { TrackRow as TrackRowData } from "../../trackrow/model/types";
import styles from "./trackList.module.css";

interface TrackListProps {
  tracks: TrackRowData[];
  currentTrackId?: string;
  onTrackPlay?: (track: TrackRowData) => void;
  onTrackMoreClick?: (track: TrackRowData) => void;
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