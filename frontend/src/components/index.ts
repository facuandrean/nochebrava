// La idea es que este archivo sea el que exporte todos los componentes que se van a usar en la aplicación, para simplificar el import de los mismos
// Voy a tener tantos export * como componentes tenga el proyecto
export * from "./button/button.tsx";
export * from "./header/header.tsx";
export * from "./menu/menu.tsx";

// para importar un componente en particular, se puede hacer de la siguiente manera:
// import { Button, Button2 } from "./components"; y asi sucesivamente dependiendo de los export y componentes que tenga el proyecto.