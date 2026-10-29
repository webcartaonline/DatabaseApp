import Icon from "../ui/Icon.jsx";

/** Tarjeta de la ficha para mover un negocio a otra categoria. */
export default function LeadCategorySelect({ categories, value, onChange }) {
  return (
    <div className="lt-field">
      <div className="lt-field-head">
        <Icon name="store" size={16} />
        <span className="lt-field-label lt-grow">Categoría</span>
      </div>

      <div className="lt-val">
        <div className="lt-select-wrap">
          <select
            className="lt-select"
            value={value}
            aria-label="Categoría del negocio"
            onChange={(event) => onChange(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <span className="lt-select-chev">
            <Icon name="down" size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}
