import { useFetch } from "../../hooks";
import { handleDate } from "../../utils/date";
import { Button } from "../button/button";
import { Table, type Column } from "../table/table";
import "./category.css";

interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const API_URL = "http://localhost:3000/api/v1/categories";

const parseCategoryData = (categories: Category[]): Category[] => {
  return categories.map((category) => ({
    ...category,
    created_at: handleDate(category.created_at),
    updated_at: handleDate(category.updated_at)
  }));
}

const columns: Column<Category>[] = [
  { header: "ID", accessor: "category_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
]

export const Categories = () => {

  const { data, loading, error } = useFetch<{ status: string; message: string; data: Category[] }>(API_URL);

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleData: Category[] = parseCategoryData(data?.data ?? []);

  return (
    <div className="section">
      <h2 className="section-title">Categorías</h2>
      <p className="section-description">Gestiona la carga, modificación y eliminación de las categorías de los productos.</p>
      <Button label="Crear categoría" parentMethod={() => { }} />
      <div className="table-container">
        <Table columns={columns} data={handleData} />
      </div>
    </div>
  );

}