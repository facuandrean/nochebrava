import "./button.css";

interface Props {
  label: string;
  parentMethod: () => void;
  dataBsToggle?: string;
  dataBsTarget?: string;
}

export const Button = ({ label, parentMethod, dataBsToggle, dataBsTarget }: Props) => {
  return (
    <button className="button" onClick={parentMethod} data-bs-toggle={dataBsToggle} data-bs-target={dataBsTarget}>
      {label}
    </button>
  )
}