import "./modal.css";

interface ModalDeleteProps {
  id: string;
  title: string;
  children: React.ReactNode;
  loading?: boolean; // Para deshabilitar botones mientras se envía
  onDelete: () => void; // Función que se ejecuta al confirmar eliminación
}

export const ModalDelete = ({ id, title, children, loading = false, onDelete }: ModalDeleteProps) => {
  return (
    <>
      <div className="modal fade" id={id} aria-hidden="true" aria-labelledby={`${id}Label`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={loading}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={loading}
                onClick={() => {
                  onDelete();
                }}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};