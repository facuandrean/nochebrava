import { Loading } from "../../loading/loading";
import type { ParsedCategory } from "../../category/models";
import { useEffect, useState } from "react";
import type { Product } from "../models";

interface FormProductCategoriesProps {
  parsedCategories: ParsedCategory[];
  loadingCategories: boolean;
  errorCategories: Error | null;
  selectedCategoryIds: string[];
  onCategoryChange: (categoryIds: string[]) => void;
  successState: boolean;
  successMessage: string;
  apiLoading: boolean;
  apiError: Error | null;
  onPreviousStep: () => void;
  initialValues?: Product | undefined;
}

export const FormProductCategories = ({ parsedCategories, loadingCategories, errorCategories, selectedCategoryIds, onCategoryChange, successState, successMessage, apiLoading, apiError, onPreviousStep, initialValues }: FormProductCategoriesProps) => {

  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState(false);

  console.log('initialValues', initialValues);

  /**
   * Se ejecuta cuando se cambia el estado de un checkbox. Si es true, se agrega la categoría al array de categorías seleccionadas. Si es false, se elimina la categoría del array de categorías seleccionadas.
   * @param categoryId - ID de la categoría.
   * @param isChecked - Estado del checkbox.
   */
  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    if (isChecked) {
      onCategoryChange([...selectedCategoryIds, categoryId]);
    } else {
      onCategoryChange(selectedCategoryIds.filter(id => id !== categoryId));
    }
  }


  /**
   * Se ejecuta cuando se cambia el estado de las categorías seleccionadas.
   * Se setea el estado selectedCategories con los ids de las categorías seleccionadas.
   * @param categoryIds - Ids de las categorías seleccionadas.
   */
  useEffect(() => {
    if (apiError) {
      setErrorMessage(true);
      const timer = setTimeout(() => setErrorMessage(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setErrorMessage(false);
    }
  }, [apiError]);


  /**
   * Se ejecuta cuando se cambia el estado de las categorías seleccionadas.
   * Se setea el estado selectedCategories con los ids de las categorías seleccionadas.
   * @param categoryIds - Ids de las categorías seleccionadas.
   */
  useEffect(() => {
    if (successState) {
      setShowSuccess(true);
    }
  }, [successState]);

  if (loadingCategories) return <Loading className="table-container-loading" />
  if (errorCategories) return <div className="no-results-message"><span>Error al cargar las categorías</span></div>

  return (
    <div>
      <button className="btn-return" onClick={onPreviousStep}>Volver al paso anterior</button>
      <h6 className="mb-3">Selecciona las categorías a las que pertenece el producto:</h6>
      {parsedCategories.length === 0 ?
        <span className="text-muted text-center">No hay categorías disponibles. Aún así, puedes crear el producto y luego modificarlo para agregarle categorías.</span> :
        parsedCategories.map((category) => (
          <div key={category.category_id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={category.category_id}
              checked={selectedCategoryIds.includes(category.category_id)}
              onChange={(e) => handleCategoryChange(category.category_id, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={category.category_id}>
              {category.name}
            </label>
          </div>
        ))}

      {apiLoading && (
        <div className="d-flex justify-content-center mt-3">
          <Loading className="loading-container-form" />
        </div>
      )}

      {showSuccess && !apiLoading && (
        <div className="mt-3 p-2 text-center message-success" style={{ backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && apiError && (
        <div className="mt-3 p-2 text-center message-error" style={{ backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {apiError.message}
        </div>
      )}
    </div>
  )
}