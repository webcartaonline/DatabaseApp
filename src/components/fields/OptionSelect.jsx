import { useTheme } from "../../context/ThemeContext.jsx";
import { statusColor } from "../../lib/statusColor.js";
import Icon from "../ui/Icon.jsx";

/** Desplegable con punto de color; lo comparten Estado y Carta en Maps. */
export default function OptionSelect({ value, options, label, placeholder, onChange }) {
  const { theme } = useTheme();
  // Si el valor guardado ya no esta en la lista, se muestra igualmente.
  const list = value && !options.includes(value) ? [value, ...options] : options;
  const color = statusColor(value, theme);

  return (
    <div className="lt-select-wrap">
      <span className="lt-dot" style={{ background: value ? color.solid : "var(--border-strong)" }} />
      <select
        className="lt-select"
        value={value || ""}
        aria-label={label}
        style={{ color: value ? color.text : "var(--faint)" }}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {list.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="lt-select-chev">
        <Icon name="down" size={16} />
      </span>
    </div>
  );
}
