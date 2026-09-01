import { useTheme } from "../../context/ThemeContext.jsx";
import { statusColor } from "../../lib/statusColor.js";

export default function StatusBadge({ value }) {
  const { theme } = useTheme();
  const color = statusColor(value, theme);

  return (
    <span className="lt-badge" style={{ background: color.bg, color: color.text }}>
      <span className="lt-dot" style={{ background: color.solid }} />
      {value}
    </span>
  );
}
