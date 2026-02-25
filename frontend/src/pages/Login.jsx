import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(
        res.data?.data.token,
        res.data?.data?.user?.role,
        res.data?.data?.user?.id,
      );
      navigate(res.data?.data.role === "vendor" ? "/vendor" : "/buyer");
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-xl shadow-xl w-96 flex flex-col"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>

        <input
          className="input mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="input mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn bg-blue-600 text-white hover:bg-blue-700 w-full py-2 rounded mb-4">
          Login
        </button>

        {/* Signup link */}
        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800 font-medium"
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
