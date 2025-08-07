import { useEffect, useState } from "react"
import { Button } from "../button/button"
import { Subsection } from "../subsection/subsection"
import { Table, type Column } from "../table/table"
import { useDeleteItemType, useGetItemType, usePatchItemType, usePostItemType } from "./hooks"
import type { ParsedItemType, ItemTypeRequest } from "./models"
import type { SubmitHandler } from "react-hook-form"
import { Loading } from "../loading/loading"
import { Filter } from "../filter/filter"
import { ModalPost } from "../modal/modalPost"
import { ModalEdit } from "../modal/modalEdit"
import { ModalDelete } from "../modal/modalDelete"
import { FormItemType } from "./components"

const columns: Column<ParsedItemType>[] = [
  { header: "N°", accessor: "item_type_id" },
  { header: "Nombre", accessor: "name" }
]

export const ItemType = () => {

  const [dataEditItemType, setDataEditItemType] = useState<ParsedItemType | null>(null);
  const [dataDeleteItemType, setDataDeleteItemType] = useState<ParsedItemType | null>(null);
  const [filteredDataItemTypes, setFilteredDataItemTypes] = useState<ParsedItemType[]>([]);

  const [successState, setSuccessState] = useState(false);

  const { dataItemType, parsedDataItemType, loading, error } = useGetItemType();
  const { postItemType, loading: apiLoadingPostItemType, error: apiErrorPostItemType } = usePostItemType();
  const { patchItemType, loading: apiLoadingPatchItemType, error: apiErrorPatchItemType } = usePatchItemType({ dataEditItemType });
  const { deleteItemType, loading: apiDeleteLoadingItemType, error: apiDeleteErrorItemType } = useDeleteItemType({ dataDeleteItemType });

  /**
   * Se ejecuta cuando se cargan los tipos de items y se setean en el estado filteredDataItemTypes.
   * Tiene la misma información que parsedDataItemType, pero es necesario para el filtrado.
   */
  useEffect(() => {
    setFilteredDataItemTypes(parsedDataItemType);
  }, [parsedDataItemType]);

  /**
   * Se ejecuta cuando se cambia el texto de búsqueda en el input del filtro.
   * Se filtra la información de parsedDataItemType y se setea en el estado filteredDataItemTypes.
   */
  const handleFilterChange = (searchText: string) => {
    if (searchText.trim() === "") {
      setFilteredDataItemTypes(parsedDataItemType);
      return;
    }

    const filtered = parsedDataItemType.filter(itemType =>
      itemType.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredDataItemTypes(filtered);
  };

  /**
   * Se ejecuta cuando se crea un tipo de item exitosamente.
   * Se setea el estado successState a true y se muestra el mensaje de éxito.
   * Se cierra el modal de creación de tipo de item y se recarga la página.
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
   * Se ejecuta cuando se envía el formulario de creación de tipo de item.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo ItemTypeRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de creación de tipo de item.
   */
  const onSubmit: SubmitHandler<ItemTypeRequest> = async (formData: ItemTypeRequest) => {
    try {
      const response = await postItemType(formData);
      if (response) {
        handleSuccess("createItemTypeModal");
      }
    } catch (error) {
      console.log('Error al crear el tipo de item', error);
    }
  };

  /**
   * Se ejecuta cuando se hace click en el botón de edición de un tipo de item.
   * Se setea el estado dataEditItemType con los datos del tipo de item.
   * Cuando se abre la modal de edición, se carga cada campo del formulario con los datos del tipo de item.
   * @param row - Datos del tipo de item.
   */
  const onEdit = (row: ParsedItemType) => {
    setDataEditItemType(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de edición de tipo de item.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo ItemTypeRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de edición de tipo de item.
   */
  const onEditSubmit: SubmitHandler<ItemTypeRequest> = async (formData: ItemTypeRequest) => {
    try {
      setDataEditItemType(prev => prev ? {
        ...prev,
        name: formData.name,
      } : null);

      const response = await patchItemType(formData);

      if (response) {
        handleSuccess("editItemTypeModal");
      }
    } catch (error) {
      console.log('Error al actualizar el tipo de item', error)
    }
  }

  /**
   * Se ejecuta cuando se hace click en el botón de eliminación de un tipo de item.
   * Se setea el estado dataDeleteItemType con los datos del tipo de item.
   * @param row - Datos del tipo de item.
   */
  const onDelete = async (row: ParsedItemType) => {
    setDataDeleteItemType(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de eliminación de tipo de item.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo ItemTypeRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de eliminación de tipo de item.
   */
  const onDeleteSubmit = async () => {
    try {
      const response = await deleteItemType();
      if (response) {
        handleSuccess("deleteItemTypeModal");
      }
    } catch (error) {
      console.log('Error al eliminar el tipo de item', error);
    }
  }

  return (
    <>
      <Subsection
        title="Tipos de items"
        description="Gestiona los tipos de items de la aplicación.">

        <Button
          label="Crear tipo de item"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createItemTypeModal"
        />

        <Filter onFilterChange={handleFilterChange} />

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />
            if (error && !loading) return <div>{error.message}</div>;
            if (dataItemType.length === 0 && !loading) return <div className="no-results-message"><span>No hay datos.</span></div>;
            if (filteredDataItemTypes.length === 0 && !loading) return <div className="no-results-message"><span>No se encontraron coincidencias.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredDataItemTypes}
                classNameEspecificTable="table-item-types"
                dataBsToggle="modal"
                dataBsTargetEdit="#editItemTypeModal"
                dataBsTargetDelete="#deleteItemTypeModal"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })()}
        </div>
      </Subsection>

      <ModalPost
        id="createItemTypeModal"
        title="Crear tipo de item"
        formId="createItemTypeForm"
        loading={apiLoadingPostItemType}>

        <FormItemType
          idModal="createItemTypeModal"
          formId="createItemTypeForm"
          onSubmit={onSubmit}
          apiLoading={apiLoadingPostItemType}
          apiError={apiErrorPostItemType}
          mode="create"
          success={successState}
          successMessage="¡Tipo de item creado exitosamente!"
        />

      </ModalPost>

      <ModalEdit
        id="editItemTypeModal"
        title="Editar tipo de item"
        formId="editItemTypeForm"
        loading={apiLoadingPatchItemType}>

        <FormItemType
          idModal="editItemTypeModal"
          formId="editItemTypeForm"
          onSubmit={onEditSubmit}
          apiLoading={apiLoadingPatchItemType}
          apiError={apiErrorPatchItemType}
          mode="edit"
          success={successState}
          successMessage="¡Tipo de item actualizado exitosamente!"
          initialValues={dataEditItemType ? {
            name: dataEditItemType.name,
          } : undefined}
        />

      </ModalEdit>

      <ModalDelete
        id="deleteItemTypeModal"
        title="Eliminar tipo de item"
        loading={apiDeleteLoadingItemType}
        onDelete={onDeleteSubmit}>

        <FormItemType
          idModal="deleteItemTypeModal"
          formId="deleteItemTypeForm"
          onSubmit={onDeleteSubmit}
          apiLoading={apiDeleteLoadingItemType}
          apiError={apiDeleteErrorItemType}
          mode="delete"
          success={successState}
          successMessage="¡Tipo de item eliminado exitosamente!"
          initialValues={dataDeleteItemType ? {
            name: dataDeleteItemType.name,
          } : undefined}
        />

      </ModalDelete>
    </>
  )
}