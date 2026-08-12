// import type { FC } from "react";
// import styles from "./Input.module.css";

// interface InputProps {
//   type?: "text" | "search";
//   name?: string;
//   value?: string;
//   placeholder?: string;
//   label?: string;
//   error?: string;
//   disabled?: boolean;
//   required?: boolean;
//   fullWidth?: boolean;
//   onChange?: (value: string) => void;
// }

// export const Input: FC<InputProps> = ({
//   type = "text",
//   name,
//   value = "",
//   placeholder,
//   label,
//   error,
//   disabled = false,
//   required = false,
//   fullWidth = false,
//   onChange,
// }) => {
//   const inputClassName = [
//     // Здесь создается строка с CSS-классами :берем базовый класс styles.input.Смотрим на error. Если ошибка есть (true), добавляем класс ошибки styles.error. Если нет — добавляем пустую строку "".Смотрим на fullWidth. Если инпут должен быть на всю ширину, добавляем класс styles.fullWidth..filter(Boolean) — очень полезный метод. Он удаляет из массива все пустые строки "", оставляя только работающие классы..join(" ") — склеивает массив в одну готовую строчку через пробел (например, получится "input error fullWidth").
//     styles.input,
//     error ? styles.error : "",
//     fullWidth ? styles.fullWidth : "",
//   ]
//     .filter(Boolean)
//     .join(" ");
  
//   return (
//     <div
//       className={[styles.wrapper, fullWidth ? styles.fullWidth : ""]
//         .filter(Boolean)
//         .join(" ")}
//     >
//       {label && (
//         <label className={styles.label} htmlFor={name}>
//           {label}
//         </label>
//       )}

//       <input
//         id={name}
//         className={inputClassName}
//         type={type}
//         name={name}
//         value={value}
//         placeholder={placeholder}
//         disabled={disabled}
//         required={required}
//         onChange={(event) => onChange?.(event.target.value)}
//       />

//       {error && <span className={styles.errorMessage}>{error}</span>}
//     </div>
//   );
// };
