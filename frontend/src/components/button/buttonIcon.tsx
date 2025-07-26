interface Props {
  id: string;
  icon: string;
  parentMethod: () => void;
  dataBsToggle?: string;
  dataBsTarget?: string;
}

export const ButtonIcon = ({ id, icon, parentMethod, dataBsToggle, dataBsTarget }: Props) => {
  return (
    <button className="button-icon" onClick={parentMethod} id={id} data-bs-toggle={dataBsToggle} data-bs-target={dataBsTarget}>
      <i className={`fa-solid ${icon}`}></i>
    </button>
  );
}