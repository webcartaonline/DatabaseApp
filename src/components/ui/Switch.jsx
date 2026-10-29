/** Interruptor si/no con su texto al lado; lo comparten Casilla, Activador y Pagina web. */
export default function Switch({ on, label, onToggle }) {
  return (
    <div className="lt-val">
      <button
        type="button"
        className={`lt-switch${on ? " is-on" : ""}`}
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
      >
        <span />
      </button>
      <span className="lt-switch-label">{on ? "Sí" : "No"}</span>
    </div>
  );
}
