import { ButtonIcon } from "../button/buttonIcon";
import "./table.css";

// Interfaz base que garantiza que todos los tipos tengan un id
interface BaseEntity {
  id: string | number;
}

export interface Column<T extends BaseEntity> {
  header: string; // el nombre de la columna
  accessor: keyof T; // keyof T es un tipo que representa las claves del objeto T ("en esta columna, mostrá el valor de la propiedad X del objeto")
}

interface TableProps<T extends BaseEntity> {
  columns: Column<T>[]; // array de columnas que contiene objetos de tipo Column<T>
  data: T[]; // array de datos de cierto tipo T
  classNameEspecificTable?: string;
  dataBsToggle?: string;
  dataBsTargetEdit?: string;
  dataBsTargetDelete?: string;
}

export function Table<T extends BaseEntity>({ columns, data, classNameEspecificTable, dataBsToggle, dataBsTargetEdit, dataBsTargetDelete }: TableProps<T>) {
  return (
    <table className={`table table-striped-columns ${classNameEspecificTable}`}>
      <thead className="table-head table-dark">
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessor)}>{col.header}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={String(col.accessor)}>
                <div>
                  <span>
                    {String(col.accessor).includes("_id")
                      ? i + 1
                      : String(col.accessor).includes("description") && row[col.accessor] === null
                        ? <span className="text-muted">Sin descripción</span>
                        : String(row[col.accessor])
                    }
                  </span>
                </div>
              </td>
            ))}
            <td>
              <div className="table-body-actions">
                <ButtonIcon id={String(row.id)} icon="fa-pen-to-square" parentMethod={() => { console.log(row) }} dataBsToggle={dataBsToggle} dataBsTarget={dataBsTargetEdit} />
                <ButtonIcon id={String(row.id)} icon="fa-trash" parentMethod={() => { console.log(row) }} dataBsToggle={dataBsToggle} dataBsTarget={dataBsTargetDelete} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}