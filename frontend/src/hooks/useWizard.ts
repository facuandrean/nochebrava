import { useState } from "react"

export const useWizard = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(1);

  return {
    currentStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    handleNext: () => setCurrentStep(prev => Math.min(prev + 1, totalSteps)),
    handlePrevious: () => setCurrentStep(prev => Math.max(prev - 1, 1)),
    resetWizard: () => setCurrentStep(1),
  }
}