import axios from 'axios';
import {handleError} from '../helpers/handleError';

const api = "http://localhost:8184/"

const axiosInstance = axios.create({
    baseURL: api,
    withCredentials: true,
    headers:{Authorization: `Bearer ${localStorage.getItem("token")}`},
});

export const loginAPI = async(email: string, password: string)=>{
     try {
    const response = await axios.post(
      api + "v1/auth/sign-in",
      { email, password }
    );
    console.log("LoginAPi response:", response.data);
    // Check if the response contains the access token and user data
    const accessToken = response.data.accessToken || response.data.token || response.data.data?.accessToken;
    const user = response.data.user || response.data.data?.user;

    if (!accessToken) {
      throw new Error("No access token received from server");
       }   

    localStorage.setItem("token", accessToken);
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }  
    
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer + ${accessToken}`;

    return accessToken;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const refreshTokenAPI = async()=>{
    try {
       const response = await axiosInstance.post<{ accessToken: string }>(api + "v1/auth/refresh-token");
       return response.data.accessToken; 
        
    } catch (error) {
        handleError(error);
        throw error;
    }
}


axiosInstance.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(error. response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const newAccesstoken = await refreshTokenAPI();
                localStorage.setItem("token", newAccesstoken);
                axiosInstance.defaults.headers.common["Authorization"] =`Bearer ${newAccesstoken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccesstoken}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/dashboard";
                return Promise.reject(error);
            }
    }
        return Promise.reject(error);
    }
);

export const registerAPI = async(userName: string, email: string, password: string)=>{
    try {
        const response = await axios.post( api + "usersRegister", {
            username: userName,
            email,
            password,
            
        });
       
        const datawithToken = {
            token: `fake-jwt-token-${Date.now()}`,
            userName: response.data.userName,
            email: response.data.email,
            
        };

        console.log("datawithToken:", datawithToken);

        await axiosInstance.post(api + "tokens",datawithToken);
        return datawithToken;   
       

    }catch (error) {
        handleError(error);
        throw error;
    }

}

export default axiosInstance;