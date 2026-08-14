import type { FC } from "react";
import styles from "./LibraryPlaylists.module.css" 

interface IPlaylist {
    id: string;
    name: string;
    ownerName: string;
}
interface ILibraryPlaylistProps {
    list: IPlaylist[];
}

export const LibraryPlaylists: FC<ILibraryPlaylistProps> = ({list}) => {
return (
<div className={styles.listContainer}>
    {list.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
    ))};
</div>
);
}