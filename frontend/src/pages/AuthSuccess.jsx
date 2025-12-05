"use client";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    const decoded = jwtDecode(token);

    dispatch(
      setCredentials({
        token,
        user: {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          isAdmin: decoded.isAdmin || false,
          permissions: decoded.permissions || [],
          role: decoded.role || null,
        },
      })
    );

    navigate("/home");
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
