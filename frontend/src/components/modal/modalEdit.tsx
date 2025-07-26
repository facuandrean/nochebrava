import "./modal.css";

interface ModalEditProps {
  id: string;
  title: string;
  children: React.ReactNode;
  formId: string; // ID del formulario al que se conectarán los botones
  loading?: boolean; // Para deshabilitar botones mientras se envía
}

export const ModalEdit = ({ id, title, children, formId, loading = false }: ModalEditProps) => {
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
              <button className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-success" data-bs-target="#confirmEditModal" data-bs-toggle="modal">Guardar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="confirmEditModal" aria-hidden="true" aria-labelledby="confirmEditModalLabel" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="confirmEditModalLabel">Confirmar cambios</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de querer guardar los cambios?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" disabled={loading}>
                Cancelar
              </button>
              <button type="submit" form={formId} className="btn btn-success" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}