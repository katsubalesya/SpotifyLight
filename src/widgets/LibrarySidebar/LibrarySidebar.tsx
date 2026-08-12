// import {  Home,  Search,  Disc3,  Library,  ListMusic,} from "lucide-react";

import styles from "./LibrarySidebar.module.css";

export const LibrarySidebar = () => {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul className={styles.navigation}>

          <li>
            <span>Your Library</span>
          </li>

            {/* <Link to="/home"></Link> 
            <Link to="/albums">*/}
          {/* <li>
            <Home size={20} />
            <span>Home</span>
          </li>

          <li>
            <Search size={20} />
            <span>Search</span>
          </li> */}

        </ul>
      </nav>
    </div>
  );
};