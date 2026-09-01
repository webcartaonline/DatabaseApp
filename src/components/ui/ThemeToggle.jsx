import { useTheme } from "../../context/ThemeContext.jsx";
import Icon from "./Icon.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <button type="button" className="lt-iconbtn" onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name={isDark ? "sun" : "moon"} />
    </button>
  );
}
