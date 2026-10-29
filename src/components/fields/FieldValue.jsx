import CheckboxValue from "./CheckboxValue.jsx";
import DateValue from "./DateValue.jsx";
import LinkedValue from "./LinkedValue.jsx";
import MarkdownValue from "./MarkdownValue.jsx";
import MenuValue from "./MenuValue.jsx";
import MoneyValue from "./MoneyValue.jsx";
import NoteValue from "./NoteValue.jsx";
import RatingValue from "./RatingValue.jsx";
import StatusValue from "./StatusValue.jsx";
import TextValue from "./TextValue.jsx";
import WebsiteValue from "./WebsiteValue.jsx";

const COMPONENTS = {
  phone: LinkedValue,
  email: LinkedValue,
  link: LinkedValue,
  address: LinkedValue,
  website: WebsiteValue,
  text: MarkdownValue,
  note: NoteValue,
  money: MoneyValue,
  checkbox: CheckboxValue,
  menu: MenuValue,
  status: StatusValue,
  date: DateValue,
  rating: RatingValue,
};

/** Decide que componente pinta cada tipo de campo. */
export default function FieldValue({ field, label, onChange }) {
  const Component = COMPONENTS[field.type] || TextValue;
  return <Component field={field} label={label} onChange={onChange} />;
}
