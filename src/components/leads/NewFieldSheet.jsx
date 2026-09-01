import { useState } from "react";
import { FIELD_TYPES, typeOf } from "../../constants/fieldTypes.js";
import Icon from "../ui/Icon.jsx";
import Sheet from "../ui/Sheet.jsx";

/** Elegir tipo de dato, ponerle nombre y, si tiene lista, definir sus opciones. */
export default function NewFieldSheet({ onClose, onCreate }) {
  const [typeId, setTypeId] = useState("text");
  const [label, setLabel] = useState(typeOf("text").label);
  const [labelTouched, setLabelTouched] = useState(false);
  const [optionsText, setOptionsText] = useState(typeOf("status").options.join("\n"));
  const [optionsTouched, setOptionsTouched] = useState(false);

  const hasOptions = Boolean(typeOf(typeId).options);

  // El nombre y las opciones siguen al tipo elegido mientras no se toquen a mano.
  const selectType = (id) => {
    const type = typeOf(id);
    setTypeId(id);
    if (!labelTouched) setLabel(type.label);
    if (!optionsTouched && type.options) setOptionsText(type.options.join("\n"));
  };

  const submit = () => {
    const options = optionsText
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);

    onCreate(typeId, label.trim() || typeOf(typeId).label, options);
  };

  return (
    <Sheet title="Nuevo campo" onClose={onClose}>
      <div className="lt-field-group">
        <span className="lt-label">Tipo de dato</span>
        <div className="lt-types">
          {FIELD_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`lt-type${type.id === typeId ? " is-active" : ""}`}
              aria-pressed={type.id === typeId}
              onClick={() => selectType(type.id)}
            >
              <Icon name={type.icon} size={19} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lt-field-group">
        <label className="lt-label" htmlFor="new-field-label">
          Nombre del campo
        </label>
        <input
          id="new-field-label"
          className="lt-input"
          value={label}
          placeholder="Horario, Responsable, Presupuesto..."
          onChange={(event) => {
            setLabel(event.target.value);
            setLabelTouched(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !hasOptions) submit();
          }}
        />
      </div>

      {hasOptions && (
        <div className="lt-field-group">
          <label className="lt-label" htmlFor="new-field-options">
            Opciones, una por linea
          </label>
          <textarea
            id="new-field-options"
            className="lt-input lt-input-area"
            value={optionsText}
            onChange={(event) => {
              setOptionsText(event.target.value);
              setOptionsTouched(true);
            }}
          />
          <p className="lt-hint">Cada opcion recibe su propio color automaticamente.</p>
        </div>
      )}

      <button type="button" className="lt-btn lt-btn-primary lt-btn-full" onClick={submit}>
        Anadir campo
      </button>
    </Sheet>
  );
}
