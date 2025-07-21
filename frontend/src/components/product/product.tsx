import { useFetch } from "../../hooks";
import { handleDate } from "../../utils/date";
import { Button } from "../button/button";
import { Form } from "../form/form";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import "./product.css";

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParsedProduct {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
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

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <Loading />;

  const handleData: ParsedProduct[] = parseProductData(data?.data ?? []);

  return (
    <>
      <Section title="Productos" description="Gestiona la carga, modificación y eliminación de los productos que vendes.">
        <Button label="Crear producto" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createProductModal" />
        <div className="table-container">
          <Table columns={columns} data={handleData} />
        </div>
      </Section>
      <ModalPost id="createProductModal" title="Crear producto">
        <Form />
      </ModalPost>
    </>
  );
}