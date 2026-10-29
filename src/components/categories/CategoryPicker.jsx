import { useState } from "react";
import { isNameTaken } from "../../lib/categories.js";
import Icon from "../ui/Icon.jsx";
import Modal from "../ui/Modal.jsx";
import CategoryCard from "./CategoryCard.jsx";
import CategoryForm from "./CategoryForm.jsx";

const NEW = "new";

/**
 * Ventana para cambiar de categoria, crear una nueva o editar una existente.
 * editing: null = viendo las tarjetas, "new" = creando, objeto = editando.
 */
export default function CategoryPicker({ categories, activeId, onSelect, onCreate, onUpdate, onClose }) {
  const [editing, setEditing] = useState(null);
  const isCreating = editing === NEW;
  const backToList = () => setEditing(null);

  if (editing) {
    const exceptId = isCreating ? undefined : editing.id;

    const save = (values) => {
      if (isCreating) onCreate(values);
      else onUpdate(editing, values);
      backToList();
    };

    return (
      <Modal title={isCreating ? "Nueva categoría" : "Editar categoría"} onClose={onClose}>
        <CategoryForm
          key={exceptId || NEW}
          initial={isCreating ? null : editing}
          isTaken={(name) => isNameTaken(categories, name, exceptId)}
          submitLabel={isCreating ? "Crear categoría" : "Guardar cambios"}
          onSubmit={save}
          onCancel={backToList}
        />
      </Modal>
    );
  }

  return (
    <Modal title="Categorías" subtitle="Elige en qué tipo de negocios quieres trabajar." onClose={onClose}>
      <div className="lt-cat-grid">
        <button type="button" className="lt-cat-new" onClick={() => setEditing(NEW)}>
          <span className="lt-ring">
            <Icon name="plus" size={18} />
          </span>
          Nueva categoría
        </button>

        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            active={category.id === activeId}
            onSelect={onSelect}
            onEdit={setEditing}
          />
        ))}
      </div>
    </Modal>
  );
}
