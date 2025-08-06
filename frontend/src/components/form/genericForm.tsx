import { useEffect, useState } from "react";
import { useForm, type Control, type DefaultValues, type FieldErrors, type FieldValues, type SubmitHandler } from "react-hook-form"
import { Loading } from "../loading/loading";

interface GenericFormProps<T extends FieldValues> {
  idModal: string;
  formId: string;
  defaultValues: T;
  onSubmit: SubmitHandler<T>;
  loading?: boolean;
  error?: Error | null;
  success?: boolean;
  successMessage?: string;
  children: (methods: {
    control: Control<T>;
    errors: FieldErrors<T>;
  }) => React.ReactNode;
  mode?: "create" | "edit" | "delete";
}

export const GenericForm = <T extends FieldValues>({
  idModal,
  formId,
  defaultValues,
  onSubmit,
  loading = false,
  error = null,
  success = false,
  successMessage = "",
  children }: GenericFormProps<T>) => {

  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<T>({
    mode: "onSubmit",
    defaultValues: defaultValues as DefaultValues<T>
  });

  // Actualizar valores del formulario cuando cambien los defaultValues. Sin esto, los inputs aparecen vacíos y si modifico individualmente los generics inputs mandandoles los defaultvalues, por más que aparezca los datos del registro, lo toma como vacío.
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Se resetea el formulario cuando se cierra el modal.
  useEffect(() => {
    const modal = document.getElementById(idModal);
    if (modal) {
      const handleHidden = () => {
        reset();
        setErrorMessage(false);
        setShowSuccess(false);
      };

      modal.addEventListener('hidden.bs.modal', handleHidden);

      return () => {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      };
    }
  }, [reset, idModal]);

  // Manejar la visibilidad del error
  useEffect(() => {
    if (error) {
      setErrorMessage(true);
      const timer = setTimeout(() => setErrorMessage(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setErrorMessage(false);
    }
  }, [error]);

  // Manejar la visibilidad del éxito
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
    }
  }, [success]);

  return (
    <>
      <form id={formId} className="form" onSubmit={handleSubmit(onSubmit)}>
        {children({ control, errors })}
      </form>

      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Loading className="loading-container-form" />
        </div>
      )}

      {showSuccess && (
        <div className="mt-3 p-2 text-center message-success" style={{ backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && error && (
        <div className="mt-3 p-2 text-center message-error" style={{ backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {error.message}
        </div>
      )}
    </>
  )
}