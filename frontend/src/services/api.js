import axios from "axios";

const api = axios.create({
    baseURL: "https://melodyhub-backend-y195.onrender.com",
    withCredentials: true
});

export default api;