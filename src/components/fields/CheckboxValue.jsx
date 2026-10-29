import Switch from "../ui/Switch.jsx";

/** Casilla si/no con aspecto de interruptor. */
export default function CheckboxValue({ field, label, onChange }) {
  const isOn = field.value === true;
  return <Switch on={isOn} label={label} onToggle={() => onChange(!isOn)} />;
}
