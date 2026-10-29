import { useEffect } from "react";

/**
 * Comportamiento comun de las ventanas superpuestas: se cierran con Escape
 * y bloquean el scroll de la pagina de fondo mientras estan abiertas.
 */
export function useDismiss(onClose) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);
}

/** Cierra solo si se toca el fondo oscuro, no el contenido de la ventana. */
export const closeOnBackdrop = (onClose) => (event) => {
  if (event.target === event.currentTarget) onClose();
};
