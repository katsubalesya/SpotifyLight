import { type FC } from "react";
import styles from "./homePage.module.css";
import { useHomeContent } from "../../features/homeContent/model/useHomeContent";
import HomeSection from "../../features/homeContent/ui/homeSection";

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";

  return "Good night";
};

const HomePage: FC = () => {
  const { content, isLoading, error } = useHomeContent();

  if (isLoading) {
    return <p>Loading recommendations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className={styles.home}>
      <h1>{getGreeting()}</h1>

      <p>Discover your favorite music.</p>

      <HomeSection title="Global playlists" items={content?.playlists ?? []} />

      <HomeSection title="Popular artists" items={content?.artists ?? []} />

      <HomeSection title="Popular podcasts" items={content?.podcasts ?? []} />

      <HomeSection title="New albums" items={content?.albums ?? []} />
    </section>
  );
};

export default HomePage;
