import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TaskManager from "./pages/TaskManager";
import AuthSuccess from "./pages/AuthSuccess";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import {
  AdminRoute,
  GuestRoute,
  ProtectedRoute,
} from "./component/ProtectedRoute";
import Profile from "./component/Profile";
import { store } from "./redux/store";

const App = () => {
  // const currentState = store.getState();
  // console.log("🔍 FULL STORE STATE:", currentState);
  // console.log("🔍 AUTH SLICE:", currentState.auth);
  // console.log("🔍 PERSIST STATE:", currentState._persist);
  // console.log("🔍 AUTH PERSIST:", currentState.auth?._persist);

  return (
    <Routes>
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/admin/login"
        element={
          <GuestRoute>
            <AdminLogin />
          </GuestRoute>
        }
      />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <TaskManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      {/* //default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* //catch all redirects to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
