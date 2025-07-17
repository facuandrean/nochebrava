import { Button } from "../button/button";
import "./header.css";

export const Header = () => {

  const handleRegisterSale = () => {
    console.log("Registrar venta");
  }

  return (
    <header className="header">
      <div>
        <span>Noche Brava</span>
      </div>
      <div>
        <Button label="Registrar venta" parentMethod={handleRegisterSale} />
      </div>
    </header>
  );
}