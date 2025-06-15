import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api", // base untuk semua API
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000000,
});

export default axiosClient;
