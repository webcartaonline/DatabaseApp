import Icon from "../ui/Icon.jsx";

/** Tarjeta de una categoria: tocarla la elige; el lapiz la edita. */
export default function CategoryCard({ category, active, onSelect, onEdit }) {
  return (
    <div className={`lt-cat-card${active ? " is-active" : ""}`}>
      <button
        type="button"
        className="lt-cat-select"
        onClick={() => onSelect(category.id)}
        aria-pressed={active}
      >
        <span className="lt-cat-name">{category.name}</span>
        <span className="lt-cat-desc">{category.description || "Sin descripción"}</span>
        {active && (
          <span className="lt-cat-flag">
            <Icon name="check" size={14} />
            Categoría actual
          </span>
        )}
      </button>

      <button
        type="button"
        className="lt-mini lt-cat-edit"
        onClick={() => onEdit(category)}
        aria-label={`Editar ${category.name}`}
      >
        <Icon name="pencil" size={16} />
      </button>
    </div>
  );
}
