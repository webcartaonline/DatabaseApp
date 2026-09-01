/** Identificador corto y unico para negocios y campos. */
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
