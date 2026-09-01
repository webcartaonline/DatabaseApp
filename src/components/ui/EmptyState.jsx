import Icon from "./Icon.jsx";

export default function EmptyState({ icon = "store", title, children }) {
  return (
    <div className="lt-empty">
      <Icon name={icon} size={30} />
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
