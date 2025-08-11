interface WizardProps {
  currentStep: number;
  children: React.ReactNode[];
}
/**
 * Componente que renderiza el paso actual del wizard. 
 * @param currentStep - Paso actual del wizard.
 * @param children - Componentes hijos que representan cada paso del wizard. Se renderiza 1 componente hijo por cada paso del wizard.
 * @example <Wizard currentStep={2}> <FormProduct /> <FormProductCategories /> </Wizard> se va a renderizar el componente FormProductCategories, porque children[2-1] = children[1] = FormProductCategories. Esti es así porque los pasos empiezan en 1 pero el array children empieza en 0.
 * @returns Componente que renderiza el paso actual del wizard.
 */
export const Wizard = ({ currentStep, children }: WizardProps) => {
  if (!Array.isArray(children)) {
    return null;
  }
  return children[currentStep - 1] || null;
}