import { ExternalLink, LogOut, User } from "lucide-react";

import type { SpotifyProfile } from "../../entities/user";
import { Button } from "../../shared/UI/Button";

import styles from "./header.module.css";

interface ProfileMenuProps {
  profile: SpotifyProfile | null;
  isLoading: boolean;
  error: string | null;
  onLogout: () => void;
}

export const ProfileMenu = ({
  profile,
  isLoading,
  error,
  onLogout,
}: ProfileMenuProps) => {
  const profileImage = profile?.images[0]?.url;
  const profileName = profile?.display_name || "Spotify user";
  const spotifyProfileUrl = profile?.external_urls.spotify;

  return (
    <div className={styles.profileMenu}>
      <div className={styles.profileInfo}>
        {profileImage ? (
          <img
            src={profileImage}
            alt=""
            className={styles.menuAvatar}
          />
        ) : (
          <div className={styles.menuAvatarFallback}>
            <User size={24} />
          </div>
        )}

        <div>
          {isLoading && (
            <p className={styles.profileStatus}>
              Loading profile...
            </p>
          )}

          {!isLoading && !error && (
            <p className={styles.profileName}>
              {profileName}
            </p>
          )}

          {error && (
            <p className={styles.profileError}>
              Profile is unavailable
            </p>
          )}
        </div>
      </div>

      {spotifyProfileUrl && (
        <a
          href={spotifyProfileUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.profileMenuItem}
        >
          <ExternalLink size={18} />
          <span>Open in Spotify</span>
        </a>
      )}

      <Button
        variant="ghost"
        fullWidth
        onClick={onLogout}
        className={styles.profileMenuItem}
      >
        <LogOut size={18} />
        <span>Log out</span>
      </Button>
    </div>
  );
};