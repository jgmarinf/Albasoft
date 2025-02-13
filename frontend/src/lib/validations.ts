import { z } from "zod";

// Esquema base común a todos los formularios
const baseAuthSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Esquema para Login
export const loginSchema = baseAuthSchema;

// Esquema para Registro de Usuario
export const registerUserSchema = baseAuthSchema.extend({
  fullName: z
    .string()
    .min(3, "Nombre completo debe tener al menos 3 caracteres"),
  adminEmail: z.string().email("Correo del administrador inválido"),
});

// Esquema para Registro de Administrador
export const registerAdminSchema = baseAuthSchema.extend({
  fullName: z
    .string()
    .min(3, "Nombre completo debe tener al menos 3 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type RegisterAdminFormData = z.infer<typeof registerAdminSchema>;
