import { typeOf } from "../../constants/fieldTypes.js";

/** Persona (y el antiguo Numero): un input de una linea con el teclado adecuado. */
export default function TextValue({ field, label, onChange }) {
  const type = typeOf(field.type);

  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="text"
        inputMode={field.type === "number" ? "decimal" : "text"}
        value={field.value || ""}
        placeholder={type.placeholder || "Sin valor"}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
