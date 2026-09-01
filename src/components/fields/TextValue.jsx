import { typeOf } from "../../constants/fieldTypes.js";

/** Texto, persona, numero e importe: un input con el teclado adecuado. */
export default function TextValue({ field, onChange }) {
  const type = typeOf(field.type);
  const isNumeric = field.type === "number" || field.type === "money";

  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="text"
        inputMode={isNumeric ? "decimal" : "text"}
        value={field.value || ""}
        placeholder={type.placeholder || "Sin valor"}
        aria-label={field.label}
        onChange={(event) => onChange(event.target.value)}
      />
      {field.type === "money" && <span className="lt-suffix">&euro;</span>}
    </div>
  );
}
