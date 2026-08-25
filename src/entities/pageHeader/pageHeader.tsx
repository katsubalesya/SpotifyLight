import { Heart, Music2, Pause, Play } from "lucide-react";
import type { FC, ReactNode } from "react";
import { Button } from "../../shared/UI/Button";
import styles from "./PageHeader.module.css";

type PageHeaderType = "playlist" | "artist" | "album" | "podcast";

interface IPageHeaderProps {
  type: PageHeaderType;
  title: string;
  imageUrl?: string | null;
  description?: string;
  meta?: string[];
  isPlaying?: boolean;
  isSaved?: boolean;
  onPlay?: () => void;
  onSave?: () => void;
  children?: ReactNode;
}

const typeLabels: Record<PageHeaderType, string> = {
  playlist: "Playlist",
  artist: "Artist",
  album: "Album",
  podcast: "Podcast",
};

export const PageHeader: FC<IPageHeaderProps> = ({
  type,
  title,
  imageUrl,
  description,
  meta = [],
  isPlaying = false,
  isSaved = false,
  onPlay,
  onSave,
  children,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <div
          className={`${styles.coverWrapper} ${
            type === "artist" ? styles.artistCoverWrapper : ""
          }`}
        >
          {imageUrl ? (
            <img
              className={`${styles.cover} ${
                type === "artist" ? styles.artistCover : ""
              }`}
              src={imageUrl}
              alt={title}
            />
          ) : (
            <div
              className={`${styles.placeholder} ${
                type === "artist" ? styles.artistCover : ""
              }`}
              aria-hidden="true"
            >
              <Music2 />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.type}>{typeLabels[type]}</p>

          <h1 className={styles.title}>{title}</h1>

          {/* {description && <p className={styles.description}>{description}</p>} */}

          {meta.length > 0 && (
            <p className={styles.meta}>
              {meta.map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </p>
          )}

          <div className={styles.actions}>
            {onPlay && (
              <Button
                variant="secondary"
                onClick={onPlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" />
                )}
              </Button>
            )}

            {onSave && (
              <Button
                variant="secondary"
                className={`${styles.saveButton} ${isSaved ? styles.saved : ""}`}
                onClick={onSave}
                aria-label={isSaved ? "Delete" : "Save"}
              >
                <Heart size={25} fill={isSaved ? "currentColor" : "none"} />
              </Button>
            )}

            {children}
          </div>
        </div>
      </div>

      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
};
