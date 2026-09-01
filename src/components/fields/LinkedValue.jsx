import { typeOf } from "../../constants/fieldTypes.js";
import { hrefFor } from "../../lib/links.js";
import Icon from "../ui/Icon.jsx";

const ACTION_ICONS = { address: "pin", link: "external", email: "mail", phone: "phone" };
const ACTION_LABELS = {
  address: "Abrir en Google Maps",
  link: "Abrir enlace",
  email: "Escribir correo",
  phone: "Llamar",
};
const INPUT_MODES = { phone: "tel", email: "email" };

/** Direccion, enlace, email y telefono: texto editable + boton que lo abre. */
export default function LinkedValue({ field, onChange }) {
  const type = typeOf(field.type);
  const href = hrefFor(field.type, field.value);
  const iconName = ACTION_ICONS[field.type] || "external";
  const actionLabel = ACTION_LABELS[field.type] || "Abrir";

  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="text"
        inputMode={INPUT_MODES[field.type] || "text"}
        value={field.value || ""}
        placeholder={type.placeholder || "Sin valor"}
        aria-label={field.label}
        onChange={(event) => onChange(event.target.value)}
      />
      {href ? (
        <a
          className="lt-open"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={actionLabel}
          aria-label={actionLabel}
        >
          <Icon name={iconName} size={17} />
        </a>
      ) : (
        <span className="lt-open is-off" aria-hidden="true">
          <Icon name={iconName} size={17} />
        </span>
      )}
    </div>
  );
}
