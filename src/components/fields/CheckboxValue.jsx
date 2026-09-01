/** Casilla si/no con aspecto de interruptor. */
export default function CheckboxValue({ field, onChange }) {
  const isOn = field.value === true;

  return (
    <div className="lt-val">
      <button
        type="button"
        className={`lt-switch${isOn ? " is-on" : ""}`}
        role="switch"
        aria-checked={isOn}
        aria-label={field.label}
        onClick={() => onChange(!isOn)}
      >
        <span />
      </button>
      <span className="lt-switch-label">{isOn ? "Si" : "No"}</span>
    </div>
  );
}
