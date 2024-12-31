import axios from "axios";

export const ApiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api',
});


ApiClient.defaults.headers.common = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

ApiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);


ApiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

ApiClient.interceptors.response.use(
    (config) => config,
    (error) => Promise.reject(error)
)
