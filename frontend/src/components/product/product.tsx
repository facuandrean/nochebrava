import { useFetch } from "../../hooks";
import "./product.css";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  picture: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const Products = () => {

  const { data, loading, error } = useFetch<{ status: string; message: string; data: Product[] }>("http://localhost:3000/api/v1/products");

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="section">
      <h2 className="section-title">Productos</h2>
      <ul>
        {data?.data.map((product) => (
          <li key={product.product_id}>
            <b>{product.name}</b> - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );

}