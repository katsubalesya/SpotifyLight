export interface SpotifyWebPlaybackTrack {
  id: string;
  uri: string;
  type: "track" | "episode";
  name: string;
  duration_ms: number;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
}

export interface SpotifyWebPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: SpotifyWebPlaybackTrack;
    previous_tracks: SpotifyWebPlaybackTrack[];
    next_tracks: SpotifyWebPlaybackTrack[];
  };
}

export interface SpotifyWebPlaybackPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  activateElement(): Promise<void>;
  togglePlay(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  previousTrack(): Promise<void>;
  nextTrack(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  setVolume(volume: number): Promise<void>;

  addListener(
    event: "ready",
    callback: (data: { device_id: string }) => void,
  ): boolean;

  addListener(
    event: "not_ready",
    callback: (data: { device_id: string }) => void,
  ): boolean;

  addListener(
    event: "player_state_changed",
    callback: (state: SpotifyWebPlaybackState | null) => void,
  ): boolean;

  addListener(
    event:
      | "initialization_error"
      | "authentication_error"
      | "account_error"
      | "playback_error",
    callback: (data: { message: string }) => void,
  ): boolean;
}

//Player
declare global {
  interface Window {
    Spotify?: {
      Player: new (options: {
        name: string;
        getOAuthToken: (
          callback: (token: string) => void,
        ) => void;
        volume?: number;
        enableMediaSession?: boolean;
      }) => SpotifyWebPlaybackPlayer;
    };

    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export {};