import { useEffect, useState } from "react"
import { Button } from "../button/button"
import { Subsection } from "../subsection/subsection"
import { Table, type Column } from "../table/table"
import { useDeletePaymentMethod, useGetPaymentMethod, usePatchPaymentMethod, usePostPaymentMethod } from "./hooks"
import type { ParsedPaymentMethod, PaymentMethodRequest } from "./models"
import type { SubmitHandler } from "react-hook-form"
import { Loading } from "../loading/loading"
import { Filter } from "../filter/filter"
import { ModalPost } from "../modal/modalPost"
import { ModalEdit } from "../modal/modalEdit"
import { ModalDelete } from "../modal/modalDelete"
import { FormPaymentMethod } from "./components"

const columns: Column<ParsedPaymentMethod>[] = [
  { header: "N°", accessor: "payment_method_id" },
  { header: "Nombre", accessor: "name" }
]

export const PaymentMethod = () => {

  const [dataEditPaymentMethod, setDataEditPaymentMethod] = useState<ParsedPaymentMethod | null>(null);
  const [dataDeletePaymentMethod, setDataDeletePaymentMethod] = useState<ParsedPaymentMethod | null>(null);
  const [filteredDataPaymentMethods, setFilteredDataPaymentMethods] = useState<ParsedPaymentMethod[]>([]);

  const [successState, setSuccessState] = useState(false);

  const { dataPaymentMethod, parsedDataPaymentMethod, loading, error } = useGetPaymentMethod();
  const { postPaymentMethod, loading: apiLoadingPostPaymentMethod, error: apiErrorPostPaymentMethod } = usePostPaymentMethod();
  const { patchPaymentMethod, loading: apiLoadingPatchPaymentMethod, error: apiErrorPatchPaymentMethod } = usePatchPaymentMethod({ dataEditPaymentMethod });
  const { deletePaymentMethod, loading: apiDeleteLoadingPaymentMethod, error: apiDeleteErrorPaymentMethod } = useDeletePaymentMethod({ dataDeletePaymentMethod });

  /**
   * Se ejecuta cuando se cargan los métodos de pago y se setean en el estado filteredDataPaymentMethods.
   * Tiene la misma información que parsedDataPaymentMethod, pero es necesario para el filtrado.
   */
  useEffect(() => {
    setFilteredDataPaymentMethods(parsedDataPaymentMethod);
  }, [parsedDataPaymentMethod]);

  /**
   * Se ejecuta cuando se cambia el texto de búsqueda en el input del filtro.
   * Se filtra la información de parsedDataPaymentMethod y se setea en el estado filteredDataPaymentMethods.
   */
  const handleFilterChange = (searchText: string) => {
    if (searchText.trim() === "") {
      setFilteredDataPaymentMethods(parsedDataPaymentMethod);
      return;
    }

    const filtered = parsedDataPaymentMethod.filter(paymentMethod =>
      paymentMethod.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredDataPaymentMethods(filtered);
  };

  /**
   * Se ejecuta cuando se crea un método de pago exitosamente.
   * Se setea el estado successState a true y se muestra el mensaje de éxito.
   * Se cierra el modal de creación de método de pago y se recarga la página.
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
   * Se ejecuta cuando se envía el formulario de creación de método de pago.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo PaymentMethodRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de creación de método de pago.
   */
  const onSubmit: SubmitHandler<PaymentMethodRequest> = async (formData: PaymentMethodRequest) => {
    try {
      const response = await postPaymentMethod(formData);
      if (response) {
        handleSuccess("createPaymentMethodModal");
      }
    } catch (error) {
      console.log('Error al crear el método de pago', error);
    }
  };

  /**
   * Se ejecuta cuando se hace click en el botón de edición de un método de pago.
   * Se setea el estado dataEditPaymentMethod con los datos del método de pago.
   * Cuando se abre la modal de edición, se carga cada campo del formulario con los datos del método de pago.
   * @param row - Datos del método de pago.
   */
  const onEdit = (row: ParsedPaymentMethod) => {
    setDataEditPaymentMethod(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de edición de método de pago.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo PaymentMethodRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de edición de método de pago.
   */
  const onEditSubmit: SubmitHandler<PaymentMethodRequest> = async (formData: PaymentMethodRequest) => {
    try {
      setDataEditPaymentMethod(prev => prev ? {
        ...prev,
        name: formData.name,
      } : null);

      const response = await patchPaymentMethod(formData);

      if (response) {
        handleSuccess("editPaymentMethodModal");
      }
    } catch (error) {
      console.log('Error al actualizar el método de pago', error)
    }
  }

  /**
   * Se ejecuta cuando se hace click en el botón de eliminación de un método de pago.
   * Se setea el estado dataDeletePaymentMethod con los datos del método de pago.
   * @param row - Datos del método de pago.
   */
  const onDelete = async (row: ParsedPaymentMethod) => {
    setDataDeletePaymentMethod(row);
  }

  /**
   * Se ejecuta cuando se envía el formulario de eliminación de método de pago.
   * Se parsean los datos del formulario y se envían a la API.
   * Es de tipo PaymentMethodRequest porque es el tipo de datos que se envía a la API.
   * @param formData - Datos del formulario de eliminación de método de pago.
   */
  const onDeleteSubmit = async () => {
    try {
      const response = await deletePaymentMethod();
      console.log('response', response);
      if (response) {
        handleSuccess("deletePaymentMethodModal");
      }
    } catch (error) {
      console.log('Error al eliminar el método de pago', error);
    }
  }

  if (loading) return <Loading className="loading-container" />;

  return (
    <>
      <Subsection
        title="Métodos de pago"
        description="Gestiona los métodos de pago de la aplicación.">

        <Button
          label="Crear método de pago"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createPaymentMethodModal"
        />

        <Filter onFilterChange={handleFilterChange} />

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />
            if (error && !loading) return <div>{error.message}</div>;
            if (dataPaymentMethod.length === 0 && !loading) return <div className="no-results-message"><span>No hay datos.</span></div>;
            if (filteredDataPaymentMethods.length === 0 && !loading) return <div className="no-results-message"><span>No se encontraron coincidencias.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredDataPaymentMethods}
                classNameEspecificTable="table-payment-methods"
                dataBsToggle="modal"
                dataBsTargetEdit="#editPaymentMethodModal"
                dataBsTargetDelete="#deletePaymentMethodModal"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })()}
        </div>
      </Subsection>

      <ModalPost
        id="createPaymentMethodModal"
        title="Crear método de pago"
        formId="createPaymentMethodForm"
        loading={apiLoadingPostPaymentMethod}>

        <FormPaymentMethod
          idModal="createPaymentMethodModal"
          formId="createPaymentMethodForm"
          onSubmit={onSubmit}
          apiLoading={apiLoadingPostPaymentMethod}
          apiError={apiErrorPostPaymentMethod}
          mode="create"
          success={successState}
          successMessage="¡Método de pago creado exitosamente!"
        />

      </ModalPost>

      <ModalEdit
        id="editPaymentMethodModal"
        title="Editar método de pago"
        formId="editPaymentMethodForm"
        loading={apiLoadingPatchPaymentMethod}>

        <FormPaymentMethod
          idModal="editPaymentMethodModal"
          formId="editPaymentMethodForm"
          onSubmit={onEditSubmit}
          apiLoading={apiLoadingPatchPaymentMethod}
          apiError={apiErrorPatchPaymentMethod}
          mode="edit"
          success={successState}
          successMessage="¡Método de pago actualizado exitosamente!"
          initialValues={dataEditPaymentMethod ? {
            name: dataEditPaymentMethod.name,
          } : undefined}
        />

      </ModalEdit>

      <ModalDelete
        id="deletePaymentMethodModal"
        title="Eliminar método de pago"
        loading={apiDeleteLoadingPaymentMethod}
        onDelete={onDeleteSubmit}>

        <FormPaymentMethod
          idModal="deletePaymentMethodModal"
          formId="deletePaymentMethodForm"
          onSubmit={onDeleteSubmit}
          apiLoading={apiDeleteLoadingPaymentMethod}
          apiError={apiDeleteErrorPaymentMethod}
          mode="delete"
          success={successState}
          successMessage="¡Método de pago eliminado exitosamente!"
          initialValues={dataDeletePaymentMethod ? {
            name: dataDeletePaymentMethod.name,
          } : undefined}
        />

      </ModalDelete>
    </>
  )
}