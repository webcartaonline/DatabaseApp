import { useEffect } from "react";
import Icon from "./Icon.jsx";

/**
 * Panel inferior en movil y dialogo centrado en pantallas grandes.
 * Se cierra con Escape o tocando fuera, y bloquea el scroll de fondo.
 */
export default function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="lt-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lt-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="lt-grab" />
        <div className="lt-sheet-head">
          <div className="lt-sheet-title lt-grow">{title}</div>
          <button type="button" className="lt-iconbtn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
