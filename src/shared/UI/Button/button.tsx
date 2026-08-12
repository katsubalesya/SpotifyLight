import type { FC, PropsWithChildren } from "react";
import styles from "./Button.module.css";

interface IButtonProps extends PropsWithChildren {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: FC<IButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
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
    >
      {children}
    </button>
  );
};