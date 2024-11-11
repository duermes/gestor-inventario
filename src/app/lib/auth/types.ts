export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  password: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
