import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import type { ParsedProduct } from "./models";
import { parseProductData } from "./utils";
import type { Product, ProductRequest } from "./models/product.model";
import "./product.css";
import type { SubmitHandler } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { ModalEdit } from "../modal/modalEdit";
import { FormProduct } from "./components/form";

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

  const { trigger, loading: apiLoading, error: apiError } = useApi<ProductRequest>({
    url: "http://localhost:3000/api/v1/products",
    method: "POST"
  });

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const products = data?.data || [];
  const handleData: ParsedProduct[] = parseProductData(products);

  const onSubmit: SubmitHandler<ProductRequest> = async (formData: ProductRequest) => {
    const productData: Partial<ProductRequest> = {};
    if (formData.name) productData.name = formData.name;
    if (formData.description && formData.description.trim().length >= 10) productData.description = formData.description.trim();
    if (formData.price) productData.price = Number(formData.price);
    productData.stock = Number(formData.stock);
    productData.active = formData.active;

    await trigger(productData as ProductRequest);
  };

  return (
    <>
      <Section title="Productos" description="Gestiona la carga, modificación y eliminación de los productos que vendes.">
        <Button label="Crear producto" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createProductModal" />
        <div className="table-container">
          {products.length > 0 ? (
            <Table columns={columns} data={handleData} classNameEspecificTable="table-products" dataBsToggle="modal" dataBsTargetEdit="#editProductModal" dataBsTargetDelete="#deleteProductModal" />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>

      <ModalPost id="createProductModal" title="Crear producto" formId="createProductForm" loading={apiLoading}>
        <FormProduct
          idModal="createProductModal"
          formId="createProductForm"
          onSubmit={onSubmit}
          apiLoading={apiLoading}
          apiError={apiError}
        />
      </ModalPost>

      <ModalEdit id="editProductModal" title="Editar producto" formId="editProductForm" loading={apiLoading}>
        <FormProduct
          idModal="editProductModal"
          formId="editProductForm"
          onSubmit={onSubmit}
          apiLoading={apiLoading}
          apiError={apiError}
        />
      </ModalEdit>
    </>
  );
}