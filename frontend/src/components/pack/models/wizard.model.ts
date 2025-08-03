import type { ParsedProduct } from "../../product/models";
import type { ParsedPack } from "./pack.model";

// Producto extendido para usar en el selector del wizard
export interface ProductForSelection extends ParsedProduct {
  selected: boolean;
  quantity: number;
}

// Producto seleccionado para agregar al pack
export interface SelectedProduct {
  product_id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

// Estado del wizard
export interface WizardState {
  currentStep: number;
  totalSteps: number;
  packData: {
    name: string;
    description: string | null;
    price: number;
    picture: string | null;
    active: boolean;
  } | null;
  selectedProducts: SelectedProduct[];
  isValid: boolean;
}

// Props del wizard
export interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialPack?: ParsedPack | null;
} 