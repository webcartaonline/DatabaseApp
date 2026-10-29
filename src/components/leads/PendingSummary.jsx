import Icon from "../ui/Icon.jsx";

/**
 * Contador grande de la cabecera. El numero es un boton que abre el detalle
 * por categorias; children (el estado de sincronizacion) va aparte porque es
 * otro boton y no se pueden anidar.
 */
export default function PendingSummary({ count, onOpen, children }) {
  return (
    <div className="lt-summary">
      <button
        type="button"
        className="lt-summary-btn"
        onClick={onOpen}
        aria-label={`${count} por contactar en esta categoría. Ver todas las categorías`}
      >
        <span className="lt-summary-top">
          <span className="lt-summary-k">Por contactar</span>
          <Icon name="next" size={14} />
        </span>
        <span className="lt-summary-n">{count}</span>
        <span className="lt-summary-l">{count === 1 ? "negocio pendiente" : "negocios pendientes"}</span>
      </button>
      {children}
    </div>
  );
}
