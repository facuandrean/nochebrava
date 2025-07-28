import type { SubmitHandler } from "react-hook-form";
import { GenericForm } from "../../form/genericForm";
import type { CategoryRequest } from "../models";
import { InputForm } from "../../form/components/genericInput";

const defaultValues: CategoryRequest = {
  name: "",
  description: ""
}

interface FormCategoryProps {
  idModal: string;
  formId: string;
  onSubmit: SubmitHandler<CategoryRequest>;
  apiLoading: boolean;
  apiError: Error | null;
  mode: "create" | "edit" | "delete";
  initialValues?: CategoryRequest;
}

export const FormCategory = ({ idModal, formId, onSubmit, apiLoading, apiError, mode, initialValues }: FormCategoryProps) => {
  return (
    <GenericForm<CategoryRequest>
      idModal={idModal}
      formId={formId}
      defaultValues={initialValues || defaultValues}
      onSubmit={onSubmit}
      loading={apiLoading}
      error={apiError}
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer eliminar la categoría <strong>"{initialValues?.name}"</strong>?</p>
          </div>
        ) : (
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
                validate: (value: string | number | boolean | null) => {
                  const strValue = String(value || "");
                  if (!strValue || strValue.trim() === "") return true;
                  return strValue.trim().length >= 3 || "Debe tener al menos 3 caracteres si se proporciona.";
                }
              }}
            />
          </>
        )
      )}
    </GenericForm>
  );
}