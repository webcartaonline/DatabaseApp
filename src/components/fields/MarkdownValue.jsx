import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { typeOf } from "../../constants/fieldTypes.js";
import { useAutoGrow } from "../../hooks/useAutoGrow.js";

/** Los enlaces del texto se abren fuera de la app para no perder la ficha. */
const MARKDOWN_COMPONENTS = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

/**
 * Texto largo con formato Markdown. Se lee ya formateado; al tocarlo pasa a
 * modo edicion con un area que crece con el contenido.
 */
export default function MarkdownValue({ field, label, onChange }) {
  const ref = useRef(null);
  const text = field.value || "";
  const [editing, setEditing] = useState(false);
  const showEditor = editing || !text.trim();

  useAutoGrow(ref, text, showEditor);

  const startEditing = (event) => {
    // Pulsar un enlace lo abre; no debe abrir tambien el editor.
    if (event.target.closest("a")) return;
    setEditing(true);
  };

  if (showEditor) {
    return (
      <div className="lt-val lt-val-col">
        <textarea
          ref={ref}
          rows={3}
          className="lt-val-input lt-textarea"
          value={text}
          autoFocus={editing}
          placeholder={typeOf("text").placeholder}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => setEditing(false)}
        />
        <p className="lt-md-hint">
          **negrita** · *cursiva* · # Título · - lista · [texto](enlace)
        </p>
      </div>
    );
  }

  return (
    <div
      className="lt-val lt-md"
      role="button"
      tabIndex={0}
      aria-label={`Editar ${label}`}
      onClick={startEditing}
      onKeyDown={(event) => {
        if (event.key === "Enter") setEditing(true);
      }}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
        {text}
      </Markdown>
    </div>
  );
}
