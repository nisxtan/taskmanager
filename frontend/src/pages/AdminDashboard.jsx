import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate("/admin/login");
    }
  });

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
