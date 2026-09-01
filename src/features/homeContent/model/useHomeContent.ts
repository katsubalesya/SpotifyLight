import { useEffect, useState } from "react";
import { getHomeContent } from "../api/getHomeContent";

type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;

export const useHomeContent = () => {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    let isActive = true;

    const loadContent = async () => {
      try {
        const result = await getHomeContent();

        if (isActive) {
          setContent(result);
        }
      } catch (error) {
        if (isActive) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load Spotify content",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    content,
    isLoading,
    error,
  };
};