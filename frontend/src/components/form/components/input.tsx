import { Controller, type Control, type FieldError } from "react-hook-form";
import { type FormPostProduct } from "../models/form.model";
import "../form.css";

interface InputProps {
  name: keyof FormPostProduct;
  control: Control<FormPostProduct>;
  label: string;
  type?: string;
  error?: FieldError;
}

export const InputForm = ({ name, control, label, type, error }: InputProps) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (type === "textarea")
            return <textarea id={name} {...field} className={`form-control ${error ? "is-invalid" : ""}`} value={field.value ? String(field.value) : ""} />

          if (type === "checkbox")
            return <input id={name} type="checkbox" {...field} className={`form-check-input ${error ? "is-invalid" : ""}`} value={field.value ? "true" : "false"} />

          if (type === "number")
            return <input id={name} type="number" {...field} value={field.value === undefined || field.value === null ? "" : String(field.value)} className={`form-control ${error ? "is-invalid" : ""}`} />

          return <input id={name} type={type} {...field} className={`form-control ${error ? "is-invalid" : ""}`} value={field.value ? String(field.value) : ""} />
        }}
      />
      {error && <span className="error">{error.message}</span>}
    </div>
  )
}