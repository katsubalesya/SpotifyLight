import { useState } from "react";
import { User } from "lucide-react";
import Logo from "../../app/img,logo/Primary_Logo_White_RGB.svg";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "../../shared/UI/Search";
import styles from "./header.module.css";

export const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim();
    if(!normalizedQuery) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`);
  };

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <img src={Logo} alt="SpLight Logo" className={styles.logoSvg} />
        SpotifyLight
      </Link>

      <Search
        className={styles.search}
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        placeholder="What do you want to play?"
        ariaLabel="Search Spotify"
      />

      <button className={styles.profile}>
        <User size={20} />
        <span>Profile</span>
      </button>
    </header>
  );
};
