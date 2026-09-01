import CheckboxValue from "./CheckboxValue.jsx";
import DateValue from "./DateValue.jsx";
import LinkedValue from "./LinkedValue.jsx";
import MenuValue from "./MenuValue.jsx";
import NoteValue from "./NoteValue.jsx";
import RatingValue from "./RatingValue.jsx";
import StatusValue from "./StatusValue.jsx";
import TextValue from "./TextValue.jsx";

const LINKED_TYPES = ["phone", "email", "link", "address"];

/** Decide que componente pinta cada tipo de campo. */
export default function FieldValue({ field, onChange }) {
  if (LINKED_TYPES.includes(field.type)) return <LinkedValue field={field} onChange={onChange} />;

  switch (field.type) {
    case "note":
      return <NoteValue field={field} onChange={onChange} />;
    case "date":
      return <DateValue field={field} onChange={onChange} />;
    case "checkbox":
      return <CheckboxValue field={field} onChange={onChange} />;
    case "menu":
      return <MenuValue field={field} onChange={onChange} />;
    case "rating":
      return <RatingValue field={field} onChange={onChange} />;
    case "status":
      return <StatusValue field={field} onChange={onChange} />;
    default:
      return <TextValue field={field} onChange={onChange} />;
  }
}
