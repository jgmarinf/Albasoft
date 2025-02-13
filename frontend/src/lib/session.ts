export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "admin" | "user";
}

// Implementación temporal - reemplazar con tu lógica de autenticación real
export function getCurrentUser(): Promise<User | null> {
  return Promise.resolve({
    id: "1",
    name: "Usuario Demo",
    email: "demo@ejemplo.com",
    role: "admin",
  });
}
