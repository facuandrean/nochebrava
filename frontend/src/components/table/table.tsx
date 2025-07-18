import { ButtonIcon } from "../button/buttonIcon";
import "./table.css";

export interface Column<T> {
  header: string; // el nombre de la columna
  accessor: keyof T; // keyof T es un tipo que representa las claves del objeto T ("en esta columna, mostrá el valor de la propiedad X del objeto")
}

interface TableProps<T> {
  columns: Column<T>[]; // array de columnas que contiene objetos de tipo Column<T>
  data: T[]; // array de datos de cierto tipo T
}

export function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <table className="table">
      <thead className="table-head">
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
                {String(col.accessor).includes("_id") ? i + 1 : String(row[col.accessor])}
              </td>
            ))}
            <td>
              <div className="table-body-actions">
                <ButtonIcon icon="fa-pen-to-square" />
                <ButtonIcon icon="fa-trash" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}