import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import { useProduct } from "./hooks";
import type { ParsedProduct } from "./models";
import { parseProductData } from "./utils";
import type { ProductRequest } from "./models/product.model";
import "./product.css";
import { GenericForm } from "../form/genericForm";
import { InputForm } from "../form/components/genericInput";
import type { SubmitHandler } from "react-hook-form";
import { useApi } from "../../hooks/useApi";

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

const defaultValues: ProductRequest = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  active: true
};

const url = "http://localhost:3000/api/v1/products";

export const Products = () => {
  const { products, loading, error } = useProduct();

  const { trigger, loading: apiLoading, error: apiError } = useApi<ProductRequest>({
    url,
    method: "POST"
  });

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const handleData: ParsedProduct[] = parseProductData(products);

  const onSubmit: SubmitHandler<ProductRequest> = async (formData: ProductRequest) => {
    const productData: Partial<ProductRequest> = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      active: formData.active
    };

    if (formData.description && formData.description.trim().length >= 10) productData.description = formData.description.trim();

    await trigger(productData as ProductRequest);
  };

  return (
    <>
      <Section title="Productos" description="Gestiona la carga, modificación y eliminación de los productos que vendes.">
        <Button label="Crear producto" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createProductModal" />
        <div className="table-container">
          {products.length > 0 ? (
            <Table columns={columns} data={handleData} />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>
      <ModalPost id="createProductModal" title="Crear producto">
        <GenericForm<ProductRequest>
          idModal="createProductModal"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          loading={apiLoading}
          error={apiError}
        >
          {({ control, errors }) => (
            <>
              <InputForm
                name="name"
                label="Nombre del producto"
                control={control}
                errors={errors}
                type="text"
                rules={{
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 3,
                    message: "Debe obtener al menos 3 caracteres."
                  }
                }}
              />
              <InputForm
                name="description"
                label="Descripción (opcional)"
                control={control}
                errors={errors}
                type="textarea"
                rules={{
                  validate: (value: string | number | boolean) => {
                    const strValue = String(value || "");
                    if (!strValue || strValue.trim() === "") return true; // Permite vacío
                    return strValue.trim().length >= 10 || "Debe tener al menos 10 caracteres si se proporciona.";
                  }
                }}
              />
              <InputForm
                name="price"
                label="Precio"
                control={control}
                errors={errors}
                type="number"
                rules={{
                  required: "El precio es obligatorio",
                  min: {
                    value: 1,
                    message: "El precio debe ser mayor a 0."
                  }
                }}
              />
              <InputForm
                name="stock"
                label="Stock"
                control={control}
                errors={errors}
                type="number"
                rules={{
                  required: "El stock es obligatorio",
                  min: {
                    value: 0,
                    message: "El stock debe ser mayor o igual a 0."
                  }
                }}
              />
              <InputForm
                name="active"
                label="Activo"
                control={control}
                errors={errors}
                type="checkbox"
              />
            </>
          )}
        </GenericForm>
      </ModalPost>
    </>
  );
}