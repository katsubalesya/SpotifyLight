import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./LibraryPlaylists.module.css";

export type LibraryItemType = "playlist" | "artist" | "album" | "podcast";

export interface ILibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  to?: string;
  externalUrl?: string;
}

interface ILibraryListProps {
  items: ILibraryItem[];
  emptyMessage: string;
}

/** A shared library list for playlists, artists, albums and podcasts. */
export const LibraryList: FC<ILibraryListProps> = ({ items, emptyMessage }) => {
  const { pathname } = useLocation();

  if (items.length === 0) {
    return <p className={styles.emptyMessage}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.listContainer}>
      {items.map((item) => {
        const content = (
          <>
            {item.imageUrl ? (
              <img src={item.imageUrl} className={styles.img} alt="" />
            ) : (
              <div className={`${styles.img} ${styles.emptyImg}`} aria-hidden="true" />
            )}
            <div className={styles.content}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.description}>{item.subtitle}</span>
            </div>
          </>
        );
        const className = `${styles.item} ${pathname === item.to ? styles.active : ""}`;
        const key = `${item.type}-${item.id}`;

        if (item.to) {
          return <Link key={key} className={className} to={item.to}>{content}</Link>;
        }

        // if (item.externalUrl) {
        //   return <a key={key} className={className} href={item.externalUrl} target="_blank" rel="noreferrer">{content}</a>;
        // }

        return <div key={key} className={className}>{content}</div>;
      })}
    </div>
  );
};
