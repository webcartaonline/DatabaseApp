import { useState } from "react";
import { createField, findField, isFilled } from "../../lib/leads.js";
import { formatDate } from "../../lib/format.js";
import { mapsUrl } from "../../lib/links.js";
import FieldRow from "../fields/FieldRow.jsx";
import Icon from "../ui/Icon.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import NewFieldSheet from "./NewFieldSheet.jsx";

/** Ficha completa de un negocio: nombre, campos y borrado. */
export default function LeadDetail({
  lead,
  onBack,
  onRename,
  onAddField,
  onPatchField,
  onMoveField,
  onDeleteField,
  onDelete,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const filled = lead.fields.filter(isFilled).length;
  const total = lead.fields.length;
  const percent = total ? Math.round((filled / total) * 100) : 0;
  const address = findField(lead, "address");
  const mapsHref = address ? mapsUrl(address.value) : "";

  const handleCreateField = (typeId, label, options) => {
    onAddField(createField(typeId, label, options));
    setSheetOpen(false);
  };

  return (
    <div className={mapsHref ? "lt-has-fab" : undefined}>
      <header className="lt-hero">
        <div className="lt-hero-inner">
          <div className="lt-bar">
            <button type="button" className="lt-iconbtn" onClick={onBack} aria-label="Volver al listado">
              <Icon name="back" size={20} />
            </button>
            <div className="lt-grow lt-detail-title">
              <input
                className="lt-name-input"
                value={lead.name}
                placeholder="Nombre del local"
                aria-label="Nombre del negocio"
                onChange={(event) => onRename(event.target.value)}
              />
              <div className="lt-sub">Añadido el {formatDate(lead.createdAt)}</div>
            </div>
            <ThemeToggle />
          </div>

          <div className="lt-progress">
            <div className="lt-progress-row">
              <div>
                <div className="lt-progress-l">Información completada</div>
                <div className="lt-progress-n">{percent}%</div>
              </div>
              <div className="lt-progress-l">
                {filled} de {total} campos con datos
              </div>
            </div>
            <div className="lt-progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="lt-stage">
        <div className="lt-shell">
          <div className="lt-section-head">
            <h2 className="lt-section-title">Información</h2>
          </div>

          {lead.fields.length > 0 ? (
            <div className="lt-fields">
              {lead.fields.map((field, index) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  isFirst={index === 0}
                  isLast={index === lead.fields.length - 1}
                  onChange={(value) => onPatchField(field.id, { value })}
                  onRename={(label) => onPatchField(field.id, { label })}
                  onMove={(offset) => onMoveField(field.id, offset)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
            </div>
          ) : (
            <div className="lt-panel lt-panel-text">
              Este negocio no tiene campos. Añade el primero para empezar a guardar datos.
            </div>
          )}

          <button type="button" className="lt-btn lt-btn-ghost lt-btn-full lt-section" onClick={() => setSheetOpen(true)}>
            <Icon name="plus" size={18} />
            Añadir campo
          </button>

          <section className="lt-section-danger">
            {confirming ? (
              <div className="lt-panel">
                <div className="lt-panel-text">
                  Se eliminará &laquo;{lead.name || "este negocio"}&raquo; y todos sus campos.
                </div>
                <div className="lt-row">
                  <button type="button" className="lt-btn lt-btn-ghost lt-grow" onClick={() => setConfirming(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="lt-btn lt-btn-danger lt-grow" onClick={onDelete}>
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="lt-btn lt-btn-danger lt-btn-full" onClick={() => setConfirming(true)}>
                <Icon name="trash" size={17} />
                Eliminar negocio
              </button>
            )}
          </section>
        </div>
      </main>

      {mapsHref && (
        <a className="lt-fab" href={mapsHref} target="_blank" rel="noopener noreferrer">
          <span className="lt-ring">
            <Icon name="pin" size={18} />
          </span>
          Abrir en Google Maps
        </a>
      )}

      {sheetOpen && <NewFieldSheet onClose={() => setSheetOpen(false)} onCreate={handleCreateField} />}
    </div>
  );
}
