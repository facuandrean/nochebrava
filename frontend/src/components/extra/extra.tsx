import { Section } from "../section/section";
import { PaymentMethod } from "../paymentMethod/paymentMethod";

export const Extra = () => {
  return (
    <>
      <Section
        title="Funcionalidades adicionales"
        description="Gestiona las distintas funcionalidades adicionales de la aplicación.">

        <hr />

        <PaymentMethod />
      </Section>
    </>
  );
}