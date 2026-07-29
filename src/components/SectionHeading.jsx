export function SectionHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? (
        <div className="section-heading__actions">{actions}</div>
      ) : null}
    </div>
  );
}
