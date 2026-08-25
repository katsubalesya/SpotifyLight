import { Search, User } from "lucide-react";
import Logo from "../../app/img,logo/Primary_Logo_White_RGB.svg";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
// import { Input } from "../../shared/UI/Input";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <img src={Logo} alt="SpLight Logo" className={styles.logoSvg} />
        SpotifyLight
      </Link>

      <div> </div>
      <div className={styles.search}>
        <Search size={20} />

        {/* <Input type="search" placeholder="What do you want to play?" value={query} onChange={setQuery} /> */}

        <input type="text" placeholder="What do you want to play?" />
      </div>

      <button className={styles.profile}>
        <User size={20} />
        <span>Profile</span>
      </button>
    </header>
  );
};
