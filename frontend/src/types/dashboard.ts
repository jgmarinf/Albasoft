export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}
