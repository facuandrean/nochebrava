import { Section } from "../section/section";
import { PaymentMethod } from "../paymentMethod/paymentMethod";
import { ItemType } from "../itemType/itemType";

export const Extra = () => {
  return (
    <>
      <Section
        title="Funcionalidades adicionales"
        description="Gestiona las distintas funcionalidades adicionales de la aplicación.">
        <hr />
        <PaymentMethod />
        <hr />
        <ItemType />
      </Section>
    </>
  );
}