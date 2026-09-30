import { DEFAULT_STATUSES, LEGACY_DEFAULT_STATUSES } from "../../constants/fieldTypes.js";
import OptionSelect from "./OptionSelect.jsx";

/** Desplegable de estado con punto de color. */
export default function StatusValue({ field, onChange }) {
  // Los campos creados con la lista por defecto antigua muestran la actual.
  const custom =
    field.options &&
    field.options.length &&
    field.options.join("|") !== LEGACY_DEFAULT_STATUSES.join("|");
  const options = custom ? field.options : DEFAULT_STATUSES;

  return (
    <div className="lt-val">
      <OptionSelect
        value={field.value}
        options={options}
        label={field.label}
        placeholder="Sin estado"
        onChange={onChange}
      />
    </div>
  );
}
