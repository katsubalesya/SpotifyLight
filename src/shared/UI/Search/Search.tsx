import {
  useId,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Search as SearchIcon, X } from "lucide-react";
import styles from "./search.module.css";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  variant?: "global" | "library";
}

export const Search = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search",
  ariaLabel = "Search",
  className = "",
  variant = "global",
}: SearchProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return;
    }

    onSubmit?.(normalizedValue);
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && value) {
      handleClear();
    }
  };

  return (
    <form
      className={`${styles.search} ${styles[variant]} ${className}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        {ariaLabel}
      </label>

      <SearchIcon className={styles.searchIcon} size={20} aria-hidden="true" />

      <input
        ref={inputRef}
        id={inputId}
        className={styles.input}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />

      {value && (
        <button
          className={styles.clearButton}
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </form>
  );
};
