export interface Project {
  id: string;
  name: string;
  description: string;
  users?: Array<{ id: string }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}
