import { hrefFor } from "../../lib/links.js";
import Icon from "../ui/Icon.jsx";

const ACTION_ICONS = { address: "pin", link: "external", email: "mail", phone: "phone" };
const ACTION_LABELS = {
  address: "Abrir en Google Maps",
  link: "Abrir enlace",
  email: "Escribir correo",
  phone: "Llamar",
};
const INPUT_MODES = { phone: "tel", email: "email", link: "url" };

/** Texto editable + boton redondo que lo abre (mapa, web, correo o llamada). */
export default function LinkInput({ type, value, label, placeholder, onChange }) {
  const href = hrefFor(type, value);
  const iconName = ACTION_ICONS[type] || "external";
  const actionLabel = ACTION_LABELS[type] || "Abrir";

  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="text"
        inputMode={INPUT_MODES[type] || "text"}
        value={value || ""}
        placeholder={placeholder || "Sin valor"}
        aria-label={label}
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
