import "./modal.css";

interface ModalEditProps {
  // Estas propiedades son para el modal.
  id: string;
  title: string;
  formId: string; // ID del formulario al que se conectarán los botones
  loading: boolean;
  children: React.ReactNode;

  // Estas propiedades son para wizards.
  step?: number;
  onCancel?: () => void;
  onFinish?: () => void;
}

export const ModalEdit = ({ id, title, formId, loading = false, children, step, onCancel, onFinish }: ModalEditProps) => {
  return (
    <>
      <div className="modal fade" id={id} aria-hidden="true" aria-labelledby={`${id}Label`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${id}Label`}>{title}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" disabled={loading} onClick={onCancel}>
                Cancelar
              </button>
              <button
                type="submit"
                form={formId}
                className="btn btn-success"
                disabled={loading}
                onClick={() => {
                  if (step === 2) {
                    onFinish?.();
                  }
                }}
              >
                {loading ? "Guardando..." : (step === 1 ? "Avanzar" : "Guardar")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}