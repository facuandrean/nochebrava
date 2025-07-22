import { Button } from "../button/button";
import { Form } from "../form/form";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import { useProduct } from "./hooks";
import type { ParsedProduct } from "./models";
import { parseProductData } from "./utils";
import "./product.css";

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
  const { products, loading, error } = useProduct();

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const handleData: ParsedProduct[] = parseProductData(products);

  return (
    <>
      <Section title="Productos" description="Gestiona la carga, modificación y eliminación de los productos que vendes.">
        <Button label="Crear producto" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createProductModal" />
        <div className="table-container">
          {products.length > 0 ? (
            <Table columns={columns} data={handleData} />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>
      <ModalPost id="createProductModal" title="Crear producto">
        <Form />
      </ModalPost>
    </>
  );
}