import { useMemo } from "react";
import { pendingByCategory } from "../../lib/categories.js";
import { findField } from "../../lib/leads.js";
import Modal from "../ui/Modal.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";

const pendingLabel = (count) => (count === 1 ? "1 negocio por contactar" : `${count} negocios por contactar`);

/** Grupo de una categoria con sus negocios pendientes. */
function PendingGroup({ category, leads, active, onOpenLead }) {
  return (
    <section className={`lt-pending-group${active ? " is-active" : ""}`}>
      <div className="lt-pending-head">
        <h3 className="lt-pending-name lt-grow">{category.name}</h3>
        <span className="lt-pending-count">{leads.length}</span>
      </div>

      {leads.length === 0 ? (
        <p className="lt-pending-empty">Nada pendiente.</p>
      ) : (
        <ul className="lt-pending-list">
          {leads.map((lead) => (
            <li key={lead.id}>
              <button type="button" className="lt-pending-item" onClick={() => onOpenLead(lead)}>
                <span className="lt-grow lt-truncate">{lead.name || "Sin nombre"}</span>
                <StatusBadge value={findField(lead, "status").value} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Ventana con los negocios pendientes de todas las categorias. */
export default function PendingOverview({ leads, categories, activeId, onOpenLead, onClose }) {
  const groups = useMemo(() => pendingByCategory(leads, categories), [leads, categories]);
  const total = groups.reduce((sum, group) => sum + group.leads.length, 0);

  return (
    <Modal title="Pendientes" subtitle={`${pendingLabel(total)} en total.`} onClose={onClose}>
      <div className="lt-pending">
        {groups.map(({ category, leads: pending }) => (
          <PendingGroup
            key={category.id}
            category={category}
            leads={pending}
            active={category.id === activeId}
            onOpenLead={onOpenLead}
          />
        ))}
      </div>
    </Modal>
  );
}
