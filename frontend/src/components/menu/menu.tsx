import { Link } from "react-router-dom";
import "./menu.css";

interface MenuProps {
  isMenuOpen: boolean;
}

export const Menu = ({ isMenuOpen }: MenuProps) => {

  return (
    <nav className={`menu ${isMenuOpen ? "is-open" : ""}`}>
      <ul>
        <li>
          <a href="/">Inicio</a>
        </li>
        <li>
          <Link to="/productos">Productos</Link>
        </li>
        <li>
          <Link to="/categorias">Categorías</Link>
        </li>
      </ul>
    </nav>
  );
}