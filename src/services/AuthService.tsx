import axios from 'axios';
import {handleError} from '../helpers/handleError';
import { UserProfileToken } from '../Models/user';

const api = "http://localhost:8184/"

const axiosInstance = axios.create({
    baseURL: api,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const loginAPI = async(email: string, password: string)=>{
    try {
        const response = await axios.post<UserProfileToken>( api + "v1/auth/sign-in", {
            email: email,
            password: password,
        });
        
        const {email :userEmail} = response.data;
        const TokenCheck = await axios.get(`http://localhost:8184/tokens?email=${userEmail}`);

        if(TokenCheck.data.length > 0){
            const userToken = TokenCheck.data[0].token;          
           console.log("Token:", userToken);
            return userToken;
        }else{
            throw new Error("Token not found");
        }
    }catch (error) {
        handleError(error);
    }
};

export const refreshTokenAPI = async()=>{
    try {
       const response = await axiosInstance.post<{ accessToken: string }>(api + "refreshToken");
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
                window.location.href = "/login";
                return Promise.reject(error);
            }
    }
        return Promise.reject(error);
    }
);

// export const registerAPI = async(userName: string, email: string, password: string)=>{
//     try {
//         const response = await axios.post<UserProfileToken>( api + "usersRegister", {
//             username: userName,
//             email,
//             password,
            
//         });
       
//         const datawithToken = {
//             token: `fake-jwt-token-${Date.now()}`,
//             userName: response.data.userName,
//             email: response.data.email,
            
//         };

//         console.log("datawithToken:", datawithToken);

//         await axiosInstance.post(api + "tokens",datawithToken);
//         return datawithToken;   
       

//     }catch (error) {
//         handleError(error);
//         throw error;
//     }

// }

export default axiosInstance;