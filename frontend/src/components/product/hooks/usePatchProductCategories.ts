import { useApi } from "../../../hooks"
import type { ParsedProduct, ProductCategoryRequest, ProductCategoryResponse } from "../models"


interface UsePatchProductCategoriesProps {
  dataEditProduct: ParsedProduct | null;
}

export const usePatchProductCategories = ({ dataEditProduct }: UsePatchProductCategoriesProps) => {
  const { trigger, loading, error } = useApi<ProductCategoryRequest, ProductCategoryResponse>({
    url: `http://localhost:3000/api/v1/products-category/product/${dataEditProduct?.product_id}/categories`,
    method: "PATCH"
  });

  const patchProductCategories = async (categoryIds: string[]): Promise<ProductCategoryResponse | undefined> => {
    try {
      const productCategoryRequest: ProductCategoryRequest = {
        product_id: dataEditProduct?.product_id || "",
        category_ids: categoryIds
      }
      const response = await trigger(productCategoryRequest);
      return response;
    } catch (error) {
      console.log("Error al actualizar las categorías del producto", error);
    }
  }

  return { patchProductCategories, loading, error };
}