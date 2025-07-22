import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import "./category.css";
import type { Category, CategoryRequest } from "./models";
import { useCategory } from "./hooks";
import { parseCategoryData } from "./utils";
import { useApi } from "../../hooks";
import type { SubmitHandler } from "react-hook-form";
import { GenericForm } from "../form/genericForm";
import { InputForm } from "../form/components/genericInput";

const columns: Column<Category>[] = [
  { header: "ID", accessor: "category_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
]

const defaultValues: CategoryRequest = {
  name: "",
  description: ""
}

const url = "http://localhost:3000/api/v1/categories";

export const Categories = () => {

  const { categories, loading, error } = useCategory();

  const { trigger, loading: apiLoading, error: apiError } = useApi<CategoryRequest>({
    url,
    method: "POST"
  });

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const handleData: Category[] = parseCategoryData(categories);

  const onSubmit: SubmitHandler<CategoryRequest> = async (formData: CategoryRequest) => {
    const categoryData: Partial<CategoryRequest> = {
      name: formData.name,
      description: formData.description
    };

    if (formData.description && formData.description.trim().length >= 10) categoryData.description = formData.description.trim();

    await trigger(categoryData as CategoryRequest);
  }


  return (
    <>
      <Section title="Categorías" description="Gestiona la carga, modificación y eliminación de las categorías de los productos.">
        <Button label="Crear categoría" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createCategoryModal" />
        <div className="table-container">
          {categories.length > 0 ? (
            <Table columns={columns} data={handleData} classNameEspecificTable="table-categories" />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>
      <ModalPost id="createCategoryModal" title="Crear categoría">
        <GenericForm<CategoryRequest>
          idModal="createCategoryModal"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          loading={apiLoading}
          error={apiError}
        >
          {({ control, errors }) => (
            <>
              <InputForm
                name="name"
                label="Nombre de la categoría"
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
                label="Descripción de la categoría"
                control={control}
                errors={errors}
                type="textarea"
                rules={{
                  validate: (value: string | number | boolean) => {
                    const strValue = String(value || "");
                    if (!strValue || strValue.trim() === "") return true;
                    return strValue.trim().length >= 10 || "Debe tener al menos 10 caracteres si se proporciona.";
                  }
                }}
              />
            </>
          )}
        </GenericForm>
      </ModalPost>
    </>
  );

}