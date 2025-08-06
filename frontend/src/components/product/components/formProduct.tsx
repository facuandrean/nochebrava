import type { SubmitHandler } from "react-hook-form";
import type { ProductRequest } from "../models/product.model";
import { validateDescription } from "../../../utils";
import { GenericForm } from "../../form";
import { InputForm } from "../../form/components";

const defaultValues: ProductRequest = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  active: true
};

interface FormProductProps {
  idModal: string;
  formId: string;
  onSubmit: SubmitHandler<ProductRequest>;
  apiLoading: boolean;
  apiError: Error | null;
  mode: "create" | "edit" | "delete";
  initialValues?: ProductRequest;
  success?: boolean;
  successMessage?: string;
}

export const FormProduct = ({
  idModal,
  formId,
  onSubmit,
  apiLoading,
  apiError,
  mode,
  initialValues,
  success,
  successMessage
}: FormProductProps) => {
  return (
    <GenericForm<ProductRequest>
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
            <p>¿Estás seguro de querer eliminar el producto <strong>"{initialValues?.name}"</strong>?</p>
          </div>
        ) : (
          <>
            <InputForm
              name="name"
              label="Nombre del producto"
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
              name="stock"
              label="Stock"
              control={control}
              errors={errors}
              type="number"
              rules={{
                required: "El stock es obligatorio",
                min: {
                  value: 0,
                  message: "El stock debe ser mayor o igual a 0."
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
          </>
        )
      )}
    </GenericForm>
  )
}