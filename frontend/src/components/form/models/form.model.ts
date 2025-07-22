import { z } from "zod";

export const schemaFormPostProduct = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres." }).optional(),
  price: z.string().min(1, { message: "El precio es requerido." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "El precio debe ser mayor a 0." }),
  stock: z.string().min(1, { message: "El stock es requerido." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "El stock debe ser mayor a 0." }),
  active: z.boolean()
});

export type FormPostProduct = z.infer<typeof schemaFormPostProduct>;

export const schemaFormUpdateProduct = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }).optional(),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres." }).optional(),
  price: z.string().min(1, { message: "El precio es requerido." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "El precio debe ser mayor a 0." }).optional(),
  stock: z.string().min(1, { message: "El stock es requerido." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "El stock debe ser mayor a 0." }).optional(),
  active: z.boolean().optional()
});

export type FormUpdateProduct = z.infer<typeof schemaFormUpdateProduct>;