// import type { FC } from "react";
// import type { IArtist } from "../model/types";

// interface IArtistListProps {
//   artists: IArtist[];
// }

// export const ArtistList: FC<IArtistListProps> = ({ artists }) => {
//   if (artists.length === 0) {
//     return <p>No followed artists</p>;
//   }

//   return (
//     <div >
//       {artists.map((artist) => (
//         <a
//           key={artist.id}
//           href={artist.externalUrl}
//           target="_blank"
//           rel="noreferrer"
//         >
//           {artist.imageUrl && (
//             <img
//               src={artist.imageUrl}
//               alt={artist.name}
//               width={48}
//               height={48}
//             />
//           )}

//           <span>{artist.name}</span>
//         </a>
//       ))}
//     </div>
//   );
// };
