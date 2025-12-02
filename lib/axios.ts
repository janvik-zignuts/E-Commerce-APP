import axios from "axios";

const api = axios.create({
  baseURL: "/api", // All API routes will start with /api
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;