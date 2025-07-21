import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { InputForm } from "./components/input";
import { type FormPostProduct, schemaFormPostProduct } from "./models/form.model";
import { useApi } from "../../hooks/useApi";
import type { ProductRequest } from "../product/product";
import { Loading } from "../loading/loading";

export const Form = () => {

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormPostProduct>({
    resolver: zodResolver(schemaFormPostProduct),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      active: true
    }
  });

  useEffect(() => {
    const modal = document.getElementById('createProductModal');
    if (modal) {
      const handleHidden = () => {
        reset();
      };

      modal.addEventListener('hidden.bs.modal', handleHidden);

      return () => {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      };
    }
  }, [reset]);

  const url = "http://localhost:3000/api/v1/products";

  const { loading, error, trigger } = useApi<ProductRequest>({
    url,
    method: "POST"
  });

  const onSubmit: SubmitHandler<FormPostProduct> = async (formData) => {
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    await trigger(productData as ProductRequest);

    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <Loading />;
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <InputForm name="name" control={control} label="Nombre" type="text" error={errors.name} />
      <InputForm name="description" control={control} label="Descripción" type="textarea" error={errors.description} />
      <InputForm name="price" control={control} label="Precio" type="number" error={errors.price} />
      <InputForm name="stock" control={control} label="Stock" type="number" error={errors.stock} />
      <InputForm name="active" control={control} label="Activo" type="checkbox" error={errors.active} />
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" className="btn btn-success">Guardar</button>
      </div>
    </form>
  );
}