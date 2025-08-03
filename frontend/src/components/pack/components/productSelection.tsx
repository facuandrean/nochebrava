import { useEffect, useState } from "react";
import type { PackRequest, ProductForSelection } from "../models"
import "../pack.css"
import { Loading } from "../../loading/loading";

interface ProductSelectionProps {
  productsForSelection: ProductForSelection[]; // Este es el array de productos para selección. Este array debe ser inmutable, no se debe modificar.
  selectedProducts: ProductForSelection[]; // Este es el array de productos seleccionados. Este array es el que se debe modificar.
  setSelectedProducts: (updater: ProductForSelection[] | ((prev: ProductForSelection[]) => ProductForSelection[])) => void;

  setStep: (step: number) => void; // Este es el callback que se ejecuta cuando se cambia de paso. Lo ejecuto cuando se cierra el modal para volver al paso 1.
  onPrevious: () => void;
  setPackData: (packData: PackRequest) => void;
  idModal: string;
  apiError?: string;
  apiPostPackItemsLoading?: boolean;
}

export const ProductSelection = ({ productsForSelection, selectedProducts, setSelectedProducts, setStep, onPrevious, setPackData, idModal, apiError, apiPostPackItemsLoading = false }: ProductSelectionProps) => {

  // Maneja el estado de los selectables y los datos del producto seleccionado (el id por un lado y toda la información del producto por el otro).
  // Cuando vaya a setear el estado, tengo que pasar el id del selectable, el id del producto seleccionado y los datos del producto seleccionado.
  const [productSelector, setProductSelector] = useState<{
    idSelectable: number;
    selectedProductId: string | null;
    selectedProductData: ProductForSelection | null;
  }[]>([
    { idSelectable: 0, selectedProductId: null, selectedProductData: null }
  ]);
  // Maneja el estado de la cantidad de selectables.
  const [nextIdSelect, setNextIdSelect] = useState(1);

  // Maneja el estado del envio de datos al backend.
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previousLoading, setPreviousLoading] = useState(false);

  // Cuando se cierra el modal, se resetean los selectables y se vuelve al paso 1.
  useEffect(() => {
    const modal = document.getElementById(idModal);
    if (modal) {
      const handleHidden = () => {
        setNextIdSelect(1);
        setStep(1);
        setPackData({
          name: "",
          description: "",
          price: 0,
          active: true
        });
        setSelectedProducts([]);
      };

      modal.addEventListener('hidden.bs.modal', handleHidden);

      return () => {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      };
    }
  }, [setStep, setPackData, setSelectedProducts, idModal]);

  // Al montar, inicializar productSelector desde selectedProducts.
  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      const initialSelectors = selectedProducts.map((product, index) => ({
        idSelectable: index,
        selectedProductId: product.id,
        selectedProductData: product
      }));

      setProductSelector(initialSelectors);
      setNextIdSelect(selectedProducts.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Maneja el estado del envio de datos al backend.
  useEffect(() => {
    if (previousLoading && !apiPostPackItemsLoading && apiError) {
      setSubmitSuccess(false);

      setTimeout(() => {
        const messageError = document.querySelector(".message-error");
        if (messageError) {
          messageError.classList.remove("d-block");
          messageError.classList.add("d-none");
        }
      }, 2000);
    }

    if (previousLoading && !apiPostPackItemsLoading && !apiError) {
      setSubmitSuccess(true);

      setTimeout(() => {
        const modal = document.getElementById(idModal);
        if (modal) {
          const bootstrapModal = (window as typeof window & { bootstrap?: { Modal?: { getInstance: (element: Element) => { hide: () => void } | null } } }).bootstrap?.Modal?.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
          window.location.reload();
        }
      }, 2000);
    }

    setPreviousLoading(apiPostPackItemsLoading);

  }, [apiPostPackItemsLoading, apiError, idModal, previousLoading, setSubmitSuccess]);

  // Agrega un nuevo selectable.
  const addProductSelector = () => {
    setProductSelector(prev => [
      ...prev,
      { idSelectable: nextIdSelect, selectedProductId: null, selectedProductData: null }
    ]);
    setNextIdSelect(prev => prev + 1);
  }

  // Quita el último selectable.
  const removeProductSelector = () => {
    setProductSelector(prev => prev.slice(0, -1)); // Quito el último selectable.
    setSelectedProducts(prev => prev.slice(0, -1)); // Quito el último producto seleccionado.
    setNextIdSelect(prev => prev - 1); // Decremento el id del siguiente selectable.
  }

  // Maneja el cambio de producto seleccionado.
  const handleProductChange = (selectorId: number, productId: string) => {
    // Busco la información del producto seleccionado a través del id contenido en productId.
    const product = productsForSelection.find((product) => product.id === productId);

    if (product) {
      // Busco el producto anterior de este selector.
      const previousProduct = productSelector.find(s => s.idSelectable === selectorId)?.selectedProductData;

      // Actualizo el estado de los selectables.
      setProductSelector(prev => {
        return prev.map(selector => {
          if (selector.idSelectable === selectorId) {
            return { ...selector, selectedProductId: productId, selectedProductData: product }
          }
          return selector;
        })
      });

      // Actualizo el estado de los productos seleccionados.
      setSelectedProducts((prev: ProductForSelection[]) => {
        // 1. Filtrar el producto anterior de este selector
        let filtered = prev;
        if (previousProduct) {
          filtered = prev.filter(p => p.id !== previousProduct.id);
        }

        // 2. Verificar si el nuevo producto ya existe en otro selector
        const isAlreadySelected = filtered.some(p => p.id === product.id);

        if (isAlreadySelected) {
          return filtered; // Solo quitar el anterior
        }

        // 3. Agregar el nuevo producto
        return [...filtered, { ...product }];
      });
    }
  }

  // Manejo el cambio de cantidad de un producto.
  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev => // prev es el valor actual del estado selectedProducts, es un array de los productos seleccionados (son de tipo ProductForSelection).
      prev.map(product => // Recorro cada producto del array actual. Se usa el map para actualizar arrays de manera inmutable.
        product.id === productId
          ? { ...product, quantity }
          : product
      )
    );
  };

  return (
    <>
      <div className="btn-previous">
        <button onClick={() => { setStep(1); onPrevious(); }}>
          <i className="fa-solid fa-arrow-left"></i> Volver al paso anterior
        </button>
      </div>
      <div className="btn-container-selectors">
        <button onClick={addProductSelector} className="btn btn-dark">Agregar producto</button>
        <button onClick={removeProductSelector} className="btn btn-dark">Quitar producto</button>
      </div>

      { /* Recorre el array de selectables y por elemento crea un select con los productos disponibles. */
        productSelector.map((selector) => (
          <div key={selector.idSelectable}>
            <select
              className="form-select selectProduct"
              style={{ marginBottom: "10px" }}
              value={selector.selectedProductId || "null"}
              onChange={
                (e) => {
                  handleProductChange(selector.idSelectable, e.target.value)
                }
              }
            >
              <option value="null">Selecciona un producto</option>
              { /* Recorre el array de productos disponibles y por cada elemento crea un option con el nombre del producto. */
                productsForSelection.map((product) => (
                  <option key={product.id} value={product.id} disabled={selectedProducts.some(p => p.id === product.id)}>{product.name}</option>
                ))
              }
            </select>

            { /* Si el producto seleccionado no es null, se crea un div con el precio unitario, el stock y el input para la cantidad. */
              selector.selectedProductId && productSelector.length > 0 && (
                <div className="selectProductContainerSpans">
                  <span>Precio unitario: <strong>{selector.selectedProductData?.price}</strong></span>
                  <span>Stock en este momento: <strong>{selector.selectedProductData?.stock}</strong></span>
                  <span>Cantidad para el pack:
                    <input
                      type="number"
                      min="0"
                      max={selector.selectedProductData?.stock}
                      value={selector.selectedProductData?.quantity || ""}
                      onChange={(e) => { /* Manejo el cambio de cantidad de un producto. */
                        const newQuantity = parseInt(e.target.value) || 0;
                        handleQuantityChange(selector.selectedProductData?.id || "", newQuantity);
                        setProductSelector(prev =>
                          prev.map(s => {
                            if (s.idSelectable === selector.idSelectable && s.selectedProductData) {
                              return {
                                ...s,
                                selectedProductData: {
                                  ...s.selectedProductData,
                                  quantity: newQuantity
                                }
                              };
                            }
                            return s;
                          })
                        );
                      }}
                    />
                  </span>
                  <span>Precio total: <strong>{selector.selectedProductData?.price ? selector.selectedProductData.price * (selector.selectedProductData.quantity || 0) : 0}</strong></span>
                </div>
              )
            }
          </div>
        ))
      }
      <div className="d-flex justify-content-end">
        <span className="mt-3 mb-3">Total estimativo: <strong> ${productSelector.reduce((acc, selector) => acc + (selector.selectedProductData?.price || 0) * (selector.selectedProductData?.quantity || 0), 0)}</strong></span>
      </div>
      <span className="note text-muted">* Nota: Los packs pueden conformarse con cualquier cantidad de productos. El stock visible es simplemente una guía para el usuario. Antes que se registre la venta del pack, se validará si la cantidad elegida de cada producto que lo conforma, es menor o igual a su stock disponible en ese momento.</span>

      {apiPostPackItemsLoading && (
        <div className="d-flex justify-content-center mt-3">
          <Loading className="loading-container-form" />
        </div>
      )}

      {submitSuccess && !apiPostPackItemsLoading && !apiError && (
        <div className="mt-3 p-2 text-center" style={{ backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          ¡Registro creado exitosamente!
        </div>
      )}

      {apiError && !apiPostPackItemsLoading && (
        <div className="mt-3 p-2 text-center d-block message-error" style={{ backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {apiError}
        </div>
      )}
    </>
  )
}