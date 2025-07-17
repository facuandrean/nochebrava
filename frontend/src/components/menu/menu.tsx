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
          <a href="/productos">Productos</a>
        </li>
        <li>
          <a href="/gastos">Gastos</a>
        </li>
        <li>
          <a href="/ventas">Ventas</a>
        </li>
      </ul>
    </nav>
  );
}