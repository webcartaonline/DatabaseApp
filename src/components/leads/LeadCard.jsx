import { useTheme } from "../../context/ThemeContext.jsx";
import { findField, isFilled } from "../../lib/leads.js";
import { statusColor } from "../../lib/statusColor.js";
import StatusBadge from "../ui/StatusBadge.jsx";

/** Iniciales del negocio para el circulo de la izquierda. */
const leadInitials = (name) => {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  const long = words.filter((word) => word.length > 2);
  const picked = (long.length ? long : words).slice(0, 2);
  return picked.map((word) => word[0]).join("") || "?";
};

/** Resumen de un negocio en el listado. */
export default function LeadCard({ lead, onOpen }) {
  const { theme } = useTheme();
  const address = findField(lead, "address");
  const status = findField(lead, "status");
  const filled = lead.fields.filter(isFilled).length;
  const color = status ? statusColor(status.value, theme) : null;

  return (
    <button type="button" className="lt-card" onClick={() => onOpen(lead.id)}>
      <span
        className="lt-avatar"
        style={color ? { background: color.bg, color: color.text } : { background: "var(--surface-2)", color: "var(--muted)" }}
      >
        {leadInitials(lead.name)}
      </span>

      <span className="lt-card-body lt-grow">
        <span className="lt-card-name lt-truncate">{lead.name || "Sin nombre"}</span>
        {address && <span className="lt-card-meta lt-truncate">{address.value}</span>}
        <span className="lt-count">
          {filled} de {lead.fields.length} campos con datos
        </span>
      </span>

      {status && <StatusBadge value={status.value} />}
    </button>
  );
}
