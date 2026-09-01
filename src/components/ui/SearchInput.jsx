import Icon from "./Icon.jsx";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="lt-search">
      <Icon name="search" size={17} />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="lt-mini" onClick={() => onChange("")} aria-label="Borrar busqueda">
          <Icon name="x" size={15} />
        </button>
      )}
    </div>
  );
}
