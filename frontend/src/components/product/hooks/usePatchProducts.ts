import { useApi } from "../../../hooks"
import type { ProductRequest, ProductResponse, ParsedProduct } from "../models";
import { parseProductDataForBackend } from "../utils/productHelpers";

interface UsePatchProductsProps {
  dataEditProduct: ParsedProduct | null;
}

export const usePatchProducts = ({ dataEditProduct }: UsePatchProductsProps) => {
  const { trigger, loading, error } = useApi<ProductRequest, ProductResponse>({
    id: dataEditProduct?.product_id,
    url: "http://localhost:3000/api/v1/products",
    method: "PATCH"
  });

  const patchProduct = async (formData: ProductRequest): Promise<ProductResponse | undefined> => {
    try {
      const parsedProductData = parseProductDataForBackend(formData);
      const response = await trigger(parsedProductData as ProductRequest);
      return response;
    } catch (error) {
      console.log('Error al actualizar el producto', error);
    }
  }

  return { patchProduct, loading, error };
}