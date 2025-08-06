import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import "./category.css";
import type { CategoryRequest, ParsedCategory } from "./models";
import type { SubmitHandler } from "react-hook-form";
import { ModalEdit } from "../modal/modalEdit";
import { useEffect, useState } from "react";
import { ModalDelete } from "../modal/modalDelete";
import { Filter } from "../filter";
import { FormCategory } from "./components";
import { useGetCategories } from "./hooks";
import { usePostCategories } from "./hooks/usePostCategories";
import { usePatchCategories } from "./hooks/usePutCategories";
import { useDeleteCategories } from "./hooks/useDeleteCategories";

const columns: Column<ParsedCategory>[] = [
  { header: "N°", accessor: "category_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
]

export const Categories = () => {

  const [dataEditCategory, setDataEditCategory] = useState<ParsedCategory | null>(null);
  const [dataDeleteCategory, setDataDeleteCategory] = useState<ParsedCategory | null>(null);
  const [filteredDataCategories, setFilteredDataCategories] = useState<ParsedCategory[]>([]);

  const [successState, setSuccessState] = useState(false);

  const { parsedDataCategories, loading, error } = useGetCategories();
  const { postCategory, loading: apiLoadingPost, error: apiErrorPost } = usePostCategories();
  const { patchCategory, loading: apiLoadingPatch, error: apiErrorPatch } = usePatchCategories({ dataEditCategory });
  const { deleteCategory, loading: apiDeleteLoading, error: apiDeleteError } = useDeleteCategories({ dataDeleteCategory });

  /**
   * Se ejecuta cuando se cargan las categorías y se setean en el estado filteredDataCategories.
   * Tiene la misma información que parsedDataCategories, pero es necesario para el filtrado.
   */
  useEffect(() => {
    setFilteredDataCategories(parsedDataCategories);
  }, [parsedDataCategories]);

  /**
   * Se ejecuta cuando se cambia el texto de búsqueda en el input del filtro.
   * Se filtra la información de parsedDataCategories y se setea en el estado filteredDataCategories.
   */
  const handleFilterChange = (searchText: string) => {
    if (searchText.trim() === "") {
      setFilteredDataCategories(parsedDataCategories);
      return;
    }

    const filtered = parsedDataCategories.filter(category =>
      category.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredDataCategories(filtered);
  };

  /**
   * Se ejecuta cuando se crea una categoría exitosamente.
   * Se setea el estado successState a true y se muestra el mensaje de éxito.
   * Se cierra el modal de creación de categoría y se recarga la página.
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
   * Se ejecuta cuando se envía el formulario de creación de categoría.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo CategoryRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de creación de categoría.
   */
  const onSubmit: SubmitHandler<CategoryRequest> = async (formData: CategoryRequest) => {
    try {
      const response = await postCategory(formData);
      if (response) {
        handleSuccess("createCategoryModal");
      }
    } catch (error) {
      console.log('Error al crear la categoría', error);
    }
  };

  /**
   * Se ejecuta cuando se hace click en el botón de edición de una categoría.
   * Se setea el estado dataEditCategory con los datos de la categoría.
   * Cuando se abre la modal de edición, se carga cada campo del formulario con los datos de la categoría.
   * @param row - Datos de la categoría.
   */
  const onEdit = (row: ParsedCategory) => {
    setDataEditCategory(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de edición de categoría.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo CategoryRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de edición de categoría.
   */
  const onEditSubmit: SubmitHandler<CategoryRequest> = async (formData: CategoryRequest) => {
    try {
      const response = await patchCategory(formData);
      if (response) {
        handleSuccess("editCategoryModal");
      }
    } catch (error) {
      console.log('Error al actualizar la categoría', error)
    }
  }

  /**
   * Se ejecuta cuando se hace click en el botón de eliminación de una categoría.
   * Se setea el estado dataDeleteCategory con los datos de la categoría.
   * @param row - Datos de la categoría.
   */
  const onDelete = async (row: ParsedCategory) => {
    setDataDeleteCategory(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de eliminación de categoría.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo CategoryRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de eliminación de categoría.
   */
  const onDeleteSubmit = async () => {
    try {
      const response = await deleteCategory();
      if (response) {
        handleSuccess("deleteCategoryModal");
      }
    } catch (error) {
      console.log('Error al eliminar la categoría', error);
    }
  }

  if (error && !loading) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  return (
    <>
      <Section
        title="Administrar Categorías"
        description="Gestiona la carga, modificación y eliminación de las categorías de los productos.">

        <Button
          label="Crear categoría"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createCategoryModal" />

        <Filter onFilterChange={handleFilterChange} />

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />;
            if (filteredDataCategories.length === 0 && !loading) return <div className="no-results-message"><span>No se encontraron coincidencias.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredDataCategories}
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
        loading={apiLoadingPost}>

        <FormCategory
          idModal="createCategoryModal"
          formId="createCategoryForm"
          onSubmit={onSubmit}
          apiLoading={apiLoadingPost}
          apiError={apiErrorPost}
          mode="create"
          success={successState}
          successMessage="¡Categoría creada exitosamente!"
        />

      </ModalPost>

      <ModalEdit
        id="editCategoryModal"
        title="Editar categoría"
        formId="editCategoryForm"
        loading={apiLoadingPatch}>

        <FormCategory
          idModal="editCategoryModal"
          formId="editCategoryForm"
          onSubmit={onEditSubmit}
          apiLoading={apiLoadingPatch}
          apiError={apiErrorPatch}
          mode="edit"
          success={successState}
          successMessage="¡Categoría actualizada exitosamente!"
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
          success={successState}
          successMessage="¡Categoría eliminada exitosamente!"
          initialValues={dataDeleteCategory ? {
            name: dataDeleteCategory.name,
            description: dataDeleteCategory.description
          } : undefined}
        />

      </ModalDelete>
    </>
  );

}