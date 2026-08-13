// import styles from "./PlayListPage.module.css";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { exchangeCodeForToken } from "../../shared/API/SpotifyAuth";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("Spotify authorization error:", error);
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    const authorize = async () => {
      try {
        await exchangeCodeForToken(code);

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Authorization failed:", error);
        navigate("/login", { replace: true });
      }
    };

    authorize();
  }, [searchParams, navigate]);

  return (
    <main>
      <p>Signing in with Spotify...</p>
    </main>
  );
};

export default CallbackPage;