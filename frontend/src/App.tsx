import './App.css'
import { Button } from './components';
import { useFetch } from './hooks';

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

// interface Category {
//   category_id: string;
//   name: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
// }

const urlProducts = "http://localhost:3000/api/v1/products";
// const urlCategories = "http://localhost:3000/api/v1/categories";

function App() {

  const { data, loading, error } = useFetch<{ status: string; message: string; data: Product[] }>(urlProducts);
  // const { data, loading, error } = useFetch(urlCategories);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <>
      <div>
        <Button label="Cargar productos" parentMethod={() => { }} />
        <Button label="Cargar categorías" parentMethod={() => { }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {data.data.map((product) => (
          <div
            key={product.product_id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "250px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={product.picture}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }}
            />
            <h2 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>{product.name}</h2>
            <p>{product.description}</p>
            <p><b>Precio:</b> ${product.price}</p>
            <p><b>Stock:</b> {product.stock}</p>
            <p><b>Activo:</b> {product.active ? "Sí" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}


export default App
