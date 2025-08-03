import type { SubmitHandler } from "react-hook-form";
import { InputForm } from "../../form/components/genericInput";
import { GenericForm } from "../../form/genericForm";
import type { PackRequest } from "../models";
import { validateDescription } from "../../../utils";

const defaultValues: PackRequest = {
  name: "",
  description: "",
  price: 0,
  active: true
};

interface StepPackInfoProps {
  idModal: string;
  formId: string;
  onNextStep: SubmitHandler<PackRequest>;
  apiLoading: boolean;
  apiError: Error | null;
  mode: "create" | "edit" | "delete";
  initialValues?: PackRequest;
}

export const StepPackForm = ({ idModal, formId, onNextStep, apiLoading, apiError, mode, initialValues }: StepPackInfoProps) => {
  return (
    <GenericForm<PackRequest>
      idModal={idModal}
      formId={formId}
      defaultValues={initialValues || defaultValues}
      onSubmit={onNextStep}
      loading={apiLoading}
      error={apiError}
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer eliminar el pack <strong>"{initialValues?.name}"</strong>?</p>
          </div>
        ) : (
          <>
            <InputForm
              name="name"
              label="Nombre del pack"
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
                validate: (value: string | number | boolean | null) => validateDescription(value, 10)
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
                  value: 0,
                  message: "El precio debe ser mayor o igual a 0."
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
            <span className="note text-muted">* Podes dejar el <strong>precio</strong> en 0 momentáneamente, y luego de agregar los productos y ver un precio estimativo, podes volver para ponerle un precio real.</span>
          </>
        )
      )}
    </GenericForm>
  );
}