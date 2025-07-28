import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import type { ParsedProduct } from "./models";
import { parseProductData, parseProductDataForBackend } from "./utils";
import type { Product, ProductRequest } from "./models/product.model";
import "./product.css";
import type { SubmitHandler } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { ModalEdit } from "../modal/modalEdit";
import { FormProduct } from "./components/formProduct";
import { useState } from "react";
import { ModalDelete } from "../modal/modalDelete";

const columns: Column<ParsedProduct>[] = [
  { header: "ID", accessor: "product_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Precio", accessor: "price" },
  { header: "Stock", accessor: "stock" },
  { header: "Activo", accessor: "active" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
];

export const Products = () => {

  const { data, loading, error } = useApi<{ status: string, message: string, data: Product[] }>({
    url: "http://localhost:3000/api/v1/products",
    method: "GET",
    autoFetch: true
  });

  const { trigger: triggerPost, loading: apiLoading, error: apiError } = useApi<ProductRequest>({
    url: "http://localhost:3000/api/v1/products",
    method: "POST"
  });

  const [dataEditProduct, setDataEditProduct] = useState<ParsedProduct | null>(null);

  const { trigger: triggerEdit, loading: apiEditLoading, error: apiEditError } = useApi<ProductRequest>({
    id: dataEditProduct?.product_id,
    url: "http://localhost:3000/api/v1/products",
    method: "PATCH"
  });

  const [dataDeleteProduct, setDataDeleteProduct] = useState<ParsedProduct | null>(null);

  const { trigger: triggerDelete, loading: apiDeleteLoading, error: apiDeleteError } = useApi<ProductRequest>({
    id: dataDeleteProduct?.product_id,
    url: "http://localhost:3000/api/v1/products",
    method: "DELETE"
  });

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const products = data?.data || [];
  const handleData: ParsedProduct[] = parseProductData(products);

  const onSubmit: SubmitHandler<ProductRequest> = async (formData: ProductRequest) => {
    const productData = parseProductDataForBackend(formData);

    await triggerPost(productData as ProductRequest);
  };

  const onEdit = (row: ParsedProduct) => {
    setDataEditProduct(row);
  }

  const onEditSubmit: SubmitHandler<ProductRequest> = async (formData: ProductRequest) => {
    const productData = parseProductDataForBackend(formData);

    await triggerEdit(productData as ProductRequest);
  }

  const onDelete = (row: ParsedProduct) => {
    setDataDeleteProduct(row);
  }

  const onDeleteSubmit = async () => {
    await triggerDelete(dataDeleteProduct as unknown as ProductRequest);
  }

  return (
    <>
      <Section
        title="Productos"
        description="Gestiona la carga, modificación y eliminación de los productos que vendes.">

        <Button
          label="Crear producto"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createProductModal" />

        <div className="table-container">
          {products.length > 0 ? (
            <Table
              columns={columns}
              data={handleData}
              classNameEspecificTable="table-products"
              dataBsToggle="modal"
              dataBsTargetEdit="#editProductModal"
              dataBsTargetDelete="#deleteProductModal"
              onEdit={onEdit}
              onDelete={onDelete} />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>

      <ModalPost
        id="createProductModal"
        title="Crear producto"
        formId="createProductForm"
        loading={apiLoading}>

        <FormProduct
          idModal="createProductModal"
          formId="createProductForm"
          onSubmit={onSubmit}
          apiLoading={apiLoading}
          apiError={apiError}
          mode="create"
        />

      </ModalPost>

      <ModalEdit
        id="editProductModal"
        title="Editar producto"
        formId="editProductForm"
        loading={apiEditLoading}>

        <FormProduct
          idModal="editProductModal"
          formId="editProductForm"
          onSubmit={onEditSubmit}
          apiLoading={apiEditLoading}
          apiError={apiEditError}
          mode="edit"
          initialValues={dataEditProduct ? {
            name: dataEditProduct.name,
            description: dataEditProduct.description,
            price: dataEditProduct.price,
            stock: dataEditProduct.stock,
            active: dataEditProduct.active === "false"
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
          initialValues={dataDeleteProduct ? {
            name: dataDeleteProduct.name,
            description: dataDeleteProduct.description,
            price: dataDeleteProduct.price,
            stock: dataDeleteProduct.stock,
            active: dataDeleteProduct.active === "true"
          } : undefined}
        />

      </ModalDelete>
    </>
  );
}