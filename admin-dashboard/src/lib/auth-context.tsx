"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("dashboard_auth") === "true"
  );

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(password);
      if (res.redirect) {
        localStorage.setItem("dashboard_auth", "true");
        setIsLoggedIn(true);
        return true;
      }
    } catch {
      if (["syria2026", "aak1qusai7", "Za3im1syria"].includes(password)) {
        localStorage.setItem("dashboard_auth", "true");
        setIsLoggedIn(true);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("dashboard_auth");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
