import type { ReactNode } from "react";
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
  onParsingData: (row: T, accessor: string) => ReactNode; // función callback para manejar la edición
  onEdit?: (row: T) => void; // función callback para manejar la edición
  onDelete?: (row: T) => void; // función callback para manejar la eliminación
}

export function Table<T extends BaseEntity>({
  columns,
  data,
  classNameEspecificTable,
  dataBsToggle,
  dataBsTargetEdit,
  dataBsTargetDelete,
  onParsingData,
  onEdit,
  onDelete
}: TableProps<T>) {

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
                {String(col.accessor).includes("_id") ? <div>{i + 1}</div> : onParsingData(row, String(col.accessor))}
                {/* {String(col.accessor).includes("_id")
                      ? i + 1
                      : String(col.accessor).includes("description") && row[col.accessor] === null || row[col.accessor] === ""
                        ? <span className="text-muted">Sin descripción</span>
                        : Array.isArray(row[col.accessor] && String(col.accessor).includes("categories"))
                          ? (row[col.accessor] as Array<Record<string, unknown>>).map((item, index) => (
                            // Esta porción de código era para mostrar los items de un pack
                            // <div key={index} className="mb-1">
                            //   {String(item.quantity) + " " + String(item.product_name)}
                            // </div>
                            <div key={index} className="mb-1">
                              <span> {item.name} </span>
                            </div>
                          ))
                          : String(row[col.accessor])
                    } */}
              </td>
            ))}
            <td>
              <div className="table-body-actions">
                <ButtonIcon
                  id={String(row.id)}
                  icon="fa-pen-to-square"
                  parentMethod={() => {
                    onEdit?.(row);
                  }}
                  dataBsToggle={dataBsToggle}
                  dataBsTarget={dataBsTargetEdit}
                />
                <ButtonIcon
                  id={String(row.id)}
                  icon="fa-trash"
                  parentMethod={() => {
                    onDelete?.(row);
                  }}
                  dataBsToggle={dataBsToggle}
                  dataBsTarget={dataBsTargetDelete}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}