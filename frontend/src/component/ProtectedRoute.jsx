import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../redux/slices/authSlice";

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

//Protect admin routes
export const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  if (!user.isAdmin) {
    return <Navigate to="/tasks" />;
  }
  return children;
};

//redirect authenticated users away from auth pages

export const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  if (isAuthenticated) {
    //if admin, go to the admin dashboard
    if (user.isAdmin) {
      return <Navigate to="/admin/dashboard" />;
    }
    //if normal user, go to tasks

    return <Navigate to="/home" />;
  }
  return children;
};
