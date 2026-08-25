// import type { FC } from "react";
// import type { IPodcast } from "../model/types";


// interface IPodcastListProps {
//     podcasts: IPodcast[];
// }

// export const PodcastList: FC<IPodcastListProps> = ({
//     podcasts,}) => {
//         if (podcasts.length === 0) {
//             return <p> No saved podcasts</p>
//         };

//         return (
//             <div>
//                 {podcasts.map((podcast) => (
//                     <a key={podcast.id}
//                     href={podcast.externalUrl} target="_blank" rel="noreferrer">
//                         {podcast.imageUrl && (<img src={podcast.imageUrl} 
//                         alt={podcast.name}
//                     width={48}
//                 height={48}/>)}

//                 <div>
//                     <div>{podcast.name}</div>
//                     <div>{podcast.publisher}</div>
//                 </div>
//                     </a>
//                 ))}
//             </div>

//         );
//     };