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
import { useState } from "react";
import { ModalDelete } from "../modal/modalDelete";
// import { ModalDelete } from "../modal/modalDelete";

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

  const [dataEditCategory, setDataEditCategory] = useState<ParsedCategory | null>(null);

  const { trigger: triggerEdit, loading: apiEditLoading, error: apiEditError } = useApi<CategoryRequest>({
    id: dataEditCategory?.category_id,
    url: "http://localhost:3000/api/v1/categories",
    method: "PATCH"
  });

  const [dataDeleteCategory, setDataDeleteCategory] = useState<ParsedCategory | null>(null);

  const { trigger: triggerDelete, loading: apiDeleteLoading, error: apiDeleteError } = useApi<CategoryRequest>({
    id: dataDeleteCategory?.category_id,
    url: "http://localhost:3000/api/v1/categories",
    method: "DELETE"
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

  const onEdit = (row: ParsedCategory) => {
    setDataEditCategory(row);
  }

  const onEditSubmit: SubmitHandler<CategoryRequest> = async (categoryData: CategoryRequest) => {
    await triggerEdit(categoryData as CategoryRequest);
  }

  const onDelete = async (row: ParsedCategory) => {
    setDataDeleteCategory(row);
  }

  const onDeleteSubmit = async () => {
    await triggerDelete(dataDeleteCategory as CategoryRequest);
  }

  return (
    <>
      <Section title="Categorías" description="Gestiona la carga, modificación y eliminación de las categorías de los productos.">
        <Button label="Crear categoría" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createCategoryModal" />
        <div className="table-container">
          {categories.length > 0 ? (
            <Table columns={columns} data={handleData} classNameEspecificTable="table-categories" dataBsToggle="modal" dataBsTargetEdit="#editCategoryModal" dataBsTargetDelete="#deleteCategoryModal" onEdit={onEdit} onDelete={onDelete} />
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
          mode="create"
        />
      </ModalPost>

      <ModalEdit id="editCategoryModal" title="Editar categoría" formId="editCategoryForm" loading={apiEditLoading}>
        <FormCategory
          idModal="editCategoryModal"
          formId="editCategoryForm"
          onSubmit={onEditSubmit}
          apiLoading={apiEditLoading}
          apiError={apiEditError}
          mode="edit"
          initialValues={dataEditCategory ? {
            name: dataEditCategory.name,
            description: dataEditCategory.description
          } : undefined}
        />
      </ModalEdit>

      <ModalDelete id="deleteCategoryModal" title="Eliminar categoría" loading={apiDeleteLoading} onDelete={onDeleteSubmit}>
        <FormCategory
          idModal="deleteCategoryModal"
          formId="deleteCategoryForm"
          onSubmit={onDeleteSubmit}
          apiLoading={apiDeleteLoading}
          apiError={apiDeleteError}
          mode="delete"
          initialValues={dataDeleteCategory ? {
            name: dataDeleteCategory.name,
            description: dataDeleteCategory.description
          } : undefined}
        />
      </ModalDelete>
    </>
  );

}