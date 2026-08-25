import type { FC } from "react";
import type { IRecentTrack } from "../model/types";

interface IRecentTrackListProps {
  tracks: IRecentTrack[];
}

export const RecentTrackList: FC<IRecentTrackListProps> = ({
  tracks,
}) => {
  if (tracks.length === 0) {
    return <p>No recently played tracks</p>;
  }

  return (
    <div>
      {tracks.map((track) => (
        <a
          key={`${track.id}-${track.playedAt}`}
          href={track.externalUrl}
          target="_blank"
          rel="noreferrer"
        >
          {track.imageUrl && (
            <img
              src={track.imageUrl}
              alt={track.albumName}
              width={48}
              height={48}
            />
          )}

          <div>
            <div>{track.name}</div>
            <div>{track.artistName}</div>
          </div>
        </a>
      ))}
    </div>
  );
};