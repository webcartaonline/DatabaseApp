/**
 * Catalogo de tipos de campo. Anadir un tipo nuevo aqui lo hace aparecer
 * automaticamente en el panel "Nuevo campo"; solo hace falta decidir como se
 * pinta en components/fields/FieldValue.jsx.
 */
export const DEFAULT_STATUSES = [
  "Nuevo",
  "Contactado",
  "En curso",
  "Negociando",
  "Pendiente",
  "Ganado",
  "Perdido",
];

/** Tipos de carta que se pueden ver en la ficha de Google Maps. */
export const MENU_KINDS = [
  "PDF",
  "Imagenes",
  "Pagina web",
  "Enlace",
  "Rota",
  "Predeterminada",
];

export const FIELD_TYPES = [
  { id: "text", label: "Texto", icon: "text", empty: "", placeholder: "Escribe aqui" },
  { id: "note", label: "Nota", icon: "note", empty: "", placeholder: "Anotaciones, detalles de la visita..." },
  { id: "status", label: "Estado", icon: "flag", empty: "", options: DEFAULT_STATUSES },
  { id: "person", label: "Persona", icon: "user", empty: "", placeholder: "Nombre del contacto" },
  { id: "phone", label: "Telefono", icon: "phone", empty: "", placeholder: "600 000 000" },
  { id: "email", label: "Email", icon: "mail", empty: "", placeholder: "hola@negocio.com" },
  { id: "link", label: "Enlace", icon: "link", empty: "", placeholder: "web, Instagram..." },
  { id: "address", label: "Direccion", icon: "pin", empty: "", placeholder: "Calle, numero, ciudad" },
  { id: "number", label: "Numero", icon: "hash", empty: "", placeholder: "0" },
  { id: "money", label: "Importe", icon: "euro", empty: "", placeholder: "0,00" },
  { id: "date", label: "Fecha", icon: "calendar", empty: "" },
  { id: "checkbox", label: "Casilla", icon: "checkbox", empty: false },
  // Casilla si/no que, al encenderse, despliega la lista de tipos de carta.
  { id: "menu", label: "Carta en Maps", icon: "menu", empty: { on: false, kind: "" }, options: MENU_KINDS },
  { id: "rating", label: "Interes", icon: "star", empty: 0 },
];

const TYPE_MAP = FIELD_TYPES.reduce((map, type) => ({ ...map, [type.id]: type }), {});

export const typeOf = (id) => TYPE_MAP[id] || TYPE_MAP.text;
