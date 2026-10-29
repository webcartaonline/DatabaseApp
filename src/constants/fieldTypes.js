/**
 * Catalogo de tipos de campo. Anadir un tipo nuevo aqui lo hace aparecer
 * automaticamente en el panel "Nuevo campo"; solo hace falta decidir como se
 * pinta en components/fields/FieldValue.jsx.
 */
export const DEFAULT_STATUSES = [
  "Nuevo",
  "Visita prevista",
  "Contactado",
  "Negociando",
  "Pendiente",
  "Ganado",
  "Actualizando",
  "Perdido",
];

/** Estados que cuentan como "falta por contactar" en el numero de la cabecera. */
export const PENDING_CONTACT_STATUSES = ["Nuevo", "Visita prevista"];

/** Lista por defecto anterior; los campos que la guardan pasan a usar la actual. */
export const LEGACY_DEFAULT_STATUSES = [
  "Nuevo",
  "Contactado",
  "En curso",
  "Negociando",
  "Pendiente",
  "Ganado",
  "Perdido",
];

/** Opciones que despliega el Activador al encenderse. */
export const MENU_KINDS = [
  "PDF",
  "Imagenes",
  "Pagina web",
  "Enlace",
  "Rota",
  "Predeterminada",
];

/** Nombre que tenia el Activador; los campos antiguos se muestran con el nuevo. */
export const LEGACY_MENU_LABEL = "Carta en Maps";

/**
 * Todos los tipos que la app sabe pintar. Los marcados como legacy ya no se
 * ofrecen al anadir un campo, pero los negocios que los tienen los conservan.
 */
const ALL_FIELD_TYPES = [
  { id: "link", label: "Enlace", icon: "link", empty: "", placeholder: "Instagram, Google Maps..." },
  { id: "website", label: "Página web", icon: "globe", empty: { on: false, url: "" }, placeholder: "www.negocio.com" },
  { id: "note", label: "Nota", icon: "sticky", empty: "", placeholder: "Texto corto para copiar" },
  { id: "text", label: "Texto", icon: "doc", empty: "", placeholder: "Escribe aquí. Admite formato Markdown" },
  { id: "person", label: "Persona", icon: "user", empty: "", placeholder: "Nombre del contacto" },
  { id: "phone", label: "Teléfono", icon: "phone", empty: "", placeholder: "600 000 000" },
  { id: "email", label: "Email", icon: "mail", empty: "", placeholder: "hola@negocio.com" },
  { id: "address", label: "Dirección", icon: "pin", empty: "", placeholder: "Calle, número, ciudad" },
  { id: "money", label: "Importe", icon: "euro", empty: "", placeholder: "0,00" },
  { id: "checkbox", label: "Casilla", icon: "checkbox", empty: false },
  // Interruptor si/no que, al encenderse, despliega una lista de opciones.
  { id: "menu", label: "Activador", icon: "power", empty: { on: false, kind: "" }, options: MENU_KINDS },
  { id: "status", label: "Estado", icon: "flag", empty: "", options: DEFAULT_STATUSES },
  { id: "number", label: "Número", icon: "hash", empty: "", placeholder: "0", legacy: true },
  { id: "date", label: "Fecha", icon: "calendar", empty: "", legacy: true },
  { id: "rating", label: "Interés", icon: "star", empty: 0, legacy: true },
];

/** Tipos que se pueden elegir en el panel "Nuevo campo". */
export const FIELD_TYPES = ALL_FIELD_TYPES.filter((type) => !type.legacy);

const TYPE_MAP = ALL_FIELD_TYPES.reduce((map, type) => ({ ...map, [type.id]: type }), {});

export const typeOf = (id) => TYPE_MAP[id] || TYPE_MAP.text;
