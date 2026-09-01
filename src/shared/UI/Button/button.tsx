import type { FC, PropsWithChildren } from "react";
import styles from "./button.module.css";

interface IButtonProps extends PropsWithChildren {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "icon";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaHaspopup?: boolean;
}

export const Button: FC<IButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ariaLabel,
  ariaExpanded,
  ariaHaspopup,
}) => {
  const buttonClassName = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      {children}
    </button>
  );
};
