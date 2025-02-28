"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth } from "../utils/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    address: string
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await auth.getProfile();
        setUser(data);
      }
    } catch (error) {
      setError(error as string);
      console.error("Error checking authentication:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await auth.login({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setError(null);
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    address: string
  ) => {
    try {
      const response = await auth.register({
        email,
        password,
        name,
        address,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (error) {
      setError(error as string);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
