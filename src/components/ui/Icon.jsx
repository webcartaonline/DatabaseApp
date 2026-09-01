/** Iconos en linea: sin dependencias externas y heredan el color del texto. */
const ICONS = {
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.3-3.3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.4A8.5 8.5 0 0 1 9.6 4 8.5 8.5 0 1 0 20 14.4Z" />,
  back: <path d="m15 5-7 7 7 7" />,
  up: <path d="m6 14.5 6-6 6 6" />,
  down: <path d="m6 9.5 6 6 6-6" />,
  trash: <path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l1 12.2h9l1-12.2" />,
  pencil: <path d="M4 20h4.2L20 8.2 15.8 4 4 15.8V20Z" />,
  dots: (
    <>
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-8.5 8.5M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5" />,
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  star: <path d="m12 3.8 2.6 5.2 5.8.9-4.2 4 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.2-4 5.8-.9Z" />,
  check: <path d="m5 12.6 4.6 4.6L19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  link: (
    <>
      <path d="M10.4 13.6a4 4 0 0 0 5.7 0l2.2-2.2a4 4 0 1 0-5.7-5.7l-1.1 1.1" />
      <path d="M13.6 10.4a4 4 0 0 0-5.7 0l-2.2 2.2a4 4 0 1 0 5.7 5.7l1.1-1.1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 8.2 5.6L20.2 7" />
    </>
  ),
  phone: <path d="M6.2 3.5h2.6l1.8 4.4-2.2 1.4a12.4 12.4 0 0 0 5.3 5.3l1.4-2.2 4.4 1.8v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />,
  hash: <path d="M5 9.2h14M5 14.8h14M10 4.5 8.4 19.5M15.6 4.5 14 19.5" />,
  euro: <path d="M17.5 6.4a6.6 6.6 0 1 0 0 11.2M4.5 10.2h8M4.5 13.8h8" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.2 20c0-3.4 3-5.9 6.8-5.9s6.8 2.5 6.8 5.9" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  checkbox: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5.2" />
    </>
  ),
  flag: <path d="M6 21V4M6 5.2h11l-2.2 3.6L17 12.4H6" />,
  text: <path d="M5 6.5h14M5 12h14M5 17.5h9" />,
  note: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M8.5 9h7M8.5 12.6h7M8.5 16.2h4" />
    </>
  ),
  store: <path d="M4 20.5V9.5M20 20.5V9.5M3 9.5 5 4h14l2 5.5A2.6 2.6 0 0 1 16.7 12 2.6 2.6 0 0 1 12 10.6 2.6 2.6 0 0 1 7.3 12 2.6 2.6 0 0 1 3 9.5ZM3.5 20.5h17M9.5 20.5v-5h5v5" />,
};

export default function Icon({ name, size = 18 }) {
  const shape = ICONS[name];
  if (!shape) return null;

  return (
    <svg
      className="lt-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
