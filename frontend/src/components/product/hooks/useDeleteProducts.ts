import { useApi } from "../../../hooks"
import type { ProductRequest, ProductResponse, ParsedProduct } from "../models"

interface UseDeleteProductsProps {
  dataDeleteProduct: ParsedProduct | null;
}

export const useDeleteProducts = ({ dataDeleteProduct }: UseDeleteProductsProps) => {
  const { trigger, loading, error } = useApi<ProductRequest, ProductResponse>({
    id: dataDeleteProduct?.product_id,
    url: "http://localhost:3000/api/v1/products",
    method: "DELETE"
  });

  const deleteProduct = async (): Promise<ProductResponse | undefined> => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.log('Error al eliminar el producto', error);
    }
  }

  return { deleteProduct, loading, error };
}