type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  as = "h2",
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <header className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading>{title}</Heading>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </header>
  );
}
