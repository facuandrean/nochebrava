import { useState } from "react";
import { Button } from "../button/button";
import "./header.css";

export const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleRegisterSale = () => {
    console.log("Registrar venta");
  }

  return (
    <header className="header">
      <div>
        <span className="header-logo">Noche Brava</span>
      </div>
      <div className="header-registerSale">
        <Button label="Registrar venta" parentMethod={handleRegisterSale} />
      </div>
      <div className="header-menu">
        <button className={`hamburger hamburger--elastic ${isMenuOpen ? "is-active" : ""}`} type="button" onClick={handleMenuOpen}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </header>
  );
}