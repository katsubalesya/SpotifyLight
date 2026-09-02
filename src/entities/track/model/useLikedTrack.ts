import { useCallback, useEffect, useState } from "react";
import { checkTrackIsLiked, removeTrackFromLiked, saveTrackToLiked } from "../../likedTracks/likedTracks";

export const useLikedTrack = (trackId?: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!trackId) {
      setIsLiked(false);
      setIsChecking(false);
      setError(null);
      return () => controller.abort();
    }

    const loadLikedState = async () => {
      setIsChecking(true);
      setError(null);

      try {
        const liked = await checkTrackIsLiked(
          trackId,
          controller.signal,
        );

        setIsLiked(liked);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setError("Failed to check Liked Songs");
      } finally {
        if (!controller.signal.aborted) {
          setIsChecking(false);
        }
      }
    };

    void loadLikedState();

    return () => controller.abort();
  }, [trackId]);

  const toggleLiked = useCallback(async () => {
    if (!trackId || isUpdating) return;

    const previousValue = isLiked;
    const nextValue = !previousValue;

    // Оптимистичное обновление интерфейса.
    setIsLiked(nextValue);
    setIsUpdating(true);
    setError(null);

    try {
      if (nextValue) {
        await saveTrackToLiked(trackId);
      } else {
        await removeTrackFromLiked(trackId);
      }
    } catch {
      // Возвращаем сердечко в прежнее состояние при ошибке API.
      setIsLiked(previousValue);
      setError("Failed to update Liked Songs");
    } finally {
      setIsUpdating(false);
    }
  }, [trackId, isLiked, isUpdating]);

  return {
    isLiked,
    isChecking,
    isUpdating,
    error,
    toggleLiked,
  };
};