import { createContext, useEffect, useState } from "react";
// import { UserProfile } from "../Models/user";
import { useNavigate } from "react-router-dom";
import { loginAPI, refreshTokenAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type UserRole = "administrator" | "cashier" | "owner" 

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  lastLogin?: string
}

interface UserContextType  {
  user: User | null;
  token: string | null;
  registerUser: (name: string, email: string, password: string, role: UserRole, status: string) => Promise<void>;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  refreshToken: () => Promise<void>;
};

interface Props  { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  

  const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    status: string,
  ) : Promise<void> => {
    try {
      const res = await registerAPI(name, email, password,);
      if (res) {
        localStorage.setItem("token", res.token);
        const userObj: User = {
          id: "", // Replace with actual user ID from API response
          name: res.userName, // Replace with actual user name from API response
          email: email,
          role: role, // Replace with actual role from API response
          lastLogin: new Date().toISOString(), // Optional: Replace with actual last login time
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(res.token);
        setUser(userObj);
        toast.success("Registro Exitoso");
        navigate("/login");
      }
    } catch (e) {
      console.error("Registro error:", e);
      toast.warning("server error occurred");
    }
  };


  const loginUser = async (email: string, password: string) => {
   
    try {
      const token = await loginAPI(email, password);
      if (token) {
        localStorage.setItem("token", token);
        const userObj: User = {        
          id: token.id, // Replace with actual user ID from API response
          name: token.User_fullname,  // Replace with actual user name from API response
          email: email,
          role: token.role,    // Replace with actual role from API response
          lastLogin: new Date().toISOString(), // Optional: Replace with actual last login time
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(token);
        setUser(userObj);
        // toast.success("Login Exitoso")
        navigate("/dashboard");
      }
    } catch (e) {
      console.error('Login error:', e);
      toast.warning("server error occurred")
    }
  };

  const refreshToken = async () => {
    try {
      const newToken = await refreshTokenAPI()
      localStorage.setItem("token", newToken);
      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      if(user){
        const userObj = {
          ...user,
          token: newToken,
        };
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
   }

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ user, token, logout, isLoggedIn, loginUser, refreshToken, registerUser  }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const UserAuth = () => React.useContext(UserContext);