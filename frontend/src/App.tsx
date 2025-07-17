import { useState } from 'react';
import './App.css'
import { Header, Menu } from './components';
// import { useFetch } from './hooks';

// interface Product {
//   product_id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   picture: string;
//   active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// interface Category {
//   category_id: string;
//   name: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
// }

// const urlProducts = "http://localhost:3000/api/v1/products";
// const urlCategories = "http://localhost:3000/api/v1/categories";

function App() {

  // const { data, loading, error } = useFetch<{ status: string; message: string; data: Product[] }>(urlProducts);
  // const { data, loading, error } = useFetch(urlCategories);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // if (!data) return <div>No data</div>;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Menu isMenuOpen={isMenuOpen} />
      {/* <div>
        {data.data.map((product) => (
          <div key={product.product_id}>
            <img src={product.picture} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><b>Precio:</b> ${product.price}</p>
            <p><b>Stock:</b> {product.stock}</p>
            <p><b>Activo:</b> {product.active ? "Sí" : "No"}</p>
          </div>
        ))}
      </div> */}
    </>
  );
}


export default App
