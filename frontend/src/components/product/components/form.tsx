import type { SubmitHandler } from "react-hook-form";
import { InputForm } from "../../form/components/genericInput";
import { GenericForm } from "../../form/genericForm";
import type { ProductRequest } from "../models/product.model";

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
}

export const FormProduct = ({ idModal, formId, onSubmit, apiLoading, apiError }: FormProductProps) => {
  return (
    <GenericForm<ProductRequest>
      idModal={idModal}
      formId={formId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      loading={apiLoading}
      error={apiError}
    >
      {({ control, errors }) => (
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
              validate: (value: string | number | boolean | null) => {
                const strValue = String(value || "");
                if (!strValue || strValue.trim() === "") return true;
                return strValue.trim().length >= 10 || "Debe tener al menos 10 caracteres si se proporciona.";
              }
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
                value: 1,
                message: "El precio debe ser mayor a 0."
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
      )}
    </GenericForm>
  )
}