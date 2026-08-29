import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { PageHeader } from "../../entities/pageHeader/pageHeader";
import { TrackList } from "../../entities/trackList/ui/trackList";
import type { TrackRow } from "../../entities/trackrow/model/types";
import { usePlayer } from "../../widgets/Player/playerContext";

import styles from "./PodcastPage.module.css";
import { spotifyFetch } from "../../shared/API/fetchRequest";
import type { SpotifyShow } from "../../entities/podcast/api/types";
import { PageContainer } from "../../shared/UI/pageContainer";

const PodcastPage = () => {
  const { showId } = useParams();

  const [podcast, setPodcast] = useState<SpotifyShow | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  useEffect(() => {
    if (!showId) {
      setError("Failed to retrieve podcast data.");
      setIsLoading(false);
      return;
    }

    const loadPodcast = async () => {
      try {
        setIsLoading(true);
        setError("");

        const showUri = `spotify:show:${showId}`;

        const [podcastData, savedData] = await Promise.all([
          spotifyFetch<SpotifyShow>(`/shows/${showId}`),
          spotifyFetch<boolean[]>(`/me/library/contains?uris=${encodeURIComponent(showUri)}`),
        ]);

        setPodcast(podcastData);
        setIsSaved(savedData[0] ?? false);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to load podcast. Try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPodcast();
  }, [showId]);

  const episodes = useMemo<TrackRow[]>(() => {
    if (!podcast) return [];

    return podcast.episodes.items.map((episode) => ({
      id: episode.id,
      title: episode.name,
      artists: ["Podcast"],
      album: episode.release_date,
      imageUrl: episode.images[0]?.url ?? podcast.images[0]?.url ?? null,
      durationMs: episode.duration_ms,
      previewUrl: episode.audio_preview_url,
    }));
  }, [podcast]);

  const handleEpisodePlay = (episode: TrackRow) => {
    playTrack(episode, episodes);
  };

  const handlePodcastPlay = () => {
    const firstEpisode = episodes[0];

    if (!firstEpisode) return;

    const currentPodcastIsPlaying = episodes.some(
      (episode) => episode.id === currentTrack?.id,
    );

    if (currentPodcastIsPlaying) {
      togglePlay();
    } else {
      playTrack(firstEpisode, episodes);
    }
  };

  const handleSavePodcast = async () => {
    if (!showId) return;

    try {
      const showUri = `spotify:show:${showId}`;
      await spotifyFetch<void>(`/me/library?uris=${encodeURIComponent(showUri)}`, {
        method: isSaved ? "DELETE" : "PUT",
      });

      setIsSaved((value) => !value);
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to update saved podcasts.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !podcast) {
    return <div>{error || "Podcast not found."}</div>;
  }

  return (
    <PageContainer>
      <PageHeader
        type="podcast"
        title={podcast.name}
        imageUrl={podcast.images[0]?.url}
        description={podcast.description}
        // meta={[podcast.publisher, `${podcast.total_episodes} episodes`]}
        isPlaying={
          isPlaying && episodes.some(({ id }) => id === currentTrack?.id)
        }
        isSaved={isSaved}
        onPlay={handlePodcastPlay}
        onSave={handleSavePodcast}
      />

      <PageContainer.Content>
        <h2 className={styles.heading}>Episodes</h2>
        <TrackList
          tracks={episodes}
          currentTrackId={isPlaying ? currentTrack?.id : undefined}
          onTrackPlay={handleEpisodePlay}
          emptyMessage="This podcast doesn't have any episodes yet."
        />
      </PageContainer.Content>
    </PageContainer>
  );
};

export default PodcastPage;
