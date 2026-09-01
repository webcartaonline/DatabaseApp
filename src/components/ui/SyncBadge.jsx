const LABELS = {
  idle: "Solo en este dispositivo",
  syncing: "Sincronizando",
  synced: "Al dia",
  offline: "Sin conexion",
  unauthorized: "Clave incorrecta",
};

/** Estado de la sincronizacion en una linea. Tocarlo fuerza un reintento. */
export default function SyncBadge({ status, onRetry }) {
  return (
    <button
      type="button"
      className={`lt-sync is-${status}`}
      onClick={onRetry}
      aria-label={`Sincronizacion: ${LABELS[status] || status}`}
    >
      <span className="lt-sync-dot" aria-hidden="true" />
      {LABELS[status] || status}
    </button>
  );
}
