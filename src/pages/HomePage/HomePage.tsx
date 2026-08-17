import { useEffect, useState, type FC } from "react";
import styles from "./HomePage.module.css";
import { spotifyFetch } from "../../shared/API/SpotifyApi";

type SpotifyUser = {
  display_name: string;
  id: string;
};

const HomePage: FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await spotifyFetch<SpotifyUser>("/me");
        setUserName(data.display_name);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load user";
        console.error("Failed to load user:", message);
        setError(message);
      }
    };

    loadUserData();
  }, []);

  return (
    <section className={styles.home}>
      <h1>Good afternoon{userName ? `, ${userName}` : ""}</h1>

      <p>Discover your favorite music.</p>
      {error && <p role="alert">{error}</p>}
    </section>
  );
};

export default HomePage;
