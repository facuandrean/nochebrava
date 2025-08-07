import type { SubmitHandler } from "react-hook-form";
import type { ItemTypeRequest } from "../models";
import { GenericForm } from "../../form";
import { InputForm } from "../../form/components";

const defaultValues: ItemTypeRequest = {
  name: "",
};

interface FormItemTypeProps {
  idModal: string;
  formId: string;
  onSubmit: SubmitHandler<ItemTypeRequest>;
  apiLoading: boolean;
  apiError: Error | null;
  mode: "create" | "edit" | "delete";
  initialValues?: ItemTypeRequest;
  success?: boolean;
  successMessage?: string;
}

export const FormItemType = ({
  idModal,
  formId,
  onSubmit,
  apiLoading,
  apiError,
  mode,
  initialValues,
  success,
  successMessage
}: FormItemTypeProps) => {
  return (
    <GenericForm<ItemTypeRequest>
      idModal={idModal}
      formId={formId}
      defaultValues={initialValues || defaultValues}
      onSubmit={onSubmit}
      loading={apiLoading}
      error={apiError}
      success={success}
      successMessage={successMessage}
      mode={mode}
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer eliminar el tipo de item <strong>"{initialValues?.name}"</strong>?</p>
          </div>
        ) : (
          <InputForm
            name="name"
            label="Nombre del tipo de item"
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
        )
      )}
    </GenericForm>
  )
}