"use client";

import {
  loginSchema,
  registerAdminSchema,
  registerUserSchema,
  type LoginFormData,
  type RegisterAdminFormData,
  type RegisterUserFormData,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type AuthFormProps = {
  type: "login" | "register";
  role?: "user" | "admin";
};

export default function AuthForm({ type, role = "user" }: AuthFormProps) {
  const router = useRouter();

  // Seleccionar el esquema adecuado
  const schema =
    type === "login"
      ? loginSchema
      : role === "admin"
      ? registerAdminSchema
      : registerUserSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterUserFormData | RegisterAdminFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log("Datos válidos:", data);
    if (type === "login") {
      const responseNextAuth = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (responseNextAuth?.error) {
        console.log(responseNextAuth.error);

        return;
      }
      console.log(responseNextAuth);
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      {type === "register" && (
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => router.push("/auth/register/user")}
            className={`px-4 py-2 rounded-md ${
              role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Usuario
          </button>
          <button
            onClick={() => router.push("/auth/register/admin")}
            className={`px-4 py-2 rounded-md ${
              role === "admin"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Administrador
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === "register" && (
          <div>
            <label className="block text-gray-700 mb-2">Nombre completo</label>
            <input
              {...register("fullName")}
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                errors.fullName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">Correo electrónico</label>
          <input
            {...register("email")}
            type="email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              errors.email
                ? "border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {type === "register" && role === "user" && (
          <div>
            <label className="block text-gray-700 mb-2">
              Correo del administrador
            </label>
            <input
              {...register("adminEmail")}
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                errors.adminEmail
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.adminEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.adminEmail.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            {...register("password")}
            type="password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              errors.password
                ? "border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {type === "register" && role === "admin" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="claveSecreta" className="block text-gray-700">
              Clave Secreta
            </label>
            <input
              id="claveSecreta"
              {...register("claveSecreta")}
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                errors.claveSecreta
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.claveSecreta && (
              <p className="text-red-500 text-sm mt-1">
                {errors.claveSecreta.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {type === "login" ? "Ingresar" : "Completar registro"}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        {type === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth/register/user"
              className="text-blue-500 hover:underline"
            >
              Regístrate aquí
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Inicia sesión aquí
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
