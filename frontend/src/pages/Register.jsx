"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../api/userServices";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
    try {
      const response = await userService.register(formData);
      console.log("Registration successful", response);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h1 className="mb-8 text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
          📝 Create Account
        </h1>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
              required
            />
          </div>

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
            {loading ? "Creating account..." : "✨ Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
