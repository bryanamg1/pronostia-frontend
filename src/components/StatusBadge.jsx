export function StatusBadge({ label, tone = "neutral" }) {
  return (
    <span className={`status-badge status-badge--${tone}`} role="status">
      {label}
    </span>
  );
}
