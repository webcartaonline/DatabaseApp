import { useState } from "react";

/** Formulario de nombre y descripcion; sirve para crear y para editar. */
export default function CategoryForm({ initial, isTaken, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");

  const hasName = name.trim().length > 0;
  const duplicated = hasName && isTaken(name);
  const isValid = hasName && !duplicated;

  const submit = (event) => {
    event.preventDefault();
    if (isValid) onSubmit({ name, description });
  };

  return (
    <form className="lt-cat-form" onSubmit={submit}>
      <div className="lt-field-group">
        <label className="lt-label" htmlFor="category-name">
          Nombre
        </label>
        <input
          id="category-name"
          className="lt-input"
          value={name}
          autoFocus
          maxLength={40}
          placeholder="Hostelería"
          onChange={(event) => setName(event.target.value)}
        />
        {duplicated && <p className="lt-hint is-error">Ya tienes una categoría con ese nombre.</p>}
      </div>

      <div className="lt-field-group">
        <label className="lt-label" htmlFor="category-description">
          Descripción
        </label>
        <textarea
          id="category-description"
          className="lt-input lt-input-area"
          value={description}
          maxLength={200}
          placeholder="Bares, restaurantes y cafeterías a los que ofrecer la carta digital."
          onChange={(event) => setDescription(event.target.value)}
        />
        <p className="lt-hint">Solo se ve aquí, para recordar de qué va esta categoría.</p>
      </div>

      <div className="lt-row">
        <button type="button" className="lt-btn lt-btn-ghost lt-grow" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="lt-btn lt-btn-primary lt-grow" disabled={!isValid}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
