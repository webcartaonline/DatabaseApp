import { useState } from "react";
import { typeOf } from "../../constants/fieldTypes.js";
import Icon from "../ui/Icon.jsx";
import FieldValue from "./FieldValue.jsx";

/**
 * Una fila de la ficha: etiqueta, valor y menu con renombrar, mover y borrar.
 * El borrado pide confirmacion en la propia fila, sin dialogos del navegador.
 */
export default function FieldRow({ field, isFirst, isLast, onChange, onRename, onMove, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [draftLabel, setDraftLabel] = useState(field.label);

  const startRename = () => {
    setDraftLabel(field.label);
    setRenaming(true);
    setConfirming(false);
  };

  const commitRename = () => {
    const next = draftLabel.trim();
    if (next && next !== field.label) onRename(next);
    setRenaming(false);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    setConfirming(false);
  };

  return (
    <div className="lt-field">
      <div className="lt-field-head">
        <Icon name={typeOf(field.type).icon} size={15} />

        {renaming ? (
          <input
            className="lt-field-label-input"
            value={draftLabel}
            autoFocus
            aria-label="Nombre del campo"
            onChange={(event) => setDraftLabel(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitRename();
              if (event.key === "Escape") setRenaming(false);
            }}
          />
        ) : (
          <span className="lt-field-label lt-grow lt-truncate">{field.label}</span>
        )}

        {!renaming && (
          <button
            type="button"
            className={`lt-mini${menuOpen ? " is-on" : ""}`}
            aria-label={`Opciones de ${field.label}`}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <Icon name="dots" size={16} />
          </button>
        )}
      </div>

      <FieldValue field={field} onChange={onChange} />

      {menuOpen && !confirming && (
        <div className="lt-field-actions">
          <button type="button" className="lt-mini" title="Renombrar" aria-label="Renombrar campo" onClick={startRename}>
            <Icon name="pencil" size={16} />
          </button>
          <button
            type="button"
            className="lt-mini"
            title="Subir"
            aria-label="Subir campo"
            disabled={isFirst}
            onClick={() => onMove(-1)}
          >
            <Icon name="up" size={16} />
          </button>
          <button
            type="button"
            className="lt-mini"
            title="Bajar"
            aria-label="Bajar campo"
            disabled={isLast}
            onClick={() => onMove(1)}
          >
            <Icon name="down" size={16} />
          </button>
          <div className="lt-grow" />
          <button
            type="button"
            className="lt-mini is-danger"
            title="Eliminar"
            aria-label="Eliminar campo"
            onClick={() => setConfirming(true)}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      )}

      {menuOpen && confirming && (
        <div className="lt-confirm">
          <span>&iquest;Eliminar este campo?</span>
          <button type="button" className="lt-link-btn" onClick={() => setConfirming(false)}>
            Cancelar
          </button>
          <button type="button" className="lt-link-btn is-danger" onClick={onDelete}>
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
