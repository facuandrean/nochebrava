import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Categories, Header, Menu, Products } from './components';
import { useState } from 'react';


function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Router>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Menu isMenuOpen={isMenuOpen} />
        <Routes>
          <Route path="/productos" element={<Products />} />
          <Route path="/categorias" element={<Categories />} />
        </Routes>
      </Router>
    </>
  );
}


export default App
