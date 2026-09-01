import { type FC } from "react";
import styles from "./homeCard.module.css";
import type { HomeCardItem } from "../model/mapHomeContent";
import { Link } from "react-router-dom";

type HomeCardProps = {
  item: HomeCardItem;
};

const HomeCard: FC<HomeCardProps> = ({ item }) => {
  const imageAlt = `${item.name} ${item.type}`;

  return (
    <article className={styles.card}>
      <Link className={styles.link} to={item.to}>
        <div className={styles.imageWrapper}>
          {item.imageUrl ? (
            <img
              className={styles.image}
              src={item.imageUrl}
              alt={imageAlt}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              ♪
            </div>
          )}
        </div>

        <h3 className={styles.title}>{item.name}</h3>

        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </Link>
    </article>
  );
};

export default HomeCard;
