import "./loading.css";

interface LoadingProps {
  className: string;
}

export const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={`${className}`}>
      <img src="/assets/tube-spinner.svg" alt="Cargando datos..." />
    </div>
  )
}