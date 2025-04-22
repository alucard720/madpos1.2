import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/user";
import { useNavigate } from "react-router-dom";
import { loginAPI, refreshTokenAPI, } from "../services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";


interface UserContextType  {
  user: UserProfile | null;
  token: string | null;
  // registerUser: (email: string, username: string, password: string) => void;
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
  const [user, setUser] = useState<UserProfile | null>(null);
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

  // const registerUser = async (
  //   email: string,
  //   username: string,
  //   password: string
  // ) => {
  //   try {
  //     const res = await registerAPI(username, email, password);
  //     if (res) {
  //       localStorage.setItem("token", res.token);
  //       const userObj = {
  //         userName: username,
  //         email: email,
  //         password: res.token,
  //       };

  //       localStorage.setItem("user", JSON.stringify(userObj));
  //       setToken(res.token);
  //       setUser(userObj);
  //       toast.success("Registro Exitoso");
  //       navigate("/login");
  //     }
  //   } catch (e) {
  //     console.error("Registro error:", e);
  //     toast.warning("server error occurred");
  //   }
  // };


  const loginUser = async (email: string, password: string) => {
    console.log(email);
    console.log(password);
    // try {
    //   const res = await loginAPI(email, password);
    //   if(res){
    //     localStorage.setItem("token", res.token);
    //     const userObj ={        
    //       email: email,
    //       password:res.token,          
    //     };

    //     localStorage.setItem("user", JSON.stringify(userObj));
    //     setToken(res.token)
    //     setUser(userObj)
    //     toast.success("Login Exitoso")
    //     navigate("/home");
    //   }
    // } catch (e) {
    //   console.error('Login error:', e);
    //   toast.warning("server error occurred")
    // }
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
      value={{ user, token, logout, isLoggedIn, loginUser, refreshToken,  }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const UserAuth = () => React.useContext(UserContext);