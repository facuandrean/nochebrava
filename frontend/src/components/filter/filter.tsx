import { useState, type ChangeEvent } from "react";
import "./filter.css";

interface FilterProps {
  onFilterChange: (searchText: string) => void;
}

export const Filter = ({ onFilterChange }: FilterProps) => {

  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchText(newValue);
    onFilterChange(newValue);
  }

  return (
    <div className="filter-container">
      <span>Filtrar por nombre</span>
      <input value={searchText} onChange={handleInputChange} placeholder="Buscar..." />
    </div>
  )
}