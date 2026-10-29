import { typeOf } from "../../constants/fieldTypes.js";
import { websiteValue } from "../../lib/leads.js";
import Switch from "../ui/Switch.jsx";
import LinkInput from "./LinkInput.jsx";

/**
 * Pagina web: interruptor "tiene web" que, al encenderse, pide la direccion
 * con un boton para abrirla. Apagarlo no borra la direccion escrita.
 */
export default function WebsiteValue({ field, label, onChange }) {
  const { on, url } = websiteValue(field.value);

  return (
    <div className="lt-val-stack">
      <Switch on={on} label={label} onToggle={() => onChange({ on: !on, url })} />

      {on && (
        <LinkInput
          type="link"
          value={url}
          label={`Dirección de ${label}`}
          placeholder={typeOf("website").placeholder}
          onChange={(next) => onChange({ on: true, url: next })}
        />
      )}
    </div>
  );
}
