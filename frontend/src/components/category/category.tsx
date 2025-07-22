import { Button } from "../button/button";
import { Loading } from "../loading/loading";
import { ModalPost } from "../modal/modalPost";
import { Section } from "../section/section";
import { Table, type Column } from "../table/table";
import "./category.css";
import type { Category } from "./models";
import { useCategory } from "./hooks";
import { parseCategoryData } from "./utils";
import { Form } from "../form/form";

const columns: Column<Category>[] = [
  { header: "ID", accessor: "category_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
]

export const Categories = () => {

  const { categories, loading, error } = useCategory();

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  const handleData: Category[] = parseCategoryData(categories);

  return (
    <>
      <Section title="Categorías" description="Gestiona la carga, modificación y eliminación de las categorías de los productos.">
        <Button label="Crear categoría" parentMethod={() => { }} dataBsToggle="modal" dataBsTarget="#createCategoryModal" />
        <div className="table-container">
          {categories.length > 0 ? (
            <Table columns={columns} data={handleData} />
          ) : (
            <Loading className="table-container-loading" />
          )}
        </div>
      </Section>
      <ModalPost id="createCategoryModal" title="Crear categoría">
        <Form />
      </ModalPost>
    </>
  );

}