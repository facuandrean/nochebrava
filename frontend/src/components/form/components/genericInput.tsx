import { Controller, type Control, type FieldError, type FieldErrors, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import "../form.css";

interface InputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  label: string;
  type?: string;
  error?: FieldError;
  rules?: Omit<RegisterOptions<T, Path<T>>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">;
}

export const InputForm = <T extends FieldValues>({ name, control, label, type, error, errors, rules }: InputProps<T>) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          if (type === "textarea")
            return (
              <textarea
                id={name}
                {...field}
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={field.value ? String(field.value) : ""}
              />
            );

          if (type === "checkbox")
            return (
              <input
                id={name}
                type="checkbox"
                {...field}
                className={`form-check-input ${error ? "is-invalid" : ""}`}
                checked={!!field.value}
              />
            );

          if (type === "number")
            return (
              <input
                id={name}
                type="number"
                {...field}
                value={field.value === undefined || field.value === null ? "" : String(field.value)}
                className={`form-control ${error ? "is-invalid" : ""}`}
              />
            );

          return (
            <input
              id={name}
              type={type || "text"}
              {...field}
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={field.value ? String(field.value) : ""}
            />
          );
        }}
      />
      {errors[name] && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>
          {errors[name]?.message?.toString()}
        </span>
      )}
    </div>
  );
};
