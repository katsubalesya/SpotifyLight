import styles from "./PlayerSidebar.module.css";

export const PlayerSidebar = () => {
  return (
    <aside className={styles.plsidebar}>
      <nav>
        <ul className={styles.navigation}>

          <li>
            <span>Your current Player </span>
          </li>

        </ul>
      </nav>
    </aside>
  );
};