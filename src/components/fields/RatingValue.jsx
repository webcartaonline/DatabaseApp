import Icon from "../ui/Icon.jsx";

const STARS = [1, 2, 3, 4, 5];

/** Valoracion de 1 a 5. Pulsar la estrella actual vuelve a dejarlo sin valorar. */
export default function RatingValue({ field, onChange }) {
  const current = Number(field.value) || 0;

  return (
    <div className="lt-val">
      <div className="lt-stars" role="group" aria-label={field.label}>
        {STARS.map((value) => (
          <button
            key={value}
            type="button"
            className={`lt-star${value <= current ? " is-on" : ""}`}
            aria-label={`${value} de 5`}
            aria-pressed={value <= current}
            onClick={() => onChange(value === current ? 0 : value)}
          >
            <Icon name="star" size={20} />
          </button>
        ))}
      </div>
      <span className="lt-count">{current > 0 ? `${current}/5` : "Sin valorar"}</span>
    </div>
  );
}
