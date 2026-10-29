import { useState } from "react";
import { typeOf } from "../../constants/fieldTypes.js";
import { editableAmount, formatAmount } from "../../lib/money.js";

/**
 * Importe en euros. Mientras se escribe solo se ve el numero; al salir del
 * campo se guarda con formato y simbolo: "150" -> "150,00 €".
 */
export default function MoneyValue({ field, label, onChange }) {
  const [draft, setDraft] = useState(null);
  const isEditing = draft !== null;

  const commit = () => {
    onChange(formatAmount(draft));
    setDraft(null);
  };

  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="text"
        inputMode="decimal"
        value={isEditing ? draft : formatAmount(field.value)}
        placeholder={`${typeOf("money").placeholder} €`}
        aria-label={label}
        onFocus={() => setDraft(editableAmount(field.value))}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </div>
  );
}
