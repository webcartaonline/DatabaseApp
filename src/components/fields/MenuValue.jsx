import { MENU_KINDS } from "../../constants/fieldTypes.js";
import { menuValue } from "../../lib/leads.js";
import Switch from "../ui/Switch.jsx";
import OptionSelect from "./OptionSelect.jsx";

/**
 * Activador: interruptor que, al encenderse, despliega su lista de opciones.
 * Al apagarlo la lista se esconde, pero la opcion elegida se conserva por si
 * se vuelve a encender.
 */
export default function MenuValue({ field, label, onChange }) {
  const { on, kind } = menuValue(field.value);
  const options = field.options && field.options.length ? field.options : MENU_KINDS;

  return (
    <div className="lt-val-stack">
      <Switch on={on} label={label} onToggle={() => onChange({ on: !on, kind })} />

      {on && (
        <OptionSelect
          value={kind}
          options={options}
          label={`Opción de ${label}`}
          placeholder="Sin especificar"
          onChange={(next) => onChange({ on: true, kind: next })}
        />
      )}
    </div>
  );
}
