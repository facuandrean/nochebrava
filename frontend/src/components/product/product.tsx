import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import type { ParsedProduct } from "./models";
import type { ProductRequest } from "./models/product.model";
import "./product.css";
import type { SubmitHandler } from "react-hook-form";
import { ModalEdit } from "../modal/modalEdit";
import { FormProduct } from "./components/formProduct";
import { useEffect, useState } from "react";
import { ModalDelete } from "../modal/modalDelete";
import { Filter } from "../filter";
import { useDeleteProducts, useGetProducts, usePatchProducts, usePostProducts } from "./hooks";

const columns: Column<ParsedProduct>[] = [
  { header: "N°", accessor: "product_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Precio", accessor: "price" },
  { header: "Stock", accessor: "stock" },
  { header: "Activo", accessor: "active" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
];

export const Products = () => {

  const [dataEditProduct, setDataEditProduct] = useState<ParsedProduct | null>(null);
  const [dataDeleteProduct, setDataDeleteProduct] = useState<ParsedProduct | null>(null);
  const [filteredDataProducts, setFilteredDataProducts] = useState<ParsedProduct[]>([]);

  const [successState, setSuccessState] = useState(false);

  const { products, parsedDataProducts, loading, error } = useGetProducts();
  const { postProduct, loading: apiLoadingPost, error: apiErrorPost } = usePostProducts();
  const { patchProduct, loading: apiLoadingPatch, error: apiErrorPatch } = usePatchProducts({ dataEditProduct });
  const { deleteProduct, loading: apiDeleteLoading, error: apiDeleteError } = useDeleteProducts({ dataDeleteProduct });

  /**
   * Se ejecuta cuando se cargan los productos y se setean en el estado filteredDataProducts.
   * Tiene la misma información que parsedDataProducts, pero es necesario para el filtrado.
   */
  useEffect(() => {
    setFilteredDataProducts(parsedDataProducts);
  }, [parsedDataProducts]);

  /**
   * Se ejecuta cuando se cambia el texto de búsqueda en el input del filtro.
   * Se filtra la información de parsedDataProducts y se setea en el estado filteredDataProducts.
   */
  const handleFilterChange = (searchText: string) => {
    if (searchText.trim() === "") {
      setFilteredDataProducts(parsedDataProducts);
      return;
    }

    const filtered = parsedDataProducts.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredDataProducts(filtered);
  };

  /**
   * Se ejecuta cuando se crea un producto exitosamente.
   * Se setea el estado successState a true y se muestra el mensaje de éxito.
   * Se cierra el modal de creación de producto y se recarga la página.
   */
  const handleSuccess = (idModal: string) => {
    setSuccessState(true);
    setTimeout(() => {
      setSuccessState(false);

      const modal = document.getElementById(idModal);
      if (modal) {
        const bootstrapModal = (window as typeof window & { bootstrap?: { Modal?: { getInstance: (element: Element) => { hide: () => void } | null } } }).bootstrap?.Modal?.getInstance(modal);
        bootstrapModal?.hide();
      }

      window.location.reload();
    }, 2000);
  }

  /**
   * Se ejecuta cuando se envía el formulario de creación de producto.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo ProductRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de creación de producto.
   */
  const onSubmit: SubmitHandler<ProductRequest> = async (formData: ProductRequest) => {
    try {
      const response = await postProduct(formData);
      if (response) {
        handleSuccess("createProductModal");
      }
    } catch (error) {
      console.log('Error al crear el producto', error);
    }
  };

  /**
   * Se ejecuta cuando se hace click en el botón de edición de un producto.
   * Se setea el estado dataEditProduct con los datos del producto.
   * Cuando se abre la modal de edición, se carga cada campo del formulario con los datos del producto.
   * @param row - Datos del producto.
   */
  const onEdit = (row: ParsedProduct) => {
    setDataEditProduct(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de edición de producto.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo ProductRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de edición de producto.
   */
  const onEditSubmit: SubmitHandler<ProductRequest> = async (formData: ProductRequest) => {
    try {
      setDataEditProduct(prev => prev ? {
        ...prev,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        active: formData.active ? "Si" : "No"
      } : null);

      const response = await patchProduct(formData);

      if (response) {
        handleSuccess("editProductModal");
      }
    } catch (error) {
      console.log('Error al actualizar el producto', error)
    }
  }

  /**
   * Se ejecuta cuando se hace click en el botón de eliminación de un producto.
   * Se setea el estado dataDeleteProduct con los datos del producto.
   * @param row - Datos del producto.
   */
  const onDelete = async (row: ParsedProduct) => {
    setDataDeleteProduct(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de eliminación de producto.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo ProductRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de eliminación de producto.
   */
  const onDeleteSubmit = async () => {
    try {
      const response = await deleteProduct();
      if (response) {
        handleSuccess("deleteProductModal");
      }
    } catch (error) {
      console.log('Error al eliminar el producto', error);
    }
  }

  return (
    <>
      <Section
        title="Administrar Productos"
        description="Gestiona la carga, modificación y eliminación de los productos.">

        <Button
          label="Crear producto"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createProductModal" />

        <Filter onFilterChange={handleFilterChange} />

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />
            if (error && !loading) return <div>{error.message}</div>;
            if (products.length === 0 && !loading) return <div className="no-results-message"><span>No hay datos.</span></div>;
            if (filteredDataProducts.length === 0 && !loading) return <div className="no-results-message"><span>No se encontraron coincidencias.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredDataProducts}
                classNameEspecificTable="table-products"
                dataBsToggle="modal"
                dataBsTargetEdit="#editProductModal"
                dataBsTargetDelete="#deleteProductModal"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })()}
        </div>
      </Section>

      <ModalPost
        id="createProductModal"
        title="Crear producto"
        formId="createProductForm"
        loading={apiLoadingPost}>

        <FormProduct
          idModal="createProductModal"
          formId="createProductForm"
          onSubmit={onSubmit}
          apiLoading={apiLoadingPost}
          apiError={apiErrorPost}
          mode="create"
          success={successState}
          successMessage="¡Producto creado exitosamente!"
        />

      </ModalPost>

      <ModalEdit
        id="editProductModal"
        title="Editar producto"
        formId="editProductForm"
        loading={apiLoadingPatch}>

        <FormProduct
          idModal="editProductModal"
          formId="editProductForm"
          onSubmit={onEditSubmit}
          apiLoading={apiLoadingPatch}
          apiError={apiErrorPatch}
          mode="edit"
          success={successState}
          successMessage="¡Producto actualizado exitosamente!"
          initialValues={dataEditProduct ? {
            name: dataEditProduct.name,
            description: dataEditProduct.description,
            price: dataEditProduct.price,
            stock: dataEditProduct.stock,
            active: dataEditProduct.active === "Si" ? true : false
          } : undefined}
        />

      </ModalEdit>

      <ModalDelete
        id="deleteProductModal"
        title="Eliminar producto"
        loading={apiDeleteLoading}
        onDelete={onDeleteSubmit}>

        <FormProduct
          idModal="deleteProductModal"
          formId="deleteProductForm"
          onSubmit={onDeleteSubmit}
          apiLoading={apiDeleteLoading}
          apiError={apiDeleteError}
          mode="delete"
          success={successState}
          successMessage="¡Producto eliminado exitosamente!"
          initialValues={dataDeleteProduct ? {
            name: dataDeleteProduct.name,
            description: dataDeleteProduct.description,
            price: dataDeleteProduct.price,
            stock: dataDeleteProduct.stock,
            active: dataDeleteProduct.active === "Si"
          } : undefined}
        />

      </ModalDelete>
    </>
  );

}