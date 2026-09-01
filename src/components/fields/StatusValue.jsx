import { DEFAULT_STATUSES } from "../../constants/fieldTypes.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { statusColor } from "../../lib/statusColor.js";
import Icon from "../ui/Icon.jsx";

/** Desplegable de estado con punto de color. */
export default function StatusValue({ field, onChange }) {
  const { theme } = useTheme();
  const base = field.options && field.options.length ? field.options : DEFAULT_STATUSES;
  // Si el valor guardado ya no esta en la lista, se muestra igualmente.
  const options = field.value && !base.includes(field.value) ? [field.value, ...base] : base;
  const color = statusColor(field.value, theme);

  return (
    <div className="lt-val">
      <div className="lt-select-wrap">
        <span className="lt-dot" style={{ background: field.value ? color.solid : "var(--border-strong)" }} />
        <select
          className="lt-select"
          value={field.value || ""}
          aria-label={field.label}
          style={{ color: field.value ? color.text : "var(--faint)" }}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Sin estado</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="lt-select-chev">
          <Icon name="down" size={16} />
        </span>
      </div>
    </div>
  );
}
