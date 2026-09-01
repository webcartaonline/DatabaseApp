import { MENU_KINDS } from "../../constants/fieldTypes.js";
import { menuValue } from "../../lib/leads.js";
import OptionSelect from "./OptionSelect.jsx";

/**
 * Interruptor de "tiene carta en Google Maps" que, al encenderse, despliega
 * la lista con el tipo de carta. Al apagarlo la lista se esconde, pero el
 * tipo elegido se conserva por si se vuelve a encender.
 */
export default function MenuValue({ field, onChange }) {
  const { on, kind } = menuValue(field.value);
  const options = field.options && field.options.length ? field.options : MENU_KINDS;

  return (
    <div className="lt-val-stack">
      <div className="lt-val">
        <button
          type="button"
          className={`lt-switch${on ? " is-on" : ""}`}
          role="switch"
          aria-checked={on}
          aria-label={field.label}
          onClick={() => onChange({ on: !on, kind })}
        >
          <span />
        </button>
        <span className="lt-switch-label">{on ? "Si" : "No"}</span>
      </div>

      {on && (
        <OptionSelect
          value={kind}
          options={options}
          label={`Tipo de ${field.label}`}
          placeholder="Sin especificar"
          onChange={(next) => onChange({ on: true, kind: next })}
        />
      )}
    </div>
  );
}
