import { useEffect, type FC } from "react";
import styles from "./HomePage.module.css";
import { useAccessToken } from "../../shared/hooks/UseAccessToken";

const HomePage: FC = () => {
  const token = useAccessToken();

  useEffect(() => {
    if (!token) return;
    loadUserData();
  }, [token]);

  const loadUserData = async () => {
    if (!token) return;
    
    const responce = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!responce.ok) {
      console.error("Failed to load user");
      return;
    }
    const data = await responce.json();
    console.log(data, "data");
  };

  return (
    <section className={styles.home}>
      <h1>Good afternoon</h1>

      <p>Discover your favorite music.</p>
    </section>
  );
};

export default HomePage;
