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
  claveSecreta: z
    .string()
    .min(8, "La clave secreta debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});

// Esquema para creación de usuarios
export const createUserSchema = z.object({
  name: z.string().min(3, "Nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

// Esquema para creación de proyectos
export const createProjectSchema = z.object({
  name: z.string().min(3, "Nombre del proyecto es requerido"),
  description: z
    .string()
    .min(10, "Descripción debe tener al menos 10 caracteres"),
  usersIds: z.array(z.string()).optional(),
});

// Esquema para edición de proyectos
export const editProjectSchema = z
  .object({
    name: z.string().min(3, "Nombre requerido (mín. 3 caracteres)").optional(),
    description: z
      .string()
      .min(10, "Descripción requerida (mín. 10 caracteres)")
      .optional(),
    usersIds: z.array(z.string()).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Debes modificar al menos un campo",
  });

// Esquema para edición de usuarios
export const editUserSchema = z
  .object({
    name: z.string().min(3, "Nombre requerido (mín. 3 caracteres)").optional(),
    email: z.string().email("Email inválido").optional(),
    password: z
      .union([z.string().min(8, "Mínimo 8 caracteres"), z.literal("")])
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== ""),
    {
      message: "Debes modificar al menos un campo",
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type RegisterAdminFormData = z.infer<typeof registerAdminSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
export type EditProjectFormData = z.infer<typeof editProjectSchema>;
