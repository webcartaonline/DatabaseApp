/** Rectangulo de la cabecera que muestra solo el nombre de la categoria actual. */
export default function CategoryButton({ name, onClick }) {
  return (
    <button
      type="button"
      className="lt-category-btn"
      onClick={onClick}
      aria-label={`Categoría ${name}. Cambiar de categoría`}
    >
      <span className="lt-category-name">{name}</span>
    </button>
  );
}
