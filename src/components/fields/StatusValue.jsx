import { DEFAULT_STATUSES } from "../../constants/fieldTypes.js";
import OptionSelect from "./OptionSelect.jsx";

/** Desplegable de estado con punto de color. */
export default function StatusValue({ field, onChange }) {
  const options = field.options && field.options.length ? field.options : DEFAULT_STATUSES;

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
