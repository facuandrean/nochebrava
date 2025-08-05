import { useEffect, useState } from "react";
import type { ProductListResponse } from "../../product";
import type { PackRequest, ProductForSelection } from "../models";
import { useApi } from "../../../hooks";
import { ProductSelection } from "./productSelection";
import { parseProductData } from "../../product/utils/productHelpers";

interface StepProductSelectionProps {
  onPreviousStep: () => void;
  selectedProducts?: ProductForSelection[]; // Lo recibo, porque necesito ver la información de los productos seleccionados hasta el momento.
  setSelectedProducts: (selectedProducts: ProductForSelection[]) => void; // este setea el array de productos seleccionados en packwizard.
  setStep: (step: number) => void;
  setPackData: (packData: PackRequest) => void;
  idModal: string;
  apiPostPackItemsLoading?: boolean;
  apiError?: string;
  validationError?: string | null;
}

export const StepProductSelection = ({ onPreviousStep, selectedProducts, setSelectedProducts, setStep, setPackData, idModal, apiPostPackItemsLoading, apiError, validationError }: StepProductSelectionProps) => {

  // Manejo el estado de los productos de la aplicación, parseados correctamente, para que se puedan elegir para el pack.
  const [productsForSelection, setProductsForSelection] = useState<ProductForSelection[]>([]);

  // Llamo a la API para obtener todos los productos.
  const { data: products } = useApi<unknown, ProductListResponse>({
    url: "http://localhost:3000/api/v1/products",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    // Cuando obtengo los productos, primero los parseo para que cumplan ParsedProduct, luego los mapeo a ProductForSelection
    if (products && products.data) {
      // Primero convertir de Product[] a ParsedProduct[] (convierte active boolean -> string, agrega id, formatea fechas)
      const parsedProducts = parseProductData(products.data);

      // Luego mapear de ParsedProduct[] a ProductForSelection[] (agrega selected y quantity)
      const productsForSelection: ProductForSelection[] = parsedProducts.map((product) => ({
        ...product,
        selected: false,
        quantity: 0
      }));

      setProductsForSelection(productsForSelection);
    }
  }, [products]);

  return (
    <ProductSelection
      productsForSelection={productsForSelection} // Este es el array de productos para selección, es decir, los productos de la aplicación parseados correctamente.
      selectedProducts={selectedProducts || []}
      setSelectedProducts={setSelectedProducts as (updater: ProductForSelection[] | ((prev: ProductForSelection[]) => ProductForSelection[])) => void}

      setStep={setStep}
      setPackData={setPackData}
      onPrevious={onPreviousStep}
      idModal={idModal}
      apiError={apiError}
      apiPostPackItemsLoading={apiPostPackItemsLoading}
      validationError={validationError}
    />
  )
}