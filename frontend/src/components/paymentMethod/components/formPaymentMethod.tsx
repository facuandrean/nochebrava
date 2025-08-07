import type { SubmitHandler } from "react-hook-form";
import type { PaymentMethodRequest } from "../models";
import { GenericForm } from "../../form";
import { InputForm } from "../../form/components";

const defaultValues: PaymentMethodRequest = {
  name: "",
};

interface FormPaymentMethodProps {
  idModal: string;
  formId: string;
  onSubmit: SubmitHandler<PaymentMethodRequest>;
  apiLoading: boolean;
  apiError: Error | null;
  mode: "create" | "edit" | "delete";
  initialValues?: PaymentMethodRequest;
  success?: boolean;
  successMessage?: string;
}

export const FormPaymentMethod = ({
  idModal,
  formId,
  onSubmit,
  apiLoading,
  apiError,
  mode,
  initialValues,
  success,
  successMessage
}: FormPaymentMethodProps) => {
  return (
    <GenericForm<PaymentMethodRequest>
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
            <p>¿Estás seguro de querer eliminar el método de pago <strong>"{initialValues?.name}"</strong>?</p>
          </div>
        ) : (
          <InputForm
            name="name"
            label="Nombre del método de pago"
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