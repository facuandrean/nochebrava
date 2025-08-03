import { useEffect, useState } from "react";
import type { Product } from "../../product";
import type { PackRequest, ProductForSelection } from "../models";
import { useApi } from "../../../hooks";
import { ProductSelection } from "./productSelection";

interface StepProductSelectionProps {
  onPreviousStep: () => void;
  apiPostLoading?: boolean; // Hay que ver bien como implmentarlo.

  selectedProducts?: ProductForSelection[]; // Lo recibo, porque necesito ver la información de los productos seleccionados hasta el momento.

  setSelectedProducts?: (selectedProducts: ProductForSelection[]) => void; // este si es importante para mi, este setea el array de productos seleccionados en packwizard. sacarle el ? cuando se implemente correctamente.

  setStep: (step: number) => void;
  setPackData: (packData: PackRequest) => void;
  idModal: string;
  apiPostPackItemsLoading?: boolean;
  apiError?: string;
}

export const StepProductSelection = ({ onPreviousStep, selectedProducts, setSelectedProducts, setStep, setPackData, idModal, apiPostPackItemsLoading, apiError }: StepProductSelectionProps) => {

  // Manejo el estado de los productos de la aplicación, parseados correctamente, para que se puedan elegir para el pack.
  const [productsForSelection, setProductsForSelection] = useState<ProductForSelection[]>([]);

  // Llamo a la API para obtener todos los productos.
  const { data: products } = useApi<{ status: string, message: string, data: Product[] }>({
    url: "http://localhost:3000/api/v1/products",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    // Cuando obtengo los productos, los mapeo de tal forma que cumpla la interfaz de ProductForSelection (la cual extiende la de ParsedProduct y le agrega propiedades como selected, quantity, isValidQuantity, y actualiza el id).
    if (products && products.data) {
      const productsForSelection = products.data.map((product) => ({
        ...product,
        selected: false,
        quantity: 0,
        id: product.product_id
      }));

      // Seteo el estado de los productos para selección. O sea que productsForSelection es un array de los productos de tipo ProductForSelection, que tiene todas las propiedades de ParsedProduct y las nuevas propiedades que agregué.
      setProductsForSelection(productsForSelection as unknown as ProductForSelection[]);
    };
  }, [products]);

  return (
    <>
      <div>
        <ProductSelection
          productsForSelection={productsForSelection} // Este es el array de productos para selección, es decir, los productos de la aplicación parseados correctamente.
          selectedProducts={selectedProducts || []}
          setSelectedProducts={setSelectedProducts as (updater: ProductForSelection[] | ((prev: ProductForSelection[]) => ProductForSelection[])) => void}

          setStep={setStep}
          onPrevious={onPreviousStep}
          setPackData={setPackData}
          idModal={idModal}
          apiError={apiError}
          apiPostPackItemsLoading={apiPostPackItemsLoading}
        />
      </div>
    </>
  )
}