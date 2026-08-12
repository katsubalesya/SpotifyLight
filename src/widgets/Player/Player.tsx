import {
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import styles from "./Player.module.css";

export const Player = () => {
  return (
    <footer className={styles.player}>
      <div className={styles.track}>
        <div className={styles.cover}>
          <span>♪</span>
        </div>

        <div>
          <p className={styles.title}>
            No track selected
          </p>

          <p className={styles.artist}>
            Choose a song to start listening
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button>
            <SkipBack size={20} />
          </button>

          <button className={styles.play}>
            <Play size={20} fill="currentColor" />
          </button>

          <button>
            <SkipForward size={20} />
          </button>
        </div>

        <div className={styles.progress}>
          <span>0:00</span>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="0"
          />

          <span>0:00</span>
        </div>
      </div>

      <div className={styles.volume}>
        <Volume2 size={20} />

        <input
          type="range"
          min="0"
          max="100"
          defaultValue="70"
        />
      </div>
    </footer>
  );
};