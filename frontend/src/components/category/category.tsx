import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import "./category.css";
import type { Category, CategoryRequest, ParsedCategory } from "./models";
import { parseCategoryData, parseCategoryDataForBackend } from "./utils";
import { useApi } from "../../hooks";
import type { SubmitHandler } from "react-hook-form";
import { FormCategory } from "./components/formCategory";
import { ModalEdit } from "../modal/modalEdit";
import { useEffect, useState } from "react";
import { ModalDelete } from "../modal/modalDelete";
import { Filter } from "../filter/filter";

const columns: Column<ParsedCategory>[] = [
  { header: "N°", accessor: "category_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
]

export const Categories = () => {

  const [filteredData, setFilteredData] = useState<ParsedCategory[]>([]);
  const [dataEditCategory, setDataEditCategory] = useState<ParsedCategory | null>(null);
  const [dataDeleteCategory, setDataDeleteCategory] = useState<ParsedCategory | null>(null);

  const { data, loading, error } = useApi<{ status: string, message: string, data: Category[] }>({
    url: "http://localhost:3000/api/v1/categories",
    method: "GET",
    autoFetch: true
  });

  const { trigger: triggerPost, loading: apiLoading, error: apiError } = useApi<CategoryRequest>({
    url: "http://localhost:3000/api/v1/categories",
    method: "POST"
  });

  const { trigger: triggerEdit, loading: apiEditLoading, error: apiEditError } = useApi<CategoryRequest>({
    id: dataEditCategory?.category_id,
    url: "http://localhost:3000/api/v1/categories",
    method: "PATCH"
  });

  const { trigger: triggerDelete, loading: apiDeleteLoading, error: apiDeleteError } = useApi<CategoryRequest>({
    id: dataDeleteCategory?.category_id,
    url: "http://localhost:3000/api/v1/categories",
    method: "DELETE"
  });

  useEffect(() => {
    if (data) {
      const categories = data.data;
      const parsedCategories = parseCategoryData(categories);
      setFilteredData(parsedCategories);
    }
  }, [data]);

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const onSubmit: SubmitHandler<CategoryRequest> = async (formData: CategoryRequest) => {
    const categoryData = parseCategoryDataForBackend(formData);

    await triggerPost(categoryData as CategoryRequest);
  };

  const onEdit = (row: ParsedCategory) => {
    setDataEditCategory(row);
  }

  const onEditSubmit: SubmitHandler<CategoryRequest> = async (formData: CategoryRequest) => {
    const categoryData = parseCategoryDataForBackend(formData);

    await triggerEdit(categoryData as CategoryRequest);
  }

  const onDelete = async (row: ParsedCategory) => {
    setDataDeleteCategory(row);
  }

  const onDeleteSubmit = async () => {
    await triggerDelete(dataDeleteCategory as CategoryRequest);
  }

  const onFilterChange = (searchText: string) => {
    const originalData = parseCategoryData(data?.data || []);

    if (searchText.trim() === "") {
      setFilteredData(originalData);
      return;
    }

    const filtered = originalData.filter(category =>
      category.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredData(filtered);
  }

  return (
    <>
      <Section
        title="Categorías"
        description="Gestiona la carga, modificación y eliminación de las categorías de los productos.">

        <Button
          label="Crear categoría"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createCategoryModal" />

        <Filter onFilterChange={onFilterChange} />

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />;
            if (!data?.data || data.data.length === 0) return <div className="no-results-message"><span>No hay categorías.</span></div>;
            if (filteredData.length === 0) return <div className="no-results-message"><span>No se encontraron resultados.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredData}
                classNameEspecificTable="table-categories"
                dataBsToggle="modal"
                dataBsTargetEdit="#editCategoryModal"
                dataBsTargetDelete="#deleteCategoryModal"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })()}
        </div>
      </Section>

      <ModalPost
        id="createCategoryModal"
        title="Crear categoría"
        formId="createCategoryForm"
        loading={apiLoading}>

        <FormCategory
          idModal="createCategoryModal"
          formId="createCategoryForm"
          onSubmit={onSubmit}
          apiLoading={apiLoading}
          apiError={apiError}
          mode="create"
        />

      </ModalPost>

      <ModalEdit
        id="editCategoryModal"
        title="Editar categoría"
        formId="editCategoryForm"
        loading={apiEditLoading}>

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

      <ModalDelete
        id="deleteCategoryModal"
        title="Eliminar categoría"
        loading={apiDeleteLoading}
        onDelete={onDeleteSubmit}>

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