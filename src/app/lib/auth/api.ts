import { LoginCredentials } from "./types";

export const loginUser = async (credentials: LoginCredentials) => {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
};
