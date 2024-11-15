export interface User {
  id?: string;
  email: string;
  name: string;
  lastName: string;
  password?: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
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

export interface RegisterInput {
  email: string;
  name: string;
  lastName: string;
  password: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  singUp: (
    email: string,
    name: string,
    lastname: string,
    password: string,
    role: string
  ) => Promise<{ data: any; status: number } | undefined>;
  loading: boolean;
}
