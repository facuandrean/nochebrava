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
        <li>
          <Link to="/paquetes">Paquetes</Link>
        </li>
        <li>
          <Link to="/ventas">Ventas</Link>
        </li>
        <li>
          <Link to="/gastos">Gastos</Link>
        </li>
        <li>
          <Link to="/extras">Extras</Link>
        </li>
      </ul>
    </nav>
  );
}