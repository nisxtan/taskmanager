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
    if (token) {
      const decoded = jwtDecode(token);
      console.log(token);
      console.log(decoded);
      dispatch(
        setCredentials({
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          token: token,
        })
      );
      localStorage.setItem("token", token);
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
