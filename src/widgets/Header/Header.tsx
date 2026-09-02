import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../app/logo/Primary_Logo_White_RGB.svg";
import { getCurrentUser } from "../../entities/user";
import type { SpotifyProfile } from "../../entities/user";
import { clearTokens } from "../../shared/API/spotifyAuth";
import { Search } from "../../shared/UI/Search";
import { ProfileMenu } from "./profileMenu";
import { Button } from "../../shared/UI/Button";
import styles from "./header.module.css";

export const Header = () => {
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setIsProfileLoading(true);
        setProfileError(null);

        const profileData = await getCurrentUser(controller.signal);

        setProfile(profileData);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to load profile";

        setProfileError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      controller.abort();
    };
  }, []);

  const handleSearch = (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen((previousValue) => !previousValue);
  };

  const handleLogout = () => {
    clearTokens();
    setIsProfileMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const profileImage = profile?.images[0]?.url;

  const profileName = profile?.display_name || "Profile";

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={Logo} alt="SpLight Logo" className={styles.logoSvg} />
        SpotifyLight
      </Link>

      <Search
        className={styles.search}
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        placeholder="What do you want to play?"
        ariaLabel="Search Spotify"
      />

      <div className={styles.profileWrapper}>
        <Button
          type="button"
          variant="ghost"
          className={styles.profile}
          onClick={handleProfileClick}
          ariaLabel="Open profile menu"
          ariaExpanded={isProfileMenuOpen}
          ariaHaspopup
        >
          {profileImage ? (
            <img src={profileImage} alt="" className={styles.profileAvatar} />
          ) : (
            <User size={20} />
          )}

          <span>{isProfileLoading ? "Loading..." : profileName}</span>
        </Button>

        {isProfileMenuOpen && (
          <ProfileMenu
            profile={profile}
            isLoading={isProfileLoading}
            error={profileError}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
};
