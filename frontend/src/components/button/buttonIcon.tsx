interface Props {
  icon: string;
}

export const ButtonIcon = ({ icon }: Props) => {
  return (
    <button className="button-icon">
      <i className={`fa-solid ${icon}`}></i>
    </button>
  );
}