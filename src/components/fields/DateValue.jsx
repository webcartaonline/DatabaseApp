export default function DateValue({ field, label, onChange }) {
  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="date"
        value={field.value || ""}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
