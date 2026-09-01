import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import type { TrackRowData } from "../../entities/track";
import type { SpotifyWebPlaybackPlayer } from "../../shared/API/typesPlayback";
import { startPlayback } from "../../features/playback/api/playback";
import { clearTokens, getValidAccessToken } from "../../shared/API/spotifyAuth";

interface PlayerContextValue {
  currentTrack?: TrackRowData;
  isReady: boolean;
  isConnecting: boolean;
  isPlaying: boolean;
  playerError: string | null;
  playTrack: (track: TrackRowData, queue?: TrackRowData[]) => Promise<void>;
  togglePlay: () => Promise<void> | undefined;
  seek: (seconds: number) => Promise<void> | undefined;
  setVolume: (volume: number) => Promise<void> | undefined;
  progress: number;
  duration: number;
  volume: number;
  playNext: () => void;
  playPrevious: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const playerRef = useRef<SpotifyWebPlaybackPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [queue, setQueue] = useState<TrackRowData[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackRowData>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  const playTrack = useCallback(
    async (track: TrackRowData, nextQueue?: TrackRowData[]) => {
      const player = playerRef.current;

      if (!player || !deviceId) {
        setPlayerError("Spotify player is not ready yet.");
        return;
      }
      try {
        setPlayerError(null);
        await player.activateElement();
        await startPlayback(deviceId, track.uri);

        if (nextQueue) {
          setQueue(nextQueue);
        }
      } catch (error) {
        setPlayerError(
          error instanceof Error
            ? error.message
            : "Failed to start Spotify playback.",
        );
      }
    },
    [deviceId],
  );

  const selectRelativeTrack = useCallback(
    (direction: -1 | 1) => {
      if (!currentTrack || queue.length === 0) return;
      const currentIndex = queue.findIndex(
        ({ uri }) => uri === currentTrack.uri,
      );

      if (currentIndex === -1) {
        return;
      }

      const nextTrack =
        queue[(currentIndex + direction + queue.length) % queue.length];
      if (nextTrack) playTrack(nextTrack);
    },
    [currentTrack, playTrack, queue],
  );

  const playNext = useCallback(() => {
    selectRelativeTrack(1);
    return undefined;
  }, [selectRelativeTrack]);
  const playPrevious = useCallback(() => {
    selectRelativeTrack(-1);
    return undefined;
  }, [selectRelativeTrack]);

  const togglePlay = useCallback(() => {
    return playerRef.current?.togglePlay();
  }, []);

  const seek = useCallback((seconds: number) => {
    return playerRef.current?.seek(seconds * 1000);
  }, []);

  const setVolume = useCallback((volume: number) => {
    const normalized = Math.min(1, Math.max(0, volume));

    setVolumeState(normalized);

    return playerRef.current?.setVolume(normalized);
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      isReady,
      isConnecting,
      isPlaying,
      progress,
      duration: duration || (currentTrack?.durationMs ?? 0) / 1000,
      volume,
      playerError,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      seek,
      setVolume,
    }),
    [
      currentTrack,
      isReady,
      isConnecting,
      isPlaying,
      progress,
      duration,
      playerError,
      playNext,
      playPrevious,
      playTrack,
      seek,
      setVolume,
      togglePlay,
      volume,
    ],
  );

  useEffect(() => {
    const initializePlayer = () => {
      if (!window.Spotify) {
        setIsConnecting(false);
        setPlayerError("Spotify Web Playback SDK failed to load.");
        return;
      }

      const player = new window.Spotify.Player({
        name: "SpLight Web Player",
        getOAuthToken: (callback) => {
          void getValidAccessToken()
            .then(callback)
            .catch(() => {
              clearTokens();
              setPlayerError("Spotify session expired. Please sign in again.");
            });
        },
        volume: 0.7,
        enableMediaSession: true,
      });

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
        setIsConnecting(false);
        setPlayerError(null);
      });

      player.addListener("not_ready", () => {
        setDeviceId(null);
        setIsReady(false);
        setIsConnecting(false);
        setPlayerError("Spotify player is temporarily unavailable.");
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setIsPlaying(!state.paused);
        setProgress(state.position / 1000);
        setDuration(state.duration / 1000);

        const sdkTrack = state.track_window.current_track;

        setCurrentTrack({
          id: sdkTrack.id,
          uri: sdkTrack.uri,
          type: sdkTrack.type,
          title: sdkTrack.name,
          artists: sdkTrack.artists.map((artist) => artist.name),
          album: sdkTrack.album?.name,
          imageUrl: sdkTrack.album?.images[0]?.url ?? null,
          durationMs: sdkTrack.duration_ms,
        });
      });

      player.addListener("initialization_error", ({ message }) => {
        setIsReady(false);
        setIsConnecting(false);
        setPlayerError(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        setIsReady(false);
        setPlayerError(message);
        setIsConnecting(false);
      });

      player.addListener("account_error", () => {
        setIsReady(false);
        setIsConnecting(false);
        setPlayerError("Spotify Premium is required for browser playback.");
      });

      player.addListener("playback_error", ({ message }) => {
        setPlayerError(message);
      });

      playerRef.current = player;

      void player
        .connect()
        .then((connected) => {
          if (!connected) {
            setIsConnecting(false);
            setPlayerError("Could not connect Spotify Web Player.");
          }
        })
        .catch(() => {
          setIsConnecting(false);
          setPlayerError("Failed to initialize Spotify Web Player.");
        });
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    return () => {
      playerRef.current?.disconnect();
      playerRef.current = null;
      window.onSpotifyWebPlaybackSDKReady = undefined;
    };
  }, []);

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

// Этот хук живёт рядом с Provider, чтобы весь публичный API плеера был в одном месте.
// eslint-disable-next-line react/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer должен использоваться внутри PlayerProvider");
  return context;
};
