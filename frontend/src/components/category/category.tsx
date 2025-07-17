import { useFetch } from "../../hooks";

interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const Categories = () => {

  const { data, loading, error } = useFetch<{ status: string; message: string; data: Category[] }>("http://localhost:3000/api/v1/categories");

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="section">
      <h2 className="section-title">Categorías</h2>
      <ul>
        {data?.data.map((category) => (
          <li key={category.category_id}>
            <b>{category.name}</b> - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );

}