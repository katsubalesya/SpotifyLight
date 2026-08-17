import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  exchangeCodeForToken,
  isUserAuthenticated,
} from "../../shared/API/SpotifyAuth";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (isProcessingRef.current) {
      return;
    }

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (isUserAuthenticated()) {
      navigate("/", { replace: true });
      return;
    }

    if (error) {
      console.error("Spotify authorization error:", error);
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    isProcessingRef.current = true;

    const authorize = async () => {
      try {
        await exchangeCodeForToken(code);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Authorization failed:", error);
        isProcessingRef.current = false;
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
