import { typeOf } from "../../constants/fieldTypes.js";
import LinkInput from "./LinkInput.jsx";

/** Direccion, enlace, email y telefono: texto editable + boton que lo abre. */
export default function LinkedValue({ field, label, onChange }) {
  return (
    <LinkInput
      type={field.type}
      value={field.value}
      label={label}
      placeholder={typeOf(field.type).placeholder}
      onChange={onChange}
    />
  );
}
