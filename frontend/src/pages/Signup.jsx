import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/signup", form);
    login(res.data?.data.token, form.role);
    navigate(form.role === "vendor" ? "/vendor" : "/buyer");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-xl shadow-xl w-96"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Signup</h1>
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="vendor">Vendor</option>
        </select>
        <button className="btn bg-blue-600 text-white hover:bg-blue-700 w-full mt-4">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
