import { typeOf } from "../../constants/fieldTypes.js";
import CopyButton from "../ui/CopyButton.jsx";

/** Nota corta, de alto fijo y sin formato, con un boton para copiarla. */
export default function NoteValue({ field, label, onChange }) {
  return (
    <div className="lt-val">
      <textarea
        rows={2}
        className="lt-val-input lt-textarea lt-note"
        value={field.value || ""}
        placeholder={typeOf("note").placeholder}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
      <CopyButton text={field.value} label={`Copiar ${label}`} />
    </div>
  );
}
