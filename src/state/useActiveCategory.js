import { useEffect, useState } from "react";
import { DEFAULT_CATEGORY } from "../lib/categories.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../lib/storage.js";

/**
 * Categoria en la que se esta trabajando. Se recuerda por dispositivo: cada
 * movil puede estar en una distinta. Si la guardada aun no ha llegado por la
 * sincronizacion, se muestra la fija hasta que llegue.
 */
export function useActiveCategory(categories) {
  const [activeId, setActiveId] = useState(() =>
    readJSON(STORAGE_KEYS.activeCategory, DEFAULT_CATEGORY.id)
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.activeCategory, activeId);
  }, [activeId]);

  const active =
    categories.find((category) => category.id === activeId) ||
    categories.find((category) => category.id === DEFAULT_CATEGORY.id);

  return [active, setActiveId];
}
