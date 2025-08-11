import { useApi } from "../../../hooks"
import type { ProductCategoryRequest, ProductCategoryResponse } from "../models"


export const usePostProductCategories = () => {
  const { trigger, loading, error } = useApi<ProductCategoryRequest, ProductCategoryResponse>({
    url: "http://localhost:3000/api/v1/products-category/batch",
    method: "POST",
  });

  const postProductCategories = async (productId: string, categoryIds: string[]) => {
    try {
      const productCategoryRequest: ProductCategoryRequest = {
        product_id: productId,
        category_ids: categoryIds
      }
      const response = await trigger(productCategoryRequest);
      return response;
    } catch (error) {
      console.log("Error al asignar categorías al producto", error);
    }
  }

  return { postProductCategories, loading, error };
}