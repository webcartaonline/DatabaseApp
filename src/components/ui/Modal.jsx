import { closeOnBackdrop, useDismiss } from "../../hooks/useDismiss.js";
import Icon from "./Icon.jsx";

/**
 * Ventana grande que ocupa casi toda la pantalla, con un margen alrededor y
 * el fondo oscurecido. La cabecera queda fija y el contenido hace scroll.
 */
export default function Modal({ title, subtitle, onClose, children }) {
  useDismiss(onClose);

  return (
    <div className="lt-overlay is-modal" onMouseDown={closeOnBackdrop(onClose)}>
      <div className="lt-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="lt-modal-head">
          <div className="lt-grow">
            <h2 className="lt-modal-title">{title}</h2>
            {subtitle && <p className="lt-modal-sub">{subtitle}</p>}
          </div>
          <button type="button" className="lt-iconbtn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" />
          </button>
        </header>
        <div className="lt-modal-body">{children}</div>
      </div>
    </div>
  );
}
