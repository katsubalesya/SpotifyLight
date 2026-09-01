import { type FC } from "react";
import styles from "./homeSection.module.css";
import type { HomeCardItem } from "../model/mapHomeContent";
import HomeCard from "./homeCard";

type HomeSectionProps = {
  title: string;
  items: HomeCardItem[];
};

const HomeSection: FC<HomeSectionProps> = ({ title, items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.cards}>
        {items.map((item) => (
          <HomeCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
};

export default HomeSection;