import { type FC } from "react";
import styles from "./HomePage.module.css";

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";

  return "Good night";
};

const HomePage: FC = () => {
  return (
    <section className={styles.home}>
      <h1>{getGreeting()}</h1>

      <p>Discover your favorite music.</p>
    </section>
  );
};

export default HomePage;
