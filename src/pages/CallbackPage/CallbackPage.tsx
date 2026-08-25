// import styles from "./PlayListPage.module.css";
// это ,промежуточная страница, на которую Spotify возвращает пользователя после входа

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { exchangeCodeForToken } from "../../shared/API/spotifyAuth";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasStartedAuthorization = useRef(false);

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

    if (hasStartedAuthorization.current) {
      return;
    }

    hasStartedAuthorization.current = true;

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
