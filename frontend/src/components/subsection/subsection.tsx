import "./subsection.css";

interface SubsectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Subsection = ({ title, description, children }: SubsectionProps) => {
  return (
    <>
      <section className="subsection">
        <h3 className="subsection-title">{title}</h3>
        <p className="subsection-description">{description}</p>
        {children}
      </section>
    </>
  );
}