"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import userService from "../api/userServices";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Sending login data:", formData);

    try {
      const response = await userService.login(formData);
      console.log("Login successful:", response);
      dispatch(
        setCredentials({
          token: response.data.token,
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
        })
      );
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h1 className="mb-8 text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
          🔐 Welcome Back
        </h1>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:scale-95 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "🚀 Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
