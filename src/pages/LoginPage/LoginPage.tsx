import { redirectToSpotifyAuth } from "../../shared/API/spotifyAuth";
import { Button } from "../../shared/UI/Button/button";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const handleLogin = async () => {
    await redirectToSpotifyAuth();
  };

  return (
    <main className={styles.container}>
      <h1>Welcome to Spotify Light</h1>
      <Button onClick={handleLogin}>Continue with Spotify</Button>
    </main>
  );
};

export default LoginPage;
