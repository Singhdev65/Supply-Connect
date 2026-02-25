import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error),
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
API.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();

    // ✅ Show success toast ONLY for write operations
    if (["post", "put", "patch", "delete"].includes(method)) {
      const message =
        response.data?.message || "Operation completed successfully";

      toast.success(message);
    }

    return response;
  },
  (error) => {
    let message = "Something went wrong";

    // ❌ Network error
    if (!error.response) {
      message = "Network error. Please check your connection.";
    }
    // ❌ Backend error
    else {
      const { status, data } = error.response;

      if (status === 401) {
        message = "Session expired. Please login again.";
        localStorage.removeItem("token");
      } else if (status === 403) {
        message = "You are not authorized to perform this action.";
      } else if (status === 404) {
        message = "Requested resource not found.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      } else {
        message = data?.message || message;
      }
    }

    toast.error(message);

    return Promise.reject(error);
  },
);

export default API;
