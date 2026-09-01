export default function DateValue({ field, onChange }) {
  return (
    <div className="lt-val">
      <input
        className="lt-val-input"
        type="date"
        value={field.value || ""}
        aria-label={field.label}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
