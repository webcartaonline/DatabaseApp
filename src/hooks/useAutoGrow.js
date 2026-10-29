import { useLayoutEffect } from "react";

/** Ajusta la altura de un textarea a su contenido cada vez que cambia. */
export function useAutoGrow(ref, value, active = true) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !active) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [ref, value, active]);
}
