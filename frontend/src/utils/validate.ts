export const validateDescription = (value: string | number | boolean | null, minLength: number = 10) => {
  const strValue = String(value || "");
  if (!strValue || strValue.trim() === "") return true;
  return strValue.trim().length >= minLength || `Debe tener al menos ${minLength} caracteres si se proporciona.`;
}