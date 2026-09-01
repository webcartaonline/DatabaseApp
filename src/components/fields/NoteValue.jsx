import { useEffect, useRef } from "react";
import { typeOf } from "../../constants/fieldTypes.js";

/** Nota larga: el area de texto crece con el contenido. */
export default function NoteValue({ field, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [field.value]);

  return (
    <div className="lt-val">
      <textarea
        ref={ref}
        rows={1}
        className="lt-val-input lt-textarea"
        value={field.value || ""}
        placeholder={typeOf("note").placeholder}
        aria-label={field.label}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
