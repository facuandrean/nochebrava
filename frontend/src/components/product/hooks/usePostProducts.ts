import { useApi } from "../../../hooks"
import type { ProductRequest, ProductResponse } from "../models"
import { parseProductDataForBackend } from "../utils/productHelpers";

export const usePostProducts = () => {
  const { trigger, loading, error } = useApi<ProductRequest, ProductResponse>({
    url: "http://localhost:3000/api/v1/products",
    method: "POST"
  });

  /**
   * Crea un nuevo producto. Parsea los datos del formulario para enviarlos a la API.
   * @param formData - Datos del formulario sin procesar
   * @returns Promise con la respuesta de la API o undefined si hay un error
   */
  const postProduct = async (formData: ProductRequest): Promise<ProductResponse | undefined> => {
    try {
      const parsedProductData = parseProductDataForBackend(formData);
      const response = await trigger(parsedProductData as ProductRequest);
      return response;
    } catch (error) {
      console.log('Error al crear el producto', error);
    }
  }

  return { postProduct, loading, error };
}