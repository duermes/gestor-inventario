"use client";
import React, { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType } from "../lib/auth/types";

const AuthContext = createContext<AuthContextType>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setLoading(false);
        return data.error;
      }

      if (res.status == 200) {
        const { user } = data;
        setUser(user);
        setLoading(false);
        router.push("/dashboard");
      }
    } catch (error) {
      return error;
    }
  };

  const logout = async () => {
    // await fetch(`api/auth/logout`, {
    //   method: "POST",
    //   credentials: "include",
    // }).then(async (res) => {
    //   if (res.status == 200) {
    //     router.push("/");
    //     setUser(null);
    //     setLoading(false);
    //   }
    // });
    router.push("/");
    setUser(null);
    setLoading(false);
  };

  const singUp = async (
    email: string,
    name: string,
    lastname: string,
    password: string,
    role: string
  ) => {
    try {
      const response = await fetch(`api/users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: name,
          lastName: lastname,
          password: password,
          role: role,
        }),
      });

      if (response.status === 201) {
        setLoading(false);
      }
      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const changePassword = async (password: string, newPassword: string) => {
    if (!user) {
      return { error: "No hay ningun usuario logueado" };
    }
    try {
      setLoading(true);

      const res = await fetch(`/api/users/${user.id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, newPassword }),
      });
      const data = await res.json();
      if (res.status == 200) {
        setLoading(false);
        return data.message;
      }

      if (data.error) {
        setLoading(false);
        return data.error;
      }
    } catch (error) {
      setLoading(false);
      return "Error al cambiar la contraseña";
    }
  };

  // const requestReset = async (email: string, token: string) => {
  //   await fetch(`${process.env.NEXT_PUBLIC_API}/auth/resetPassword/request`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: email,
  //       token: token,
  //     }),
  //   }).then(async (res) => {
  //     if (res.status == 200) {
  //       setLoading(false);
  //     }
  //   });
  // };

  // const resetPassword = async (password: string, token: string) => {
  //   await fetch(`${process.env.NEXT_PUBLIC_API}/auth/resetPassword/submit`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       password: password,
  //       token: token,
  //     }),
  //   }).then(async (res) => {
  //     if (res.status == 200) {
  //       setLoading(false);
  //     }
  //   });
  // };

  useEffect(() => {
    // if (!user) {
    //   const fetchUserData = async () => {
    //     await fetch(`${process.env.NEXT_PUBLIC_API}/users/profile`, {
    //       method: "GET",
    //       credentials: "include",
    //     })
    //       .then(async (res) => {
    //         if (res.status == 200) {
    //           const data = await res.json();
    //           setUser(data);
    //         }
    //       })
    //       .finally(() => setLoading(false));
    //   };
    //   fetchUserData();
    // }
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        singUp,
        loading,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
