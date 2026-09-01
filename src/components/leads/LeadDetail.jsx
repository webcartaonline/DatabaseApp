import { useState } from "react";
import { createField } from "../../lib/leads.js";
import { formatDate } from "../../lib/format.js";
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

  const handleCreateField = (typeId, label, options) => {
    onAddField(createField(typeId, label, options));
    setSheetOpen(false);
  };

  return (
    <>
      <header className="lt-top">
        <div className="lt-top-inner">
          <div className="lt-bar">
            <button type="button" className="lt-iconbtn" onClick={onBack} aria-label="Volver al listado">
              <Icon name="back" />
            </button>
            <div className="lt-grow lt-truncate lt-sub">{lead.name || "Sin nombre"}</div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="lt-shell">
        <div className="lt-detail-head">
          <input
            className="lt-name-input"
            value={lead.name}
            placeholder="Nombre del local"
            aria-label="Nombre del negocio"
            onChange={(event) => onRename(event.target.value)}
          />
          <div className="lt-sub">Anadido el {formatDate(lead.createdAt)}</div>
        </div>

        <section className="lt-section">
          <h2 className="lt-section-title">Informacion</h2>

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
              Este negocio no tiene campos. Anade el primero para empezar a guardar datos.
            </div>
          )}

          <button type="button" className="lt-btn lt-btn-ghost lt-btn-full lt-section" onClick={() => setSheetOpen(true)}>
            <Icon name="plus" size={17} />
            Anadir campo
          </button>
        </section>

        <section className="lt-section-danger">
          {confirming ? (
            <div className="lt-panel">
              <div className="lt-panel-text">
                Se eliminara &laquo;{lead.name || "este negocio"}&raquo; y todos sus campos.
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
      </main>

      {sheetOpen && <NewFieldSheet onClose={() => setSheetOpen(false)} onCreate={handleCreateField} />}
    </>
  );
}
