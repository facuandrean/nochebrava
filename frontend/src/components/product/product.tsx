import { useFetch } from "../../hooks";
import { handleDate } from "../../utils/date";
import { Button } from "../button/button";
import { Table, type Column } from "../table/table";
import "./product.css";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ParsedProduct {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: string;
  created_at: string;
  updated_at: string;
}

const API_URL = "http://localhost:3000/api/v1/products";

const parseProductData = (products: Product[]): ParsedProduct[] => {
  return products.map((product) => ({
    ...product,
    active: product.active ? "Si" : "No",
    created_at: handleDate(product.created_at),
    updated_at: handleDate(product.updated_at)
  }));
};

const columns: Column<ParsedProduct>[] = [
  { header: "ID", accessor: "product_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Precio", accessor: "price" },
  { header: "Stock", accessor: "stock" },
  { header: "Activo", accessor: "active" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
];

export const Products = () => {
  const { data, loading, error } = useFetch<{ status: string; message: string; data: Product[] }>(API_URL);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleData: ParsedProduct[] = parseProductData(data?.data ?? []);

  return (
    <div className="section">
      <h2 className="section-title">Productos</h2>
      <p className="section-description">Gestiona la carga, modificación y eliminación de los productos que vendes.</p>
      <Button label="Crear producto" parentMethod={() => { }} />

      <div className="table-container">
        <Table columns={columns} data={handleData} />
      </div>
    </div>
  );
}