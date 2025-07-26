import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import "./category.css";
import type { Category, CategoryRequest, ParsedCategory } from "./models";
import { parseCategoryData } from "./utils";
import { useApi } from "../../hooks";
import type { SubmitHandler } from "react-hook-form";
import { FormCategory } from "./components/formCategory";
import { ModalEdit } from "../modal/modalEdit";

const columns: Column<ParsedCategory>[] = [
  { header: "ID", accessor: "category_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
]

export const Categories = () => {

  const { data, loading, error } = useApi<{ status: string, message: string, data: Category[] }>({
    url: "http://localhost:3000/api/v1/categories",
    method: "GET",
    autoFetch: true
  });

  const { trigger, loading: apiLoading, error: apiError } = useApi<CategoryRequest>({
    url: "http://localhost:3000/api/v1/categories",
    method: "POST"
  });

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const categories = data?.data || [];
  const handleData: ParsedCategory[] = parseCategoryData(categories);

  const onSubmit: SubmitHandler<CategoryRequest> = async (formData: CategoryRequest) => {
    const productData: Partial<CategoryRequest> = {};
    if (formData.name) productData.name = formData.name;
    if (formData.description && formData.description.trim().length >= 10) productData.description = formData.description.trim();

    await trigger(productData as CategoryRequest);
  };


  return (
    <>
      <Section title="Categorías" description="Gestiona la carga, modificación y eliminación de las categorías de los productos.">
        <Button label="Crear categoría" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createCategoryModal" />
        <div className="table-container">
          {categories.length > 0 ? (
            <Table columns={columns} data={handleData} classNameEspecificTable="table-categories" dataBsToggle="modal" dataBsTargetEdit="#editCategoryModal" dataBsTargetDelete="#deleteCategoryModal" />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>

      <ModalPost id="createCategoryModal" title="Crear categoría" formId="createCategoryForm" loading={apiLoading}>
        <FormCategory
          idModal="createCategoryModal"
          formId="createCategoryForm"
          onSubmit={onSubmit}
          apiLoading={apiLoading}
          apiError={apiError}
        />
      </ModalPost>

      <ModalEdit id="editCategoryModal" title="Editar categoría" formId="editCategoryForm" loading={apiLoading}>
        <FormCategory
          idModal="editCategoryModal"
          formId="editCategoryForm"
          onSubmit={onSubmit}
          apiLoading={apiLoading}
          apiError={apiError}
        />
      </ModalEdit>
    </>
  );

}