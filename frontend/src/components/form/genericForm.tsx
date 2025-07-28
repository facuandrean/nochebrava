import { useEffect, useRef, useState } from "react";
import { useForm, type Control, type DefaultValues, type FieldErrors, type FieldValues, type SubmitHandler } from "react-hook-form"
import { Loading } from "../loading/loading";

interface GenericFormProps<T extends FieldValues> {
  idModal: string;
  formId: string; // Nuevo prop para el ID del formulario
  defaultValues: T;
  onSubmit: SubmitHandler<T>;
  loading?: boolean;
  error?: Error | null;
  children: (methods: {
    control: Control<T>;
    errors: FieldErrors<T>;
  }) => React.ReactNode;
}

export const GenericForm = <T extends FieldValues>({ idModal, formId, defaultValues, onSubmit, loading = false, error = null, children }: GenericFormProps<T>) => {

  // Para evitar que se resetee el formulario cuando se abre el modal
  const previousDefaultValues = useRef<T | null>(null);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<T>({
    mode: "onSubmit",
    defaultValues: defaultValues as DefaultValues<T>
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previousLoading, setPreviousLoading] = useState(false);


  useEffect(() => {
    if (previousLoading && !loading && !error) {
      setSubmitSuccess(true);

      setTimeout(() => {
        const modal = document.getElementById(idModal);
        if (modal) {
          const bootstrapModal = (window as typeof window & { bootstrap?: { Modal?: { getInstance: (element: Element) => { hide: () => void } | null } } }).bootstrap?.Modal?.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
          window.location.reload();
        }
      }, 2000);
    }
    setPreviousLoading(loading);
  }, [loading, error, idModal, previousLoading]);

  useEffect(() => {
    const modal = document.getElementById(idModal);
    if (modal) {
      const handleHidden = () => {
        reset();
        setSubmitSuccess(false);
      };

      modal.addEventListener('hidden.bs.modal', handleHidden);

      return () => {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      };
    }
  }, [reset, idModal]);

  useEffect(() => {
    // Solo resetear si los defaultValues realmente cambiaron
    if (defaultValues && JSON.stringify(defaultValues) !== JSON.stringify(previousDefaultValues.current)) {
      reset(defaultValues);
      previousDefaultValues.current = defaultValues;
    }
  }, [defaultValues, reset]);

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

      {submitSuccess && !loading && !error && (
        <div className="mt-3 p-2 text-center" style={{ backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          ¡Registro creado exitosamente!
        </div>
      )}

      {error && !loading && (
        <div className="mt-3 p-2 text-center" style={{ backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {error.message}
        </div>
      )}
    </>
  )
}