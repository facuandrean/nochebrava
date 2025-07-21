import "./section.css";

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Section = ({ title, description, children }: SectionProps) => {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
      {children}
    </section>
  )
}