// import type { FC } from "react";
// import type { IAlbum } from "../model/types";

// interface IAlbumListProps {
//     albums: IAlbum[];
// }

// export const AlbumList: FC<IAlbumListProps> = ({
//     albums,}) => {
//         if (albums.length === 0) {
//             return <p> No saved albums</p>
//         };

//         return (
//             <div>
//                 {albums.map((album) => (
//                     <a key={album.id}
//                     href={album.externalUrl} target="_blank" rel="noreferrer">
//                         {album.imageUrl && (<img src={album.imageUrl} 
//                         alt={album.name}
//                     width={48}
//                 height={48}/>)}

//                 <div>
//                     <div>{album.name}</div>
//                     <div>{album.artistName}</div>
//                 </div>
//                     </a>
//                 ))}
//             </div>

//         );
//     };