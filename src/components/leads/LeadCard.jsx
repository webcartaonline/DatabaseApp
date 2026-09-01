import { findField, isFilled } from "../../lib/leads.js";
import Icon from "../ui/Icon.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";

/** Resumen de un negocio en el listado. */
export default function LeadCard({ lead, onOpen }) {
  const address = findField(lead, "address");
  const status = findField(lead, "status");
  const filled = lead.fields.filter(isFilled).length;

  return (
    <button type="button" className="lt-card" onClick={() => onOpen(lead.id)}>
      <div className="lt-card-name lt-truncate">{lead.name || "Sin nombre"}</div>

      {address && (
        <div className="lt-card-meta">
          <Icon name="pin" size={14} />
          <span className="lt-truncate">{address.value}</span>
        </div>
      )}

      <div className="lt-card-foot">
        {status && <StatusBadge value={status.value} />}
        <span className="lt-count">
          {filled} de {lead.fields.length} campos con datos
        </span>
      </div>
    </button>
  );
}
