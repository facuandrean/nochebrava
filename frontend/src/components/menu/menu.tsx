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
          <a href="/"><img src="/public/assets/icons/home.svg"></img>Inicio</a>
        </li>
        <li>
          <Link to="/productos"><img src="/public/assets/icons/two-wine-bottles.svg"></img>Productos</Link>
        </li>
        <li>
          <Link to="/categorias"><img src="/public/assets/icons/category-alt.svg"></img>Categorías</Link>
        </li>
        <li>
          <Link to="/paquetes"><img src="/public/assets/icons/two-rum-bottles-in-a-box.svg"></img>Paquetes</Link>
        </li>
        <li>
          <Link to="/ventas"><img src="/public/assets/icons/money-receive.svg"></img>Ventas</Link>
        </li>
        <li>
          <Link to="/gastos"><img src="/public/assets/icons/money-send.svg"></img>Gastos</Link>
        </li>
        <li>
          <Link to="/extras"><img src="/public/assets/icons/add-square.svg"></img>Extras</Link>
        </li>
      </ul>
    </nav>
  );
}